from pydantic import BaseModel,EmailStr
class ProfileCreate(BaseModel):
    name:str
    email:EmailStr
    description:str
class ProfileUpdate(BaseModel):
    name:str
    email:EmailStr
    description:str

    model_config = {
        "from_attributes": True
    }

class SignupRequest(BaseModel):
    username: str
    password: str