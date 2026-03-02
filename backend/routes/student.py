from flask import Blueprint, request, jsonify, send_file
from utils.db import db
from models import QuestionPaper, Note, Quiz, QuizQuestion, Feedback
from utils.jwt import decode_token
from utils.file_handler import get_file

student_bp = Blueprint("student", __name__)

# ===================== AUTH CHECK =====================
def require_student(token):
    if not token:
        return None

    # Strip "Bearer " if present
    if token.startswith("Bearer "):
        token = token.replace("Bearer ", "")

    payload = decode_token(token)
    if not payload or payload.get("role") != "student":
        return None
    return payload

# ===================== PAPERS =====================
@student_bp.route("/papers", methods=["GET"])
def get_papers():
    papers = QuestionPaper.query.all()
    result = [
        {
            "id": p.id,
            "title": p.title,
            "course": p.course,
            "semester": p.semester,
            "subject": p.subject,
            "year": p.year,
            "file_path": p.file_path
        }
        for p in papers
    ]
    return jsonify(result)

@student_bp.route("/papers/<int:paper_id>/download", methods=["GET"])
def download_paper(paper_id):
    paper = QuestionPaper.query.get(paper_id)
    if not paper:
        return jsonify({"error": "Paper not found"}), 404
    try:
        return send_file(get_file(paper.file_path), as_attachment=True)
    except FileNotFoundError:
        return jsonify({"error": "File missing"}), 404
    

# ===================== NOTES =====================
@student_bp.route("/notes", methods=["GET"])
def get_notes():
    notes = Note.query.all()
    result = [
        {
            "id": n.id,
            "title": n.title,
            "course": n.course,
            "semester": n.semester,
            "subject": n.subject,
            "year": n.year,
            "file_path": n.file_path
        }
        for n in notes
    ]
    return jsonify(result)

@student_bp.route("/notes/<int:note_id>/download", methods=["GET"])
def download_note(note_id):
    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404
    try:
        return send_file(get_file(note.file_path), as_attachment=True)
    except FileNotFoundError:
        return jsonify({"error": "File missing"}), 404

# ===================== QUIZZES =====================
@student_bp.route("/quizzes", methods=["GET"])
def get_quizzes():
    quizzes = Quiz.query.all()
    result = []
    for q in quizzes:
        questions = QuizQuestion.query.filter_by(quiz_id=q.id).all()
        result.append({
            "id": q.id,
            "title": q.title,
            "course": q.course,
            "semester": q.semester,
            "subject": q.subject,
            "questions": [
                {
                    "id": ques.id,
                    "question": ques.question,
                    "options": [ques.option_a, ques.option_b, ques.option_c, ques.option_d],
                    "answerIndex": ques.answer_index
                }
                for ques in questions
            ]
        })
    return jsonify(result)

# ===================== FEEDBACK =====================
@student_bp.route("/feedback", methods=["POST"])
def submit_feedback():
    token = request.headers.get("Authorization")
    payload = require_student(token)
    if not payload:
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    text = data.get("text")
    if not text:
        return jsonify({"error": "Feedback text required"}), 400

    feedback = Feedback(user_id=payload["user_id"], text=text)
    db.session.add(feedback)
    db.session.commit()

    return jsonify({"message": "Feedback submitted"}), 201