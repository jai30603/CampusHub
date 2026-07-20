from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.base import BaseRepository
from app.models.listing import Listing

class ListingRepository(BaseRepository[Listing]):
    def __init__(self):
        super().__init__(Listing)

    def get_by_category(self, db: Session, category_id: int, skip: int = 0, limit: int = 20) -> List[Listing]:
        return db.query(Listing).filter(Listing.category_id == category_id, Listing.status == "active").offset(skip).limit(limit).all()

    def get_by_seller(self, db: Session, seller_id: int) -> List[Listing]:
        return db.query(Listing).filter(Listing.seller_id == seller_id).all()

listing_repository = ListingRepository()
