from flask import Blueprint, request, jsonify
from utils.db import db
from models import QuestionPaper, Note, Quiz, QuizQuestion
from utils.file_handler import save_file
from utils.jwt import decode_token, create_token  # make sure create_token is imported

admin_bp = Blueprint("admin", __name__)

# ===================== AUTH CHECK =====================
def require_admin(token_header):
    if not token_header:
        return None
    if token_header.startswith("Bearer "):
        token_header = token_header.replace("Bearer ", "")
    payload = decode_token(token_header)
    if not payload or payload.get("role") != "admin":
        return None
    return payload

# ===================== ADMIN LOGIN (Hardcoded) =====================
@admin_bp.route("/login", methods=["POST"])
def admin_login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    # Hardcoded credentials
    if email == "admin12@gmail.com" and password == "admin123":
        token = create_token("admin", "admin")  # payload includes role=admin
        return jsonify({"token": token, "role": "admin"}), 200

    return jsonify({"error": "Invalid admin credentials"}), 403

# ===================== PAPERS =====================
@admin_bp.route("/papers", methods=["POST"])
def add_paper():
    token = request.headers.get("Authorization")
    if not require_admin(token):
        return jsonify({"error": "Unauthorized"}), 403

    title = request.form.get("title")
    course = request.form.get("course")
    semester = request.form.get("semester")
    subject = request.form.get("subject")
    year = request.form.get("year")
    file = request.files.get("file")

    if not all([title, course, semester, subject, year, file]):
        return jsonify({"error": "All fields required"}), 400

    try:
        file_path = save_file(file)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    paper = QuestionPaper(
        title=title,
        course=course,
        semester=semester,
        subject=subject,
        year=year,
        file_path=file_path
    )
    db.session.add(paper)
    db.session.commit()

    return jsonify({"message": "Paper added", "id": paper.id}), 201

@admin_bp.route("/papers/<int:paper_id>", methods=["DELETE"])
def delete_paper(paper_id):
    token = request.headers.get("Authorization")
    if not require_admin(token):
        return jsonify({"error": "Unauthorized"}), 403

    paper = QuestionPaper.query.get(paper_id)
    if not paper:
        return jsonify({"error": "Paper not found"}), 404

    db.session.delete(paper)
    db.session.commit()
    return jsonify({"message": "Paper deleted"}), 200

@admin_bp.route("/papers", methods=["GET"])
def list_papers_public():
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
    return jsonify(result), 200

# ===================== NOTES =====================
@admin_bp.route("/notes", methods=["POST"])
def add_note():
    token = request.headers.get("Authorization")
    if not require_admin(token):
        return jsonify({"error": "Unauthorized"}), 403

    title = request.form.get("title")
    course = request.form.get("course")
    semester = request.form.get("semester")
    subject = request.form.get("subject")
    year = request.form.get("year")
    file = request.files.get("file")

    if not all([title, course, semester, subject, year, file]):
        return jsonify({"error": "All fields required"}), 400

    try:
        file_path = save_file(file)
    except ValueError as e:
        return jsonify({"error": str(e)}), 400

    note = Note(
        title=title,
        course=course,
        semester=semester,
        subject=subject,
        year=year,
        file_path=file_path
    )
    db.session.add(note)
    db.session.commit()

    return jsonify({"message": "Note added", "id": note.id}), 201

@admin_bp.route("/notes/<int:note_id>", methods=["DELETE"])
def delete_note(note_id):
    token = request.headers.get("Authorization")
    if not require_admin(token):
        return jsonify({"error": "Unauthorized"}), 403

    note = Note.query.get(note_id)
    if not note:
        return jsonify({"error": "Note not found"}), 404

    db.session.delete(note)
    db.session.commit()
    return jsonify({"message": "Note deleted"}), 200

@admin_bp.route("/notes", methods=["GET"])
def list_notes_public():
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
    return jsonify(result), 200

# ===================== QUIZZES =====================
@admin_bp.route("/quizzes", methods=["GET"])
def list_quizzes_public():
    quizzes = Quiz.query.all()
    result = []
    for q in quizzes:
        questions = []
        for qq in QuizQuestion.query.filter_by(quiz_id=q.id).all():
            opts = [qq.option_a, qq.option_b, qq.option_c, qq.option_d]
            correct_answer = None
            if qq.answer_index is not None and 0 <= qq.answer_index < len(opts):
                correct_answer = opts[qq.answer_index]
            questions.append({
                "id": qq.id,
                "question": qq.question,
                "options": opts,
                "answerIndex": qq.answer_index,
                "correct_answer": correct_answer
            })
        result.append({
            "id": q.id,
            "title": q.title,
            "course": q.course,
            "semester": q.semester,
            "subject": q.subject,
            "questions": questions
        })
    return jsonify(result), 200

@admin_bp.route("/quizzes", methods=["POST"])
def create_quiz():
    token = request.headers.get("Authorization")
    if not require_admin(token):
        return jsonify({"error": "Unauthorized"}), 403

    data = request.json
    title = data.get("title")
    course = data.get("course")
    semester = data.get("semester")
    subject = data.get("subject")
    questions = data.get("questions", [])

    if not all([title, course, semester, subject]) or len(questions) == 0:
        return jsonify({"error": "Quiz title and at least one question required"}), 400

    quiz = Quiz(title=title, course=course, semester=semester, subject=subject)
    db.session.add(quiz)
    db.session.flush()

    for q in questions:
        question = QuizQuestion(
            quiz_id=quiz.id,
            question=q["question"],
            option_a=q["options"][0],
            option_b=q["options"][1],
            option_c=q["options"][2],
            option_d=q["options"][3],
            answer_index=q["answerIndex"]
        )
        db.session.add(question)

    db.session.commit()
    return jsonify({"message": "Quiz created", "id": quiz.id}), 201

@admin_bp.route("/quizzes/<int:quiz_id>", methods=["DELETE"])
def delete_quiz(quiz_id):
    token = request.headers.get("Authorization")
    if not require_admin(token):
        return jsonify({"error": "Unauthorized"}), 403

    quiz = Quiz.query.get(quiz_id)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404

    db.session.delete(quiz)
    db.session.commit()
    return jsonify({"message": "Quiz deleted"}), 200