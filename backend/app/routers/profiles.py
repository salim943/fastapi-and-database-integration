from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models, schemas
from app.routers.auth import get_current_user

router = APIRouter()

# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



# =========================
# GET PROFILES
# =========================
@router.get("/")
def get_profiles(
    limit: int = 5,
    page: int = 1,
    search: str = "",
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    q = db.query(models.Profile)

    # 👤 normal user sees only own profile
    if user["role"] != "admin":
        q = q.filter(models.Profile.user_id == user["id"])

    if search.strip():
        q = q.filter(
            models.Profile.name.ilike(f"%{search}%")
        )

    total = q.count()
    data = q.offset((page - 1) * limit).limit(limit).all()

    return {
        "profiles": data,
        "total": total
    }


# =========================
# CREATE PROFILE
# =========================
@router.post("/")
def create_profile(
    profile: schemas.ProfileCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    # 👤 normal user can create only ONE profile
    if user["role"] != "admin":
        existing = db.query(models.Profile).filter(
            models.Profile.user_id == user["id"]
        ).first()

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Profile already exists"
            )

    new_profile = models.Profile(
        **profile.dict(),
        user_id=user["id"]
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


# =========================
# UPDATE PROFILE
# =========================
@router.put("/{id}")
def update_profile(
    id: int,
    profile: schemas.ProfileUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    obj = db.query(models.Profile).filter(
        models.Profile.id == id
    ).first()

    if not obj:
        raise HTTPException(status_code=404, detail="Profile not found")

    # 🔐 permission check
    if user["role"] != "admin" and obj.user_id != user["id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    for key, value in profile.dict(exclude_unset=True).items():
        setattr(obj, key, value)

    db.commit()
    db.refresh(obj)

    return obj


# =========================
# DELETE PROFILE
# =========================
@router.delete("/{id}")
def delete_profile(
    id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    obj = db.query(models.Profile).filter(
        models.Profile.id == id
    ).first()

    if not obj:
        raise HTTPException(status_code=404, detail="Profile not found")

    # 🔐 permission check
    if user["role"] != "admin" and obj.user_id != user["id"]:
        raise HTTPException(status_code=403, detail="Not allowed")

    db.delete(obj)
    db.commit()

    return {"message": "deleted"}