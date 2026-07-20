import io
import csv
from datetime import datetime, timedelta
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from app.dependencies.auth import get_db, get_current_user
from app.models.user import User
from app.models.listing import Listing
from app.models.category import Category
from app.models.reservation import Reservation
from app.models.review import Review
from app.models.report import Report
from app.api.v1.admin import check_admin
from app.schemas.common import APIResponse

router = APIRouter(prefix="/admin", tags=["Admin Analytics & Insights"])

@router.get("/analytics", response_model=APIResponse[dict])
def get_analytics_summary(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Get aggregated counts for KPI dashboard.
    """
    total_users = db.query(User).count()
    active_listings = db.query(Listing).filter(Listing.status == "active").count()
    completed_deals = db.query(Reservation).filter(Reservation.status == "completed").count()
    total_reservations = db.query(Reservation).count()
    total_reviews = db.query(Review).count()
    total_reports = db.query(Report).count()
    total_categories = db.query(Category).count()

    # User growth last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    new_users_month = db.query(User).filter(User.created_at >= thirty_days_ago).count()

    return APIResponse(
        success=True,
        message="Analytics summary loaded",
        data={
            "total_users": total_users,
            "new_users_this_month": new_users_month,
            "active_listings": active_listings,
            "completed_deals": completed_deals,
            "total_reservations": total_reservations,
            "total_reviews": total_reviews,
            "total_reports": total_reports,
            "total_categories": total_categories
        }
    )

@router.get("/analytics/users", response_model=APIResponse[dict])
def get_user_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Get detailed user growth and distribution statistics.
    """
    # College distribution
    colleges = db.query(User.college, func.count(User.id)).group_by(User.college).all()
    college_dist = {col[0]: col[1] for col in colleges if col[0]}

    # Department distribution
    departments = db.query(User.department, func.count(User.id)).group_by(User.department).all()
    dept_dist = {dept[0]: dept[1] for dept in departments if dept[0]}

    # Registration timeline (Last 7 days)
    timeline = []
    for i in range(7):
        date = datetime.utcnow().date() - timedelta(days=i)
        count = db.query(User).filter(func.date(User.created_at) == date).count()
        timeline.append({"date": str(date), "registrations": count})
    timeline.reverse()

    return APIResponse(
        success=True,
        message="User analytics loaded",
        data={
            "college_distribution": college_dist,
            "department_distribution": dept_dist,
            "registration_timeline": timeline
        }
    )

@router.get("/analytics/listings", response_model=APIResponse[dict])
def get_listing_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Get marketplace listing insights by category and state.
    """
    # Listings by category
    categories = db.query(Category.name, func.count(Listing.id))\
        .join(Listing, Listing.category_id == Category.id)\
        .group_by(Category.name).all()
    category_dist = {cat[0]: cat[1] for cat in categories}

    # Status breakdown
    statuses = db.query(Listing.status, func.count(Listing.id)).group_by(Listing.status).all()
    status_dist = {stat[0]: stat[1] for stat in statuses}

    return APIResponse(
        success=True,
        message="Listing analytics loaded",
        data={
            "category_distribution": category_dist,
            "status_distribution": status_dist
        }
    )

@router.get("/analytics/reservations", response_model=APIResponse[dict])
def get_reservation_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Get reservation conversion rate and status breakdowns.
    """
    total = db.query(Reservation).count()
    completed = db.query(Reservation).filter(Reservation.status == "completed").count()
    cancelled = db.query(Reservation).filter(Reservation.status == "cancelled").count()
    pending = db.query(Reservation).filter(Reservation.status == "pending").count()
    accepted = db.query(Reservation).filter(Reservation.status == "accepted").count()
    rejected = db.query(Reservation).filter(Reservation.status == "rejected").count()

    conversion_rate = (completed / total * 100) if total > 0 else 0.0

    return APIResponse(
        success=True,
        message="Reservation analytics loaded",
        data={
            "total_reservations": total,
            "conversion_rate": round(conversion_rate, 2),
            "status_counts": {
                "completed": completed,
                "cancelled": cancelled,
                "pending": pending,
                "accepted": accepted,
                "rejected": rejected
            }
        }
    )

@router.get("/analytics/reviews", response_model=APIResponse[dict])
def get_review_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Get rating scores breakdown and aggregate averages.
    """
    total_reviews = db.query(Review).count()
    avg_rating = db.query(func.avg(Review.rating)).scalar() or 0.0

    # Rating distribution
    distribution = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0}
    counts = db.query(Review.rating, func.count(Review.id)).group_by(Review.rating).all()
    for rating, count in counts:
        distribution[rating] = count

    return APIResponse(
        success=True,
        message="Review analytics loaded",
        data={
            "total_reviews": total_reviews,
            "average_rating": round(float(avg_rating), 2),
            "rating_distribution": distribution
        }
    )

@router.get("/analytics/reports", response_model=APIResponse[dict])
def get_report_analytics(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    """
    Get moderation report stats.
    """
    pending = db.query(Report).filter(Report.status == "pending").count()
    resolved = db.query(Report).filter(Report.status == "resolved").count()
    dismissed = db.query(Report).filter(Report.status == "dismissed").count()

    return APIResponse(
        success=True,
        message="Report analytics loaded",
        data={
            "pending": pending,
            "resolved": resolved,
            "dismissed": dismissed
        }
    )

# Export endpoints generating CSV streams
@router.get("/export/users")
def export_users_csv(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Email", "College", "Department", "Academic Year", "Role", "Joined Date"])
    
    users = db.query(User).all()
    for u in users:
        writer.writerow([u.id, u.full_name, u.email, u.college, u.department, u.academic_year, u.role, u.created_at])
        
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=users_report.csv"}
    )

@router.get("/export/listings")
def export_listings_csv(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Title", "Seller Email", "Category", "Price", "Status", "Created Date"])
    
    listings = db.query(Listing).options(joinedload(Listing.seller), joinedload(Listing.category)).all()
    for l in listings:
        writer.writerow([
            l.id,
            l.title,
            l.seller.email if l.seller else "N/A",
            l.category.name if l.category else "N/A",
            l.price,
            l.status,
            l.created_at
        ])
        
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=listings_report.csv"}
    )

@router.get("/export/reservations")
def export_reservations_csv(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Listing Title", "Buyer", "Seller", "Status", "Requested Date"])
    
    reservations = db.query(Reservation).options(
        joinedload(Reservation.listing),
        joinedload(Reservation.buyer),
        joinedload(Reservation.seller)
    ).all()
    for r in reservations:
        writer.writerow([
            r.id,
            r.listing.title if r.listing else "N/A",
            r.buyer.email if r.buyer else "N/A",
            r.seller.email if r.seller else "N/A",
            r.status,
            r.requested_at
        ])
        
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=reservations_report.csv"}
    )

@router.get("/export/reviews")
def export_reviews_csv(
    db: Session = Depends(get_db),
    admin: User = Depends(check_admin)
):
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Reviewer", "Reviewee", "Rating", "Comment", "Created Date"])
    
    reviews = db.query(Review).options(
        joinedload(Review.reviewer),
        joinedload(Review.reviewee)
    ).all()
    for rev in reviews:
        writer.writerow([
            rev.id,
            rev.reviewer.email if rev.reviewer else "N/A",
            rev.reviewee.email if rev.reviewee else "N/A",
            rev.rating,
            rev.comment or "",
            rev.created_at
        ])
        
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode("utf-8")),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=reviews_report.csv"}
    )
