from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from . import user_service
from ..utils.security import verify_password, create_access_token
from ..schemas import Token

async def authenticate_user(db: AsyncSession, form_data: OAuth2PasswordRequestForm) -> Token:
    # We use username field from form_data to check the username
    user = await user_service.get_user_by_username(db, username=form_data.username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user",
        )

    access_token = create_access_token(subject=user.id)
    return Token(access_token=access_token, token_type="bearer")
