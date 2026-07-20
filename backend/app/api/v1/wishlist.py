from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.dependencies.auth import get_db, get_current_user
from app.models.wishlist import Wishlist
from app.models.listing import Listing
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.wishlist import WishlistResponse

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

@router.get("", response_model=APIResponse[List[WishlistResponse]])
def get_user_wishlist(
    sort_by: Optional[str] = Query("newest"),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all saved wishlist items for authenticated user.
    """
    query = db.query(Wishlist).options(
        joinedload(Wishlist.listing).joinedload(Listing.seller),
        joinedload(Wishlist.listing).joinedload(Listing.category),
        joinedload(Wishlist.listing).joinedload(Listing.images)
    ).filter(Wishlist.user_id == current_user.id)

    if sort_by == "price_asc":
        query = query.join(Wishlist.listing).order_by(Listing.price.asc())
    elif sort_by == "price_desc":
        query = query.join(Wishlist.listing).order_by(Listing.price.desc())
    else:
        query = query.order_by(Wishlist.created_at.desc())

    items = query.offset(skip).limit(limit).all()
    resp_items = [WishlistResponse.model_validate(item) for item in items]

    return APIResponse(
        success=True,
        message="Wishlist items retrieved successfully",
        data=resp_items
    )

@router.get("/count", response_model=APIResponse[dict])
def get_wishlist_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get total count of saved wishlist items for current user.
    """
    count = db.query(Wishlist).filter(Wishlist.user_id == current_user.id).count()
    return APIResponse(
        success=True,
        message="Wishlist count retrieved",
        data={"count": count}
    )

@router.post("/{listing_id}", response_model=APIResponse[WishlistResponse], status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Save an item listing to user's wishlist.
    """
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    existing = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.listing_id == listing_id
    ).first()

    if existing:
        full_item = db.query(Wishlist).options(
            joinedload(Wishlist.listing).joinedload(Listing.seller),
            joinedload(Wishlist.listing).joinedload(Listing.category),
            joinedload(Wishlist.listing).joinedload(Listing.images)
        ).filter(Wishlist.id == existing.id).first()
        return APIResponse(
            success=True,
            message="Item is already in your wishlist",
            data=WishlistResponse.model_validate(full_item)
        )

    new_wishlist = Wishlist(user_id=current_user.id, listing_id=listing_id)
    db.add(new_wishlist)
    db.commit()
    db.refresh(new_wishlist)

    full_item = db.query(Wishlist).options(
        joinedload(Wishlist.listing).joinedload(Listing.seller),
        joinedload(Wishlist.listing).joinedload(Listing.category),
        joinedload(Wishlist.listing).joinedload(Listing.images)
    ).filter(Wishlist.id == new_wishlist.id).first()

    return APIResponse(
        success=True,
        message="Saved to wishlist!",
        data=WishlistResponse.model_validate(full_item)
    )

@router.delete("/{listing_id}", response_model=APIResponse[dict])
def remove_from_wishlist(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Remove an item listing from user's wishlist.
    """
    item = db.query(Wishlist).filter(
        Wishlist.user_id == current_user.id,
        Wishlist.listing_id == listing_id
    ).first()

    if item:
        db.delete(item)
        db.commit()

    return APIResponse(
        success=True,
        message="Removed from wishlist",
        data={"listing_id": listing_id}
    )
