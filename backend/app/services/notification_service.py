from typing import Optional
from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.models.user import User

def create_notification(
    db: Session,
    user_id: int,
    notification_type: str, # messages, reservations, reviews, account
    title: str,
    message: str,
    reference_type: Optional[str] = None,
    reference_id: Optional[int] = None
) -> Optional[Notification]:
    """
    Creates a user notification automatically if the user has that category enabled.
    """
    # Query user preference flags
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    # Check preference toggles
    enabled = True
    if notification_type == "messages" and not user.messages_enabled:
        enabled = False
    elif notification_type == "reservations" and not user.reservations_enabled:
        enabled = False
    elif notification_type == "reviews" and not user.reviews_enabled:
        enabled = False
    elif notification_type == "account" and not user.account_enabled:
        enabled = False

    if not enabled:
        return None

    new_notif = Notification(
        user_id=user_id,
        type=notification_type,
        title=title,
        message=message,
        reference_type=reference_type,
        reference_id=reference_id,
        is_read=False
    )
    db.add(new_notif)
    db.commit()
    db.refresh(new_notif)
    return new_notif
