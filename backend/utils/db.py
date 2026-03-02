from flask_sqlalchemy import SQLAlchemy
import mysql.connector
from config import DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

# Single shared SQLAlchemy instance
db = SQLAlchemy()

def init_db(app):
    """
    Configure and initialize SQLAlchemy with the Flask app.
    """
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)

def get_db():
    """
    Raw MySQL connection (useful for direct queries outside SQLAlchemy).
    """
    return mysql.connector.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME
    )