import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status
from sqlalchemy.orm import Session, joinedload
from app.dependencies.auth import get_db, get_current_user
from app.models.listing import Listing, ListingImage
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.listing import ListingResponse, ListingCreate

router = APIRouter(prefix="/listings", tags=["Listings"])

# Base uploads directory for listing images
LISTING_UPLOADS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "listings")
os.makedirs(LISTING_UPLOADS_DIR, exist_ok=True)

@router.get("", response_model=APIResponse[List[ListingResponse]])
def get_listings(
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    college: Optional[str] = Query(None),
    condition: Optional[str] = Query(None),
    max_price: Optional[float] = Query(None),
    sort_by: Optional[str] = Query("newest"),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """
    Search and filter campus listings with server-side query filters.
    """
    query = db.query(Listing).options(
        joinedload(Listing.seller),
        joinedload(Listing.category),
        joinedload(Listing.images)
    ).filter(Listing.status == "active")

    if category_id:
        query = query.filter(Listing.category_id == category_id)

    if condition:
        query = query.filter(Listing.condition == condition)

    if max_price is not None:
        query = query.filter(Listing.price <= max_price)

    if college:
        query = query.join(Listing.seller).filter(User.college == college)

    if search and search.strip():
        search_term = f"%{search.strip()}%"
        query = query.filter(
            (Listing.title.ilike(search_term)) | (Listing.description.ilike(search_term))
        )

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(Listing.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Listing.price.desc())
    else:
        query = query.order_by(Listing.created_at.desc())

    listings = query.offset(skip).limit(limit).all()
    resp_items = [ListingResponse.model_validate(l) for l in listings]

    return APIResponse(
        success=True,
        message="Listings retrieved successfully",
        data=resp_items
    )

@router.get("/user/me", response_model=APIResponse[List[ListingResponse]])
def get_my_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve listings created by the currently authenticated user.
    """
    listings = db.query(Listing).options(
        joinedload(Listing.seller),
        joinedload(Listing.category),
        joinedload(Listing.images)
    ).filter(Listing.seller_id == current_user.id).order_by(Listing.created_at.desc()).all()

    resp_items = [ListingResponse.model_validate(l) for l in listings]
    return APIResponse(
        success=True,
        message="User listings retrieved successfully",
        data=resp_items
    )

@router.get("/{listing_id}", response_model=APIResponse[ListingResponse])
def get_listing_detail(listing_id: int, db: Session = Depends(get_db)):
    """
    Get detailed information for a specific listing.
    """
    listing = db.query(Listing).options(
        joinedload(Listing.seller),
        joinedload(Listing.category),
        joinedload(Listing.images)
    ).filter(Listing.id == listing_id).first()

    if not listing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Listing not found"
        )

    return APIResponse(
        success=True,
        message="Listing detail retrieved",
        data=ListingResponse.model_validate(listing)
    )

@router.post("", response_model=APIResponse[ListingResponse], status_code=status.HTTP_201_CREATED)
def create_listing(
    listing_in: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new campus marketplace listing.
    """
    new_listing = Listing(
        title=listing_in.title,
        description=listing_in.description,
        price=listing_in.price,
        condition=listing_in.condition,
        category_id=listing_in.category_id,
        seller_id=current_user.id,
        attributes=listing_in.attributes or {},
        status="active"
    )

    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)

    # Attach images
    for idx, img_url in enumerate(listing_in.images):
        listing_img = ListingImage(
            listing_id=new_listing.id,
            image_url=img_url,
            sort_order=idx
        )
        db.add(listing_img)

    db.commit()
    db.refresh(new_listing)

    # Re-query with relationships loaded
    full_listing = db.query(Listing).options(
        joinedload(Listing.seller),
        joinedload(Listing.category),
        joinedload(Listing.images)
    ).filter(Listing.id == new_listing.id).first()

    return APIResponse(
        success=True,
        message="Listing created successfully!",
        data=ListingResponse.model_validate(full_listing)
    )

@router.put("/{listing_id}", response_model=APIResponse[ListingResponse])
def update_listing(
    listing_id: int,
    listing_in: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update an existing listing owned by the current user.
    """
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if listing.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to edit this listing")

    listing.title = listing_in.title
    listing.description = listing_in.description
    listing.price = listing_in.price
    listing.condition = listing_in.condition
    listing.category_id = listing_in.category_id
    listing.attributes = listing_in.attributes or {}

    # Update images if provided
    if listing_in.images:
        db.query(ListingImage).filter(ListingImage.listing_id == listing_id).delete()
        for idx, img_url in enumerate(listing_in.images):
            db.add(ListingImage(listing_id=listing_id, image_url=img_url, sort_order=idx))

    db.commit()

    full_listing = db.query(Listing).options(
        joinedload(Listing.seller),
        joinedload(Listing.category),
        joinedload(Listing.images)
    ).filter(Listing.id == listing_id).first()

    return APIResponse(
        success=True,
        message="Listing updated successfully",
        data=ListingResponse.model_validate(full_listing)
    )

@router.delete("/{listing_id}", response_model=APIResponse[dict])
def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a listing owned by the current user.
    """
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if listing.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to delete this listing")

    db.delete(listing)
    db.commit()

    return APIResponse(
        success=True,
        message="Listing deleted successfully",
        data={"listing_id": listing_id}
    )

@router.post("/upload-images", response_model=APIResponse[List[str]])
async def upload_listing_images(
    files: List[UploadFile] = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload up to 5 listing image files and return access URLs.
    """
    if len(files) > 5:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Maximum 5 images allowed per listing")

    uploaded_urls = []
    for file in files:
        file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(LISTING_UPLOADS_DIR, unique_filename)

        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)

        uploaded_urls.append(f"http://localhost:8000/uploads/listings/{unique_filename}")

    return APIResponse(
        success=True,
        message="Listing images uploaded successfully",
        data=uploaded_urls
    )
