from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field
from aiModels.database.user_queries import (
    add_user,
    fetch_user_by_id,
    fetch_all_users,
    authenticate_user,
    register_user,
)
import jwt
import datetime

# Secret key for signing JWT tokens (to be stored securely in environment variables)
SECRET_KEY = "your_secret_key"

# Initialise the router
router = APIRouter()

# Request models
class UserRegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    password: str = Field(..., min_length=6)
    email: EmailStr
    role: str = Field(
        ...,
        description="Role of the user. Must be one of ['engineer', 'business', 'homeowner', 'property_manager', 'tenant']",
    )
    associated_property_manager: str = Field(
        None, description="Required if the user role is 'tenant'."
    )

class UserLoginRequest(BaseModel):
    username: str
    password: str

@router.post("/register")
async def register_user_route(user_request: UserRegisterRequest):
    """
    Register a new user in the system.

    Parameters:
    - user_request (UserRegisterRequest): User details for registration.

    Returns:
        JSON response with a success message and the new user's ID.
    """
    try:
        # Validate user role
        valid_roles = ["engineer", "business", "homeowner", "property_manager", "tenant"]
        if user_request.role not in valid_roles:
            raise HTTPException(status_code=400, detail="Invalid role specified.")

        # Ensure tenants have an associated property manager
        if user_request.role == "tenant" and not user_request.associated_property_manager:
            raise HTTPException(
                status_code=400,
                detail="Tenants must have an associated property manager.",
            )

        # Register the user in the database
        user_id = register_user(user_request.dict())
        return {"message": "User registered successfully!", "user_id": user_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error registering user: {e}")

@router.post("/login")
async def login_user_route(user_request: UserLoginRequest):
    """
    Authenticate a user and return a JWT token.

    Parameters:
    - user_request (UserLoginRequest): Login credentials (username and password).

    Returns:
        JSON response with a JWT token if credentials are valid.
    """
    try:
        # Authenticate the user
        user = authenticate_user(user_request.username, user_request.password)
        if not user:
            raise HTTPException(status_code=401, detail="Invalid username or password.")

        # Generate a JWT token
        token = jwt.encode(
            {
                "user_id": user["user_id"],
                "role": user["role"],
                "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
            },
            SECRET_KEY,
            algorithm="HS256",
        )
        return {"message": "Login successful.", "token": token}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during login: {e}")

@router.get("/{user_id}")
async def get_user_route(user_id: str):
    """
    Retrieve user details by their unique ID.

    Parameters:
    - user_id (str): The unique ID of the user.

    Returns:
        JSON response with user details or a 404 error if the user is not found.
    """
    try:
        user = fetch_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found.")
        return {"user": user}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving user: {e}")

@router.get("/")
async def get_all_users():
    """
    Retrieve a list of all registered users.

    Returns:
        JSON response with a list of user details.
    """
    try:
        users = fetch_all_users()
        return {"users": users}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving users: {e}")
