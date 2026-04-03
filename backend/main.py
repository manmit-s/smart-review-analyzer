from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text, func
import time
import re
import models, schemas
from database import engine, get_db
from services.scraper import fetch_steam_reviews

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SteamReview Analyzer API")

# Configure CORS so the React frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_app_id(url: str) -> str:
    if url.isdigit():
        return url
    match = re.search(r"app/(\d+)", url)
    if match:
        return match.group(1)
    raise HTTPException(status_code=400, detail="Invalid Steam URL or App ID")

@app.post("/api/extract")
def extract_reviews(request: schemas.ExtractRequest, db: Session = Depends(get_db)):
    app_id = extract_app_id(request.url)
    
    start_time = time.time()
    extracted_data = fetch_steam_reviews(app_id=app_id, max_reviews=request.max_reviews, sort=request.sort.lower().replace(" ", ""))
    latency = int((time.time() - start_time) * 1000)
    
    new_reviews = []
    positive_count = 0

    for idx, review_data in enumerate(extracted_data):
        review = models.Review(**review_data)
        db.add(review)
        new_reviews.append(review)
        if review.sentiment == "Positive":
             positive_count += 1
    
    db.commit()
    
    rate = 100.0 if extracted_data else 0.0
    sentiment_score = int((positive_count / len(extracted_data) * 100)) if extracted_data else 0

    return {
        "status": "success",
        "extracted_count": len(extracted_data),
        "latency_ms": latency,
        "extraction_rate": rate,
        "sentiment_score": sentiment_score
    }

@app.get("/api/reviews", response_model=schemas.PaginatedReviews)
def get_recent_reviews(limit: int = 10, skip: int = 0, db: Session = Depends(get_db)):
    # Get newest reviews across the system with pagination
    total = db.query(models.Review).count()
    reviews = db.query(models.Review).order_by(models.Review.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "items": reviews}

@app.get("/api/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(db: Session = Depends(get_db)):
    total_scraped = db.query(models.Review).count()
    if total_scraped == 0:
        return {"total_scraped": 0, "avg_rating": 0.0, "sentiment_score": 0, "latency": 0}
        
    avg_rating = db.query(func.avg(models.Review.rating)).scalar()
    
    positives = db.query(models.Review).filter(models.Review.sentiment == "Positive").count()
    sentiment_score = int((positives / total_scraped) * 100)
    
    return {
        "total_scraped": total_scraped,
        "avg_rating": round(avg_rating or 0, 1),
        "sentiment_score": sentiment_score,
        "latency": 240 # Default baseline latency to mock p95
    }

@app.get("/")
def read_root():
    return {"message": "SteamReview Analyzer API is running"}

@app.get("/api/health")
def health_check(db: Session = Depends(get_db)):
    try:
        # Simple query to check if the database is reachable
        db.execute(text("SELECT 1"))
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")