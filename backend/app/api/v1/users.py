import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlalchemy.orm import Session
from app.dependencies.auth import get_db, get_current_user
from app.core.security import verify_password, hash_password
from app.schemas.common import APIResponse
from app.schemas.user import UserResponse, UserUpdate, ChangePassword
from app.models.user import User
from app.services.notification_service import create_notification

router = APIRouter(prefix="/users", tags=["Users"])

# Base uploads directory
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads", "avatars")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.get("/profile", response_model=APIResponse[UserResponse])
def get_user_profile(current_user: User = Depends(get_current_user)):
    """
    Retrieve profile details for current authenticated student user.
    """
    user_resp = UserResponse.model_validate(current_user)
    return APIResponse(
        success=True,
        message="Profile details retrieved",
        data=user_resp
    )

@router.put("/profile", response_model=APIResponse[UserResponse])
def update_user_profile(
    profile_in: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update profile details for current authenticated student user.
    """
    update_data = profile_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(current_user, field, value)

    db.commit()
    db.refresh(current_user)

    # Trigger notification
    create_notification(
        db,
        current_user.id,
        "account",
        "Profile Updated",
        "Your student profile card was updated successfully.",
        None,
        None
    )

    user_resp = UserResponse.model_validate(current_user)
    return APIResponse(
        success=True,
        message="Profile updated successfully",
        data=user_resp
    )

@router.post("/avatar", response_model=APIResponse[dict])
async def upload_avatar(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Upload user avatar picture and return static access URL.
    """
    file_ext = os.path.splitext(file.filename)[1] if file.filename else ".jpg"
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    avatar_url = f"http://localhost:8000/uploads/avatars/{unique_filename}"
    current_user.avatar = avatar_url
    db.commit()

    return APIResponse(
        success=True,
        message="Avatar uploaded successfully",
        data={"avatar_url": avatar_url}
    )

@router.post("/change-password", response_model=APIResponse[dict])
def change_password(
    password_in: ChangePassword,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Change account password for current user.
    """
    if not verify_password(password_in.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password entered is incorrect."
        )

    if len(password_in.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long."
        )

    current_user.password_hash = hash_password(password_in.new_password)
    db.commit()

    # Trigger notification
    create_notification(
        db,
        current_user.id,
        "account",
        "Password Modified",
        "Your account password was updated successfully.",
        None,
        None
    )

    return APIResponse(
        success=True,
        message="Password changed successfully.",
        data=None
    )
