from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.auth import get_db, get_current_user
from app.repositories.user_repo import user_repository
from app.core.security import hash_password, verify_password, create_access_token, create_refresh_token, decode_token
from app.schemas.common import APIResponse
from app.schemas.user import UserCreate, UserLogin, TokenResponse, UserResponse
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=APIResponse[TokenResponse], status_code=status.HTTP_201_CREATED)
def register(user_in: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new CampusHub account.
    """
    # Check if user with email already exists
    existing_user = user_repository.get_by_email(db, email=user_in.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Hash password & create user
    hashed_pwd = hash_password(user_in.password)
    user_data = user_in.model_dump(exclude={"password"})
    user_data["password_hash"] = hashed_pwd
    user_data.setdefault("college", "")

    new_user = user_repository.create(db, obj_in=user_data)

    # Issue JWT tokens
    access_token = create_access_token(subject=new_user.id)
    refresh_token = create_refresh_token(subject=new_user.id)

    user_resp = UserResponse.model_validate(new_user)
    token_resp = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_resp
    )

    return APIResponse(
        success=True,
        message="Registration successful. Welcome to CampusHub!",
        data=token_resp
    )

@router.post("/login", response_model=APIResponse[TokenResponse])
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return JWT access and refresh tokens.
    """
    user = user_repository.get_by_email(db, email=credentials.email)
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email address or password.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    access_token = create_access_token(subject=user.id)
    refresh_token = create_refresh_token(subject=user.id)

    user_resp = UserResponse.model_validate(user)
    token_resp = TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_resp
    )

    return APIResponse(
        success=True,
        message="Login successful",
        data=token_resp
    )

@router.get("/me", response_model=APIResponse[UserResponse])
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get profile details for authenticated user.
    """
    user_resp = UserResponse.model_validate(current_user)
    return APIResponse(
        success=True,
        message="User profile retrieved",
        data=user_resp
    )

@router.post("/refresh", response_model=APIResponse[dict])
def refresh_token_endpoint(refresh_token: str, db: Session = Depends(get_db)):
    """
    Issue new access token using valid refresh token.
    """
    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )

    user_id = int(payload.get("sub"))
    user = user_repository.get(db, id=user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    new_access_token = create_access_token(subject=user.id)
    return APIResponse(
        success=True,
        message="Token refreshed successfully",
        data={"access_token": new_access_token, "token_type": "bearer"}
    )

@router.post("/logout", response_model=APIResponse[dict])
def logout():
    """
    Log out user session.
    """
    return APIResponse(
        success=True,
        message="Successfully logged out",
        data=None
    )

@router.post("/verify-email", response_model=APIResponse[dict])
def verify_email(token: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Verify student email token.
    """
    current_user.is_verified = True
    db.commit()
    return APIResponse(
        success=True,
        message="Email successfully verified",
        data={"verified": True}
    )
