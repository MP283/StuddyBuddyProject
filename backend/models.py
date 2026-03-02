from utils.db import db
from datetime import datetime, timezone

# ================= USERS =================
class User(db.Model):
    __tablename__ = "users"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    course = db.Column(db.String(50), nullable=True)
    semester = db.Column(db.String(50), nullable=True)
    role = db.Column(db.Enum("student", "admin"), default="student")

# ================= QUESTION PAPERS =================
class QuestionPaper(db.Model):
    __tablename__ = "question_papers"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course = db.Column(db.String(50), nullable=False)
    semester = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(10), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

# ================= NOTES =================
class Note(db.Model):
    __tablename__ = "notes"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course = db.Column(db.String(50), nullable=False)
    semester = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    year = db.Column(db.String(10), nullable=False)
    file_path = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

# ================= QUIZZES =================
class Quiz(db.Model):
    __tablename__ = "quizzes"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    course = db.Column(db.String(50), nullable=False)
    semester = db.Column(db.String(50), nullable=False)
    subject = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    questions = db.relationship("QuizQuestion", backref="quiz", cascade="all, delete-orphan")

class QuizQuestion(db.Model):
    __tablename__ = "quiz_questions"

    id = db.Column(db.Integer, primary_key=True)
    quiz_id = db.Column(db.Integer, db.ForeignKey("quizzes.id"), nullable=False)
    question = db.Column(db.String(500), nullable=False)
    option_a = db.Column(db.String(200), nullable=False)
    option_b = db.Column(db.String(200), nullable=False)
    option_c = db.Column(db.String(200), nullable=False)
    option_d = db.Column(db.String(200), nullable=False)
    answer_index = db.Column(db.Integer, nullable=False)

# ================= BOOKMARKS =================
class Bookmark(db.Model):
    __tablename__ = "bookmarks"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    type = db.Column(db.String(20), nullable=False)  # NOTE or PAPER
    item_id = db.Column(db.Integer, nullable=False)

# ================= FEEDBACK =================
class Feedback(db.Model):
    __tablename__ = "feedback"
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))