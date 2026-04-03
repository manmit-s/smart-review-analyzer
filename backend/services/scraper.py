import re
import requests
import datetime as dt
from typing import List, Dict

STEAM_REVIEW_API = "https://store.steampowered.com/appreviews/{app_id}"

POSITIVE_WORDS = {
    "good", "great", "amazing", "awesome", "excellent", "fun", "love", "best",
    "smooth", "enjoy", "enjoyed", "nice", "fantastic", "perfect", "recommend",
    "addictive", "masterpiece", "cool", "beautiful", "impressive", "solid",
}

NEGATIVE_WORDS = {
    "bad", "worst", "awful", "boring", "bug", "bugs", "broken", "hate", "terrible",
    "lag", "laggy", "crash", "crashes", "refund", "waste", "disappointing", "slow",
    "unplayable", "poor", "annoying", "problem", "issues",
}

NEGATIONS = {"not", "never", "no", "hardly", "rarely", "none"}

def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text or "").strip()
    return text

def tokenize(text: str) -> list:
    return re.findall(r"[a-zA-Z']+", text.lower())

def lexicon_sentiment(text: str) -> tuple:
    tokens = tokenize(text)
    score = 0
    for i, token in enumerate(tokens):
        polarity = 0
        if token in POSITIVE_WORDS:
            polarity = 1
        elif token in NEGATIVE_WORDS:
            polarity = -1

        if polarity != 0 and i > 0 and tokens[i - 1] in NEGATIONS:
            polarity = -polarity

        score += polarity

    if score > 0:
        return "Positive", score
    if score < 0:
        return "Negative", score
    return "Neutral", score

def fetch_steam_reviews(app_id: str, max_reviews: int = 100, sort: str = "recent") -> List[Dict]:
    cursor = "*"
    all_reviews = []

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0"})

    while len(all_reviews) < max_reviews:
        num_per_page = min(100, max_reviews - len(all_reviews))
        params = {
            "json": 1,
            "language": "english",
            "filter": sort,
            "num_per_page": num_per_page,
            "cursor": cursor,
            "purchase_type": "all",
        }

        try:
            resp = session.get(STEAM_REVIEW_API.format(app_id=app_id), params=params, timeout=30)
            resp.raise_for_status()
            payload = resp.json()
        except requests.RequestException:
            break

        if payload.get("success") != 1:
            break

        reviews = payload.get("reviews", [])
        if not reviews:
            break

        for review in reviews:
            text = clean_text(review.get("review", ""))
            if not text:
                continue

            voted_up = bool(review.get("voted_up", False))
            lex_label, _ = lexicon_sentiment(text)
            
            # Map vote up/down to 5/1 stars
            rating = 5.0 if voted_up else 1.0
            reviewer_name = review.get("author", {}).get("steamid", "Unknown")

            all_reviews.append({
                "product_id": app_id,
                "reviewer_name": reviewer_name,
                "rating": rating,
                "review_content": text,
                "sentiment": lex_label
            })
            
            if len(all_reviews) >= max_reviews:
                break

        cursor = payload.get("cursor", cursor)

    return all_reviews