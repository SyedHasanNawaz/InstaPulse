from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from ..utils.deps import get_db, get_current_user
from ..schemas import UserCreate, UserOut, Token
from ..services import user_service, auth_service
from ..models import User

router = APIRouter()

@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def signup(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register a new user.
    """
    return await user_service.create_user(db=db, user_in=user_in)

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    return await auth_service.authenticate_user(db=db, form_data=form_data)

@router.get("/me", response_model=UserOut)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """
    Get current user profile.
    """
    return current_user

@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout the current user.
    Note: For stateless JWTs, the actual logout happens on the client side 
    by deleting the token (e.g., from localStorage). This endpoint serves 
    as a clear signal to the client.
    """
    return {"message": "Successfully logged out. Please delete the token on the client side."}
