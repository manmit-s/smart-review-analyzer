from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from database import Base
import datetime

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String, primary_key=True, index=True) # Steam App ID
    name = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ScrapingJob(Base):
    __tablename__ = "scraping_jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String)
    status = Column(String, default="Pending") # Pending, Running, Completed, Failed
    reviews_extracted = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, ForeignKey("products.id"), index=True)
    job_id = Column(Integer, ForeignKey("scraping_jobs.id"), index=True, nullable=True)
    reviewer_name = Column(String, index=True)
    rating = Column(Float)
    review_content = Column(String)
    sentiment = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)