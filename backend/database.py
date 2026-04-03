import os
import urllib.parse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# We can use discrete environment variables to safely handle special characters like #, @, etc.
db_user = os.getenv("DB_USER", "postgres")
db_pass = os.getenv("DB_PASS", "postgres")
db_host = os.getenv("DB_HOST", "localhost")
db_port = os.getenv("DB_PORT", "5432")
db_name = os.getenv("DB_NAME", "steam_reviews_db")

# Automatically URL-encode the password to handle any special characters securely
safe_pass = urllib.parse.quote_plus(db_pass)

SQLALCHEMY_DATABASE_URL = f"postgresql://{db_user}:{safe_pass}@{db_host}:{db_port}/{db_name}"

# Establish connection to PostgreSQL
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()