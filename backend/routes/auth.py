from flask import Blueprint, request, jsonify
from utils.db import db
from models import User
from utils.jwt import create_token, decode_token
import bcrypt

auth_bp = Blueprint("auth", __name__)

# ===================== SIGNUP =====================
@auth_bp.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    course = data.get("course")
    semester = data.get("semester")

    if not all([name, email, password, course, semester]):
        return jsonify({"error": "All fields are required"}), 400

    # Check if email already exists
    existing = User.query.filter_by(email=email.strip().lower()).first()
    if existing:
        return jsonify({"error": "Email already registered"}), 400

    # Hash password
    hashed_pw = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    # Create new user
    new_user = User(
        name=name.strip(),
        email=email.strip().lower(),
        password_hash=hashed_pw,
        course=course,
        semester=semester,
        role="student"
    )
    db.session.add(new_user)
    db.session.commit()

    token = create_token(new_user.id, new_user.role)
    return jsonify({
        "message": "Signup successful",
        "token": token,
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email,
            "course": new_user.course,
            "semester": new_user.semester,
            "role": new_user.role
        }
    }), 201

# ===================== LOGIN =====================
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not all([email, password]):
        return jsonify({"error": "Email and password required"}), 400

    user = User.query.filter_by(email=email.strip().lower()).first()
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    # Verify password
    if not bcrypt.checkpw(password.encode("utf-8"), user.password_hash.encode("utf-8")):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_token(user.id, user.role)
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "course": user.course,
            "semester": user.semester,
            "role": user.role
        }
    }), 200

# ===================== CURRENT USER =====================
@auth_bp.route("/me", methods=["GET"])
def me():
    token_header = request.headers.get("Authorization")
    if not token_header:
        return jsonify({"error": "Authorization header required"}), 401

    token = token_header.replace("Bearer ", "")
    payload = decode_token(token)
    if not payload:
        return jsonify({"error": "Invalid or expired token"}), 401

    user = User.query.get(payload["id"])
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "course": user.course,
        "semester": user.semester,
        "role": user.role
    }), 200