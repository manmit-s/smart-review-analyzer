from pydantic import BaseModel
from datetime import datetime
from typing import List

class ExtractRequest(BaseModel):
    url: str
    max_reviews: int = 100
    sort: str = "recent"

class ReviewBase(BaseModel):
    product_id: str
    reviewer_name: str
    rating: float
    review_content: str
    sentiment: str

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class AnalyticsResponse(BaseModel):
    total_scraped: int
    avg_rating: float
    sentiment_score: int
    latency: int
