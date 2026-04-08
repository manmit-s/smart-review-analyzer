from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class ExtractRequest(BaseModel):
    url: str
    max_reviews: int = 100
    sort: str = "recent"

class ProductResponse(BaseModel):
    id: str
    name: str
    created_at: datetime
    class Config:
        from_attributes = True

class JobResponse(BaseModel):
    id: int
    url: str
    status: str
    reviews_extracted: int
    created_at: datetime
    completed_at: Optional[datetime]
    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    product_id: str
    job_id: Optional[int]
    reviewer_name: str
    rating: float
    review_content: str
    sentiment: str

class ReviewResponse(ReviewBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class PaginatedReviews(BaseModel):
    total: int
    items: List[ReviewResponse]

class AnalyticsResponse(BaseModel):
    total_scraped: int
    avg_rating: float
    sentiment_score: int
    latency: int
