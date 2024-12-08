from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

SECRET_KEY = "your_secret_key"

class JWTBearer(HTTPBearer):
    """
    Custom JWT authentication class using HTTPBearer.
    """
    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super().__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(status_code=403, detail="Invalid or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization header.")

    @staticmethod
    def verify_jwt(jwt_token: str) -> bool:
        """
        Verifies the JWT token using the SECRET_KEY.
        Returns:
            bool: True if valid, False otherwise.
        """
        try:
            payload = jwt.decode(jwt_token, SECRET_KEY, algorithms=["HS256"])
            return True
        except jwt.ExpiredSignatureError:
            return False
        except jwt.InvalidTokenError:
            return False
