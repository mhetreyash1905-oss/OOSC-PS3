from pydantic import BaseModel, EmailStr, model_validator
from datetime import datetime
from typing import Optional

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    confirm_password: str

    @model_validator(mode='after')
    def check_passwords_match(self):
        if self.password != self.confirm_password:
            raise ValueError('Passwords do not match')
        if len(self.password) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return self

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    email: str

class UserInDB(BaseModel):
    id: str
    email: str
    created_at: datetime
