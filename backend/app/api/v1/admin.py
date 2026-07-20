from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.dependencies.auth import get_db, get_current_user
from app.models.user import User
from app.models.listing import Listing
from app.models.category import Category
from app.models.reservation import Reservation
from app.models.review import Review
from app.models.report import Report
from app.models.admin_activity import AdminActivity
from app.schemas.common import APIResponse
from app.schemas.admin import ReportResponse, AdminActivityResponse
from app.schemas.user import UserResponse
from app.schemas.listing import ListingResponse
from app.schemas.category import CategoryResponse, CategoryCreate

router = APIRouter(prefix="/admin", tags=["Admin Management"])

def check_admin(current_user: User = Depends(get_current_user)):
    """
    Dependency that enforces only users with the role 'admin' can access endpoints.
    """
    if current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. Administrator privileges required."
        )
    return current_user

def log_admin_action(db: Session, admin_id: int, action: str, entity_type: str, entity_id: int):
    activity = AdminActivity(
        admin_id=admin_id,
        action=action,
        entity_type=entity_type,
        entity_id=entity_id
    )
    db.add(activity)
    db.commit()

@router.get("/dashboard", response_model=APIResponse[dict])
def get_admin_dashboard(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Retrieve admin dashboard KPIs, Recent Activity, and Platform Health metrics.
    """
    total_users = db.query(User).count()
    active_listings = db.query(Listing).filter(Listing.status == "active").count()
    completed_deals = db.query(Reservation).filter(Reservation.status == "completed").count()
    total_reservations = db.query(Reservation).count()
    total_reviews = db.query(Review).count()
    total_reports = db.query(Report).count()
    total_categories = db.query(Category).count()

    # Recent Activity Lists
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(5).all()
    recent_listings = db.query(Listing).order_by(Listing.created_at.desc()).limit(5).all()
    recent_reports = db.query(Report).options(joinedload(Report.reporter)).order_by(Report.created_at.desc()).limit(5).all()

    # Platform Health Checklist Metrics
    # (Read-only metrics summarizing status)
    health = {
        "database_status": "Connected",
        "backend_api": "Online",
        "version": "v1.0.0",
        "active_users_today": total_users,  # Simple placeholder
        "open_reports": db.query(Report).filter(Report.status == "pending").count(),
        "storage_usage": "1.8 GB"
    }

    # Transform recent users and listings
    users_data = [UserResponse.model_validate(u) for u in recent_users]
    listings_data = [ListingResponse.model_validate(l) for l in recent_listings]
    reports_data = [ReportResponse.model_validate(r) for r in recent_reports]

    return APIResponse(
        success=True,
        message="Admin dashboard stats loaded",
        data={
            "kpis": {
                "total_users": total_users,
                "active_listings": active_listings,
                "completed_deals": completed_deals,
                "total_reservations": total_reservations,
                "total_reviews": total_reviews,
                "total_reports": total_reports,
                "total_categories": total_categories
            },
            "recent_activity": {
                "users": users_data,
                "listings": listings_data,
                "reports": reports_data
            },
            "health": health
        }
    )

@router.get("/users", response_model=APIResponse[List[UserResponse]])
def list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: Display all registered users.
    """
    users = db.query(User).order_by(User.created_at.desc()).all()
    resp_users = [UserResponse.model_validate(u) for u in users]
    return APIResponse(success=True, message="Registered users retrieved", data=resp_users)

@router.put("/users/{id}", response_model=APIResponse[UserResponse])
def update_user_status(
    id: int,
    status_update: dict, # {"is_active": bool, "role": str}
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: Suspend, reactivate, or change roles for a user.
    """
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    role = status_update.get("role")
    if role:
        user.role = role

    is_verified = status_update.get("is_verified")
    if is_verified is not None:
        user.is_verified = is_verified

    db.commit()
    db.refresh(user)

    action_text = f"Admin updated user role or verification status for {user.full_name}"
    log_admin_action(db, admin.id, action_text, "user", user.id)

    return APIResponse(success=True, message="User updated successfully", data=UserResponse.model_validate(user))

@router.get("/listings", response_model=APIResponse[List[ListingResponse]])
def list_listings(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: Display all marketplace listings.
    """
    listings = db.query(Listing).options(
        joinedload(Listing.seller),
        joinedload(Listing.category),
        joinedload(Listing.images)
    ).order_by(Listing.created_at.desc()).all()
    
    resp_items = [ListingResponse.model_validate(l) for l in listings]
    return APIResponse(success=True, message="Marketplace listings loaded", data=resp_items)

@router.put("/listings/{id}", response_model=APIResponse[ListingResponse])
def update_listing_status(
    id: int,
    status_update: dict, # {"status": str}
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: Archive, restore, or delete a listing.
    """
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Listing not found")

    new_status = status_update.get("status")
    if new_status:
        listing.status = new_status
        db.commit()

    action_text = f"Admin set listing status to '{new_status}' for listing '{listing.title}'"
    log_admin_action(db, admin.id, action_text, "listing", listing.id)

    # Return refreshed object
    refreshed = db.query(Listing).options(
        joinedload(Listing.seller),
        joinedload(Listing.category),
        joinedload(Listing.images)
    ).filter(Listing.id == id).first()

    return APIResponse(success=True, message="Listing updated", data=ListingResponse.model_validate(refreshed))

@router.post("/categories", response_model=APIResponse[CategoryResponse])
def create_category(
    cat_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: Create a new marketplace category.
    """
    slug = cat_in.name.lower().replace(" & ", "-").replace(" ", "-")
    new_cat = Category(
        name=cat_in.name,
        slug=slug,
        icon=cat_in.icon or "tag"
    )
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)

    log_admin_action(db, admin.id, f"Admin created category '{new_cat.name}'", "category", new_cat.id)

    return APIResponse(success=True, message="Category created", data=CategoryResponse.model_validate(new_cat))

@router.put("/categories/{id}", response_model=APIResponse[CategoryResponse])
def update_category(
    id: int,
    cat_in: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: Edit/archive an existing category.
    """
    cat = db.query(Category).filter(Category.id == id).first()
    if not cat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    # Prevent arching category if listings exist
    listings_count = db.query(Listing).filter(Listing.category_id == id, Listing.status == "active").count()
    if listings_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot modify or archive a category that contains active listings."
        )

    cat.name = cat_in.name
    cat.icon = cat_in.icon or cat.icon
    db.commit()
    db.refresh(cat)

    log_admin_action(db, admin.id, f"Admin modified category '{cat.name}'", "category", cat.id)

    return APIResponse(success=True, message="Category updated", data=CategoryResponse.model_validate(cat))

@router.get("/reports", response_model=APIResponse[List[ReportResponse]])
def get_platform_reports(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: List all listing and user reports submitted by students.
    """
    reports = db.query(Report).options(
        joinedload(Report.reporter),
        joinedload(Report.reported_user),
        joinedload(Report.listing)
    ).order_by(Report.created_at.desc()).all()

    resp_reports = [ReportResponse.model_validate(r) for r in reports]
    return APIResponse(success=True, message="Platform reports loaded", data=resp_reports)

@router.put("/reports/{id}", response_model=APIResponse[ReportResponse])
def resolve_report(
    id: int,
    update_data: dict, # {"status": "resolved" or "dismissed"}
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: Resolve or dismiss a report.
    """
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report not found")

    new_status = update_data.get("status")
    if new_status:
        report.status = new_status
        report.resolved_at = datetime.now()
        db.commit()

    log_admin_action(db, admin.id, f"Admin marked report #{report.id} as '{new_status}'", "report", report.id)

    refreshed = db.query(Report).options(
        joinedload(Report.reporter),
        joinedload(Report.reported_user),
        joinedload(Report.listing)
    ).filter(Report.id == id).first()

    return APIResponse(success=True, message="Report resolved", data=ReportResponse.model_validate(refreshed))

@router.get("/activity", response_model=APIResponse[List[AdminActivityResponse]])
def get_admin_activities(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Admin: List audit logs of admin activities.
    """
    activities = db.query(AdminActivity).order_by(AdminActivity.created_at.desc()).all()
    resp_activities = [AdminActivityResponse.model_validate(a) for a in activities]
    return APIResponse(success=True, message="Admin audit logs loaded", data=resp_activities)
