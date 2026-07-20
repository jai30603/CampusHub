from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.auth import get_db, get_current_user
from app.models.notification import Notification
from app.models.user import User
from app.schemas.common import APIResponse
from app.schemas.notification import NotificationResponse, NotificationPreferencesUpdate

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("", response_model=APIResponse[List[NotificationResponse]])
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieve all notifications for the authenticated user (newest first).
    """
    notifications = db.query(Notification).filter(
        Notification.user_id == current_user.id
    ).order_by(Notification.created_at.desc()).all()
    
    resp_items = [NotificationResponse.model_validate(n) for n in notifications]
    return APIResponse(success=True, message="Notifications retrieved", data=resp_items)

@router.get("/unread-count", response_model=APIResponse[dict])
def get_unread_notifications_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get total count of unread notifications for authenticated user.
    """
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    return APIResponse(success=True, message="Unread notifications count retrieved", data={"count": count})

@router.put("/read-all", response_model=APIResponse[dict])
def mark_all_notifications_as_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark all unread notifications for the user as read.
    """
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True}, synchronize_session=False)
    db.commit()
    return APIResponse(success=True, message="All notifications marked as read", data=None)

@router.put("/{id}/read", response_model=APIResponse[NotificationResponse])
def mark_notification_as_read(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a specific notification as read.
    """
    notif = db.query(Notification).filter(
        Notification.id == id,
        Notification.user_id == current_user.id
    ).first()
    
    if not notif:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        
    notif.is_read = True
    db.commit()
    db.refresh(notif)
    
    return APIResponse(
        success=True,
        message="Notification marked as read",
        data=NotificationResponse.model_validate(notif)
    )

@router.put("/preferences", response_model=APIResponse[dict])
def update_notification_preferences(
    prefs: NotificationPreferencesUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update notification preference flags for current user.
    """
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    user.messages_enabled = prefs.messages_enabled
    user.reservations_enabled = prefs.reservations_enabled
    user.reviews_enabled = prefs.reviews_enabled
    user.account_enabled = prefs.account_enabled
    
    db.commit()
    
    return APIResponse(
        success=True,
        message="Notification preferences updated successfully",
        data={
            "messages_enabled": user.messages_enabled,
            "reservations_enabled": user.reservations_enabled,
            "reviews_enabled": user.reviews_enabled,
            "account_enabled": user.account_enabled
        }
    )
