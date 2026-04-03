from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(String, index=True)
    reviewer_name = Column(String, index=True)
    rating = Column(Float)
    review_content = Column(String)
    sentiment = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)