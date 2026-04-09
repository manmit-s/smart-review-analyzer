from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text, func
from typing import Optional, List
import time
import re
import requests
import datetime
import models, schemas
from database import engine, get_db
from services.scraper import fetch_steam_reviews

# Create database tables (without dropping them, so data persists)
# models.Base.metadata.drop_all(bind=engine)
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

app_name_cache = {}

def get_game_name_internal(app_id: str):
    if app_id in app_name_cache:
        return {"name": app_name_cache[app_id]}
    try:
        resp = requests.get(f"https://store.steampowered.com/api/appdetails?appids={app_id}", timeout=5)
        if resp.status_code == 200:
            data = resp.json()
            if data and str(app_id) in data and data[str(app_id)].get("success"):
                name = data[str(app_id)]["data"]["name"]
                app_name_cache[app_id] = name
                return {"name": name}
    except Exception as e:
        print("Error fetching game name:", e)
    return {"name": f"App ID {app_id}"}


@app.post("/api/extract")
def extract_reviews(request: schemas.ExtractRequest, db: Session = Depends(get_db)):
    app_id = extract_app_id(request.url)
    
    # 1. Product Verification
    product = db.query(models.Product).filter(models.Product.id == app_id).first()
    if not product:
        name_info = get_game_name_internal(app_id)
        product = models.Product(id=app_id, name=name_info["name"])
        db.add(product)
        db.commit()

    # 2. Job Creation
    job = models.ScrapingJob(url=request.url, status="Running")
    db.add(job)
    db.commit()
    db.refresh(job)

    start_time = time.time()
    try:
        extracted_data = fetch_steam_reviews(app_id=app_id, max_reviews=request.max_reviews, sort=request.sort.lower().replace(" ", ""))
    except Exception as e:
        job.status = "Failed"
        job.completed_at = datetime.datetime.utcnow()
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))
        
    latency = int((time.time() - start_time) * 1000)
    
    new_reviews = []
    positive_count = 0

    for idx, review_data in enumerate(extracted_data):
        review = models.Review(**review_data, job_id=job.id)
        db.add(review)
        new_reviews.append(review)
        if review.sentiment == "Positive":
             positive_count += 1
    
    # Update Job completion
    job.status = "Completed"
    job.reviews_extracted = len(extracted_data)
    job.completed_at = datetime.datetime.utcnow()

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
def get_recent_reviews(
    limit: int = 10, 
    skip: int = 0, 
    sentiment: Optional[str] = None, 
    rating: Optional[float] = None, 
    product_id: Optional[str] = None,
    db: Session = Depends(get_db)):
    
    query = db.query(models.Review)
    if sentiment:
        query = query.filter(models.Review.sentiment == sentiment)
    if rating:
        query = query.filter(models.Review.rating == rating)
    if product_id:
        query = query.filter(models.Review.product_id == product_id)
        
    total = query.count()
    reviews = query.order_by(models.Review.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "items": reviews}

@app.get("/api/games")
def get_scraped_games(db: Session = Depends(get_db)):
    # Simpler and faster using the new Product table
    products = db.query(models.Product).all()
    return [{"id": p.id, "name": p.name} for p in products]

@app.get("/api/games/{app_id}")
def get_game_name(app_id: str, db: Session = Depends(get_db)):
    # Fallback to local table then API
    product = db.query(models.Product).filter(models.Product.id == app_id).first()
    if product:
        return {"name": product.name}
    return get_game_name_internal(app_id)


@app.get("/api/products", response_model=List[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).order_by(models.Product.created_at.desc()).all()

@app.get("/api/jobs", response_model=List[schemas.JobResponse])
def get_jobs(db: Session = Depends(get_db)):
    return db.query(models.ScrapingJob).order_by(models.ScrapingJob.created_at.desc()).all()


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