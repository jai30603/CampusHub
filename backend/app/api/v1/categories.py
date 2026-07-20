from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.dependencies.auth import get_db
from app.models.category import Category
from app.schemas.common import APIResponse
from app.schemas.category import CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=APIResponse[List[CategoryResponse]])
def list_categories(db: Session = Depends(get_db)):
    """
    List all active campus marketplace categories.
    """
    categories = db.query(Category).filter(Category.is_active == True).all()
    cat_responses = [CategoryResponse.model_validate(c) for c in categories]
    return APIResponse(
        success=True,
        message="Categories retrieved successfully",
        data=cat_responses
    )

@router.get("/{category_id}", response_model=APIResponse[CategoryResponse])
def get_category(category_id: int, db: Session = Depends(get_db)):
    """
    Retrieve category details by ID.
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return APIResponse(
        success=True,
        message="Category retrieved",
        data=CategoryResponse.model_validate(category)
    )
