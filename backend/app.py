from flask import Flask
from flask_cors import CORS
from utils.db import init_db, db   # import db from utils/db.py
from routes.auth import auth_bp
from routes.admin import admin_bp
from routes.student import student_bp

def create_app():
    app = Flask(__name__)
    CORS(app)

    #, origins=["http://localhost:5173"]
    # Initialize DB with app
    init_db(app)

    # Register routes
    app.register_blueprint(auth_bp, url_prefix="/auth")
    app.register_blueprint(admin_bp, url_prefix="/admin")
    app.register_blueprint(student_bp, url_prefix="/student")

    return app

if __name__ == "__main__":
    app = create_app()

    # Create tables inside app context
    # with app.app_context():
        # db.create_all()

    app.run(host="0.0.0.0", port=5000, debug=True)