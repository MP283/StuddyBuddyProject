import jwt
from datetime import datetime, timedelta
from config import JWT_SECRET, JWT_ALGORITHM

def create_token(user_id, role, expires_in=3600):
    """
    Create a JWT token for a user.
    :param user_id: ID of the user
    :param role: Role of the user (student/admin)
    :param expires_in: Expiration time in seconds (default 1 hour)
    """
    payload = {
        "user_id": user_id,
        "role": role,
        "exp": datetime.utcnow() + timedelta(seconds=expires_in),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def decode_token(token):
    """
    Decode and validate a JWT token.
    Returns payload if valid, otherwise None.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token