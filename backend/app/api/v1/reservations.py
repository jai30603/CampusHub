from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from app.dependencies.auth import get_db, get_current_user
from app.models.reservation import Reservation
from app.models.listing import Listing
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.reservation import ReservationResponse, ReservationCreate
from app.services.notification_service import create_notification

router = APIRouter(tags=["Reservations & Deal Management"])

@router.post("/reservations", response_model=APIResponse[ReservationResponse], status_code=status.HTTP_201_CREATED)
def create_reservation(
    res_in: ReservationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new reservation request for an active campus listing.
    """
    listing = db.query(Listing).filter(Listing.id == res_in.listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if listing.seller_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot reserve your own listing.")

    if listing.status != "active":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="This listing is currently unavailable for reservation.")

    # Check if this buyer already has a pending/accepted request for this listing
    existing = db.query(Reservation).filter(
        Reservation.listing_id == listing.id,
        Reservation.buyer_id == current_user.id,
        Reservation.status.in_(["pending", "accepted"])
    ).first()

    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You already have an active reservation request for this listing.")

    # Create reservation
    new_res = Reservation(
        listing_id=listing.id,
        buyer_id=current_user.id,
        seller_id=listing.seller_id,
        status="pending"
    )
    db.add(new_res)
    
    # Update listing status to pending approval
    listing.status = "pending"
    
    db.commit()
    db.refresh(new_res)

    # Trigger notification
    create_notification(
        db,
        listing.seller_id,
        "reservations",
        "New Reservation Request",
        f"{current_user.full_name} has requested to reserve '{listing.title}' on campus.",
        "listing",
        listing.id
    )

    full_res = db.query(Reservation).options(
        joinedload(Reservation.listing).joinedload(Listing.seller),
        joinedload(Reservation.listing).joinedload(Listing.images),
        joinedload(Reservation.buyer),
        joinedload(Reservation.seller)
    ).filter(Reservation.id == new_res.id).first()

    return APIResponse(
        success=True,
        message="Reservation request submitted successfully. Waiting for seller approval.",
        data=ReservationResponse.model_validate(full_res)
    )

@router.get("/reservations", response_model=APIResponse[List[ReservationResponse]])
def list_reservations(
    role: Optional[str] = Query(None, description="Filter by role: buyer or seller"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    List user reservations (either as a buyer or as a seller).
    """
    query = db.query(Reservation).options(
        joinedload(Reservation.listing).joinedload(Listing.seller),
        joinedload(Reservation.listing).joinedload(Listing.images),
        joinedload(Reservation.buyer),
        joinedload(Reservation.seller)
    )

    if role == "buyer":
        query = query.filter(Reservation.buyer_id == current_user.id)
    elif role == "seller":
        query = query.filter(Reservation.seller_id == current_user.id)
    else:
        query = query.filter(
            (Reservation.buyer_id == current_user.id) | (Reservation.seller_id == current_user.id)
        )

    reservations = query.order_by(Reservation.requested_at.desc()).all()
    resp_items = [ReservationResponse.model_validate(r) for r in reservations]

    return APIResponse(
        success=True,
        message="Reservations retrieved successfully",
        data=resp_items
    )

@router.get("/reservations/{id}", response_model=APIResponse[ReservationResponse])
def get_reservation_detail(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get detailed reservation information.
    """
    res = db.query(Reservation).options(
        joinedload(Reservation.listing).joinedload(Listing.seller),
        joinedload(Reservation.listing).joinedload(Listing.images),
        joinedload(Reservation.buyer),
        joinedload(Reservation.seller)
    ).filter(Reservation.id == id).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    if res.buyer_id != current_user.id and res.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    return APIResponse(success=True, message="Reservation detail loaded", data=ReservationResponse.model_validate(res))

@router.put("/reservations/{id}/accept", response_model=APIResponse[ReservationResponse])
def accept_reservation(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Seller action: Accept buyer reservation request (moving item state to RESERVED).
    """
    res = db.query(Reservation).filter(Reservation.id == id).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    if res.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the seller can accept reservation requests.")

    if res.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reservation request is not pending.")

    # Update reservation status & accepted timestamp
    res.status = "accepted"
    res.accepted_at = datetime.now()

    # Update Listing status to reserved
    listing = db.query(Listing).filter(Listing.id == res.listing_id).first()
    if listing:
        listing.status = "reserved"

    # Reject other pending reservations for the same listing
    db.query(Reservation).filter(
        Reservation.listing_id == res.listing_id,
        Reservation.id != id,
        Reservation.status == "pending"
    ).update({"status": "rejected", "cancelled_at": datetime.now()}, synchronize_session=False)

    db.commit()

    # Trigger notification to buyer
    if listing:
        create_notification(
            db,
            res.buyer_id,
            "reservations",
            "Reservation Request Accepted!",
            f"Seller accepted your reservation request for '{listing.title}'. Co-ordinate meetup details in Chat.",
            "listing",
            listing.id
        )

    full_res = db.query(Reservation).options(
        joinedload(Reservation.listing).joinedload(Listing.seller),
        joinedload(Reservation.listing).joinedload(Listing.images),
        joinedload(Reservation.buyer),
        joinedload(Reservation.seller)
    ).filter(Reservation.id == id).first()

    return APIResponse(
        success=True,
        message="Reservation accepted successfully! Co-ordinate offline pickup in Chat.",
        data=ReservationResponse.model_validate(full_res)
    )

@router.put("/reservations/{id}/reject", response_model=APIResponse[ReservationResponse])
def reject_reservation(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Seller action: Reject buyer reservation request.
    """
    res = db.query(Reservation).filter(Reservation.id == id).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    if res.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the seller can reject reservation requests.")

    if res.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Reservation is not pending.")

    res.status = "rejected"
    res.cancelled_at = datetime.now()

    # Reopen listing status to active if no other pending requests
    listing = db.query(Listing).filter(Listing.id == res.listing_id).first()
    if listing:
        other_pendings = db.query(Reservation).filter(
            Reservation.listing_id == res.listing_id,
            Reservation.id != id,
            Reservation.status == "pending"
        ).count()
        if other_pendings == 0:
            listing.status = "active"

    db.commit()

    # Trigger notification
    if listing:
        create_notification(
            db,
            res.buyer_id,
            "reservations",
            "Reservation Request Declined",
            f"Seller declined your reservation request for '{listing.title}'. Discover other items on the marketplace.",
            "listing",
            listing.id
        )

    full_res = db.query(Reservation).options(
        joinedload(Reservation.listing).joinedload(Listing.seller),
        joinedload(Reservation.listing).joinedload(Listing.images),
        joinedload(Reservation.buyer),
        joinedload(Reservation.seller)
    ).filter(Reservation.id == id).first()

    return APIResponse(
        success=True,
        message="Reservation request rejected.",
        data=ReservationResponse.model_validate(full_res)
    )

@router.put("/reservations/{id}/cancel", response_model=APIResponse[ReservationResponse])
def cancel_reservation(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Buyer/Seller action: Cancel a pending/accepted reservation deal and reopen item.
    """
    res = db.query(Reservation).filter(Reservation.id == id).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    if res.buyer_id != current_user.id and res.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to cancel this deal.")

    res.status = "cancelled"
    res.cancelled_at = datetime.now()

    # Reopen listing status to active
    listing = db.query(Listing).filter(Listing.id == res.listing_id).first()
    if listing:
        listing.status = "active"

    db.commit()

    # Trigger notification to other party
    other_party = res.seller_id if current_user.id == res.buyer_id else res.buyer_id
    if listing:
        create_notification(
            db,
            other_party,
            "reservations",
            "Reservation Deal Cancelled",
            f"The deal for '{listing.title}' has been cancelled.",
            "listing",
            listing.id
        )

    full_res = db.query(Reservation).options(
        joinedload(Reservation.listing).joinedload(Listing.seller),
        joinedload(Reservation.listing).joinedload(Listing.images),
        joinedload(Reservation.buyer),
        joinedload(Reservation.seller)
    ).filter(Reservation.id == id).first()

    return APIResponse(
        success=True,
        message="Reservation deal has been cancelled. Listing is reopened as active.",
        data=ReservationResponse.model_validate(full_res)
    )

@router.put("/reservations/{id}/complete", response_model=APIResponse[ReservationResponse])
def complete_deal(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Seller action: Mark deal completed (Sold listing).
    """
    res = db.query(Reservation).filter(Reservation.id == id).first()
    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reservation not found")

    if res.seller_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the seller can mark the deal complete.")

    res.status = "completed"
    res.completed_at = datetime.now()

    # Update Listing status to sold
    listing = db.query(Listing).filter(Listing.id == res.listing_id).first()
    if listing:
        listing.status = "sold"

    db.commit()

    # Trigger notification to buyer
    if listing:
        create_notification(
            db,
            res.buyer_id,
            "reservations",
            "Purchase Completed!",
            f"Deal finalized! Your reservation for '{listing.title}' has been successfully completed.",
            "listing",
            listing.id
        )

    full_res = db.query(Reservation).options(
        joinedload(Reservation.listing).joinedload(Listing.seller),
        joinedload(Reservation.listing).joinedload(Listing.images),
        joinedload(Reservation.buyer),
        joinedload(Reservation.seller)
    ).filter(Reservation.id == id).first()

    return APIResponse(
        success=True,
        message="Deal completed successfully! Listing is now marked as SOLD.",
        data=ReservationResponse.model_validate(full_res)
    )

@router.put("/listings/{listing_id}/reopen", response_model=APIResponse[dict])
def reopen_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Seller action: Reopen a sold or archived listing back to active.
    """
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    if listing.seller_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    listing.status = "active"
    db.commit()

    # Trigger notification
    create_notification(
        db,
        listing.seller_id,
        "account",
        "Listing Reopened",
        f"Your listing '{listing.title}' has been reopened as active.",
        "listing",
        listing.id
    )

    return APIResponse(success=True, message="Listing reopened as active", data=None)
