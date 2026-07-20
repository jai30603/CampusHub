from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.dependencies.auth import get_db, get_current_user
from app.models.review import Review
from app.models.reservation import Reservation
from app.models.listing import Listing
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.review import ReviewResponse, ReviewCreate
from app.services.notification_service import create_notification

router = APIRouter(tags=["Reviews & Ratings"])

@router.post("/reviews", response_model=APIResponse[ReviewResponse], status_code=status.HTTP_201_CREATED)
def leave_review(
    rev_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submit a star rating and comment review for a completed campus transaction.
    """
    res = db.query(Reservation).filter(Reservation.id == rev_in.reservation_id).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    if res.status.lower() != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reviews can only be submitted after the transaction is fully completed."
        )

    # Check if current user was a participant in this deal
    if res.buyer_id != current_user.id and res.seller_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only review reservations that you participated in."
        )

    # Ensure no duplicate review from this user for this reservation
    existing = db.query(Review).filter(
        Review.reservation_id == res.id,
        Review.reviewer_id == current_user.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already submitted a review for this transaction."
        )

    # Identify reviewee
    reviewee_id = res.seller_id if res.buyer_id == current_user.id else res.buyer_id

    # Create Review
    new_rev = Review(
        reservation_id=res.id,
        listing_id=res.listing_id,
        reviewer_id=current_user.id,
        reviewee_id=reviewee_id,
        rating=rev_in.rating,
        comment=rev_in.comment.strip() if rev_in.comment else None
    )

    db.add(new_rev)
    db.commit()
    db.refresh(new_rev)

    # Trigger notification
    create_notification(
        db,
        reviewee_id,
        "reviews",
        "New Review Received",
        f"{current_user.full_name} left you a {rev_in.rating}-star review for '{res.listing.title}'.",
        "listing",
        res.listing_id
    )

    full_rev = db.query(Review).options(
        joinedload(Review.listing),
        joinedload(Review.reviewer),
        joinedload(Review.reviewee)
    ).filter(Review.id == new_rev.id).first()

    return APIResponse(
        success=True,
        message="Review submitted successfully!",
        data=ReviewResponse.model_validate(full_rev)
    )

@router.get("/reviews/user/{user_id}", response_model=APIResponse[dict])
def get_user_public_reviews(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get public reviews history, average score, and star counts summary for a user.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    reviews = db.query(Review).options(
        joinedload(Review.reviewer),
        joinedload(Review.listing)
    ).filter(Review.reviewee_id == user_id).order_by(Review.created_at.desc()).all()

    # Calculate metrics
    total_reviews = len(reviews)
    avg_rating = 0.0
    star_distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}

    if total_reviews > 0:
        avg_rating = round(sum(r.rating for r in reviews) / total_reviews, 1)
        for r in reviews:
            if r.rating in star_distribution:
                star_distribution[r.rating] += 1

    completed_deals = db.query(Reservation).filter(
        (Reservation.buyer_id == user_id) | (Reservation.seller_id == user_id),
        Reservation.status == "completed"
    ).count()

    resp_reviews = [ReviewResponse.model_validate(r) for r in reviews]

    return APIResponse(
        success=True,
        message="User reputation loaded",
        data={
            "reviews": resp_reviews,
            "total_reviews": total_reviews,
            "average_rating": avg_rating,
            "star_distribution": star_distribution,
            "completed_deals": completed_deals
        }
    )

@router.get("/reviews/received", response_model=APIResponse[List[ReviewResponse]])
def get_my_received_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all reviews received by the currently logged-in user.
    """
    reviews = db.query(Review).options(
        joinedload(Review.reviewer),
        joinedload(Review.listing)
    ).filter(Review.reviewee_id == current_user.id).order_by(Review.created_at.desc()).all()

    resp_reviews = [ReviewResponse.model_validate(r) for r in reviews]
    return APIResponse(success=True, message="Received reviews loaded", data=resp_reviews)

@router.get("/reviews/given", response_model=APIResponse[List[ReviewResponse]])
def get_my_given_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all reviews written/given by the currently logged-in user.
    """
    reviews = db.query(Review).options(
        joinedload(Review.reviewee),
        joinedload(Review.listing)
    ).filter(Review.reviewer_id == current_user.id).order_by(Review.created_at.desc()).all()

    resp_reviews = [ReviewResponse.model_validate(r) for r in reviews]
    return APIResponse(success=True, message="Given reviews loaded", data=resp_reviews)
