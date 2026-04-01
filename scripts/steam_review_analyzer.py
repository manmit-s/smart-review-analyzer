import argparse
import datetime as dt
import re
from pathlib import Path

import pandas as pd
import requests


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


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-zA-Z']+", text.lower())


def lexicon_sentiment(text: str) -> tuple[str, int]:
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


def fetch_steam_reviews(app_id: int, max_reviews: int, language: str = "english") -> list[dict]:
    cursor = "*"
    all_reviews: list[dict] = []

    session = requests.Session()
    session.headers.update({"User-Agent": "Mozilla/5.0"})

    while len(all_reviews) < max_reviews:
        num_per_page = min(100, max_reviews - len(all_reviews))
        params = {
            "json": 1,
            "language": language,
            "filter": "recent",
            "num_per_page": num_per_page,
            "cursor": cursor,
            "purchase_type": "all",
        }

        resp = session.get(STEAM_REVIEW_API.format(app_id=app_id), params=params, timeout=30)
        resp.raise_for_status()
        payload = resp.json()

        reviews = payload.get("reviews", [])
        if not reviews:
            break

        all_reviews.extend(reviews)
        cursor = payload.get("cursor", cursor)

        if len(reviews) < num_per_page:
            break

    return all_reviews[:max_reviews]


def to_dataframe(reviews: list[dict]) -> pd.DataFrame:
    rows = []
    for review in reviews:
        text = clean_text(review.get("review", ""))
        voted_up = bool(review.get("voted_up", False))
        platform_sentiment = "Positive" if voted_up else "Negative"
        lex_label, lex_score = lexicon_sentiment(text)

        rows.append(
            {
                "review": text,
                "platform_sentiment": platform_sentiment,
                "lexicon_sentiment": lex_label,
                "lexicon_score": lex_score,
                "voted_up": voted_up,
                "votes_up": review.get("votes_up", 0),
                "votes_funny": review.get("votes_funny", 0),
                "playtime_hours": round(review.get("author", {}).get("playtime_forever", 0) / 60, 2),
                "timestamp_created": dt.datetime.fromtimestamp(review.get("timestamp_created", 0)),
            }
        )

    df = pd.DataFrame(rows)
    if not df.empty:
        df = df[df["review"].str.len() > 0].drop_duplicates(subset=["review"]).reset_index(drop=True)
    return df


def print_summary(df: pd.DataFrame) -> None:
    if df.empty:
        print("No reviews found.")
        return

    print(f"Total reviews: {len(df)}")
    print("\nPlatform sentiment distribution:")
    print(df["platform_sentiment"].value_counts())

    print("\nLexicon sentiment distribution:")
    print(df["lexicon_sentiment"].value_counts())

    comparable = df[df["lexicon_sentiment"] != "Neutral"]
    if not comparable.empty:
        agreement = (comparable["platform_sentiment"] == comparable["lexicon_sentiment"]).mean() * 100
        print(f"\nAgreement (excluding Neutral): {agreement:.1f}%")


def main() -> None:
    parser = argparse.ArgumentParser(description="Steam review scraper + sentiment analyzer")
    parser.add_argument("--app-id", type=int, default=730, help="Steam app id (default: 730 for CS2)")
    parser.add_argument("--max-reviews", type=int, default=300, help="Maximum reviews to fetch")
    parser.add_argument("--language", type=str, default="english", help="Review language")
    parser.add_argument("--out", type=str, default="reviews.csv", help="Output CSV path")
    args = parser.parse_args()

    reviews = fetch_steam_reviews(app_id=args.app_id, max_reviews=args.max_reviews, language=args.language)
    df = to_dataframe(reviews)
    print_summary(df)

    output_path = Path(args.out)
    df.to_csv(output_path, index=False)
    print(f"\nSaved {len(df)} reviews to: {output_path.resolve()}")


if __name__ == "__main__":
    main()
