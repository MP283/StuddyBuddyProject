import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function getUser() {
  return JSON.parse(localStorage.getItem("studyhub_user") || "null");
}
function getBookmarks() {
  return JSON.parse(localStorage.getItem("studyhub_bookmarks") || "[]");
}
function getFeedbackList() {
  return JSON.parse(localStorage.getItem("studyhub_feedback") || "[]");
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = getUser();

  const stats = useMemo(() => {
    return {
      papers: 120,
      notes: 80,
      quizzes: 50,
      bookmarks: getBookmarks().length,
      feedback: getFeedbackList().length,
    };
  }, []);

  return (
    <div className="page dashPage">
      {/* HERO SECTION */}
      <div className="dashHeroSimple">
        <p className="heroKicker">Your smart study companion</p>

        <h1 className="heroTitle">
          Welcome back, <span>{user?.name?.split(" ")[0] || "Student"}</span> 👋
        </h1>

        <p className="heroSub">
          Course: <b>{user?.course || "-"}</b> • Semester: <b>{user?.semester || "-"}</b>
        </p>

        <div className="heroActions">
          <button className="btnPrimary" onClick={() => navigate("/notes")}>
            Explore Notes
          </button>

          <button className="btnDark" onClick={() => navigate("/quiz")}>
            Start Quiz
          </button>

          <button className="btnGhost" onClick={() => navigate("/question-papers")}>
            View Papers
          </button>
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="dashStats">
        <div className="statCard card">
          <div className="statNum">{stats.papers}+</div>
          <div className="statLabel">Question Papers</div>
          <div className="statHint">Semester-wise PDFs</div>
        </div>

        <div className="statCard card">
          <div className="statNum">{stats.notes}+</div>
          <div className="statLabel">Study Notes</div>
          <div className="statHint">Unit-wise materials</div>
        </div>

        <div className="statCard card">
          <div className="statNum">{stats.quizzes}+</div>
          <div className="statLabel">Quizzes</div>
          <div className="statHint">MCQ Practice</div>
        </div>

        <div className="statCard card accent">
          <div className="statNum">{stats.bookmarks}</div>
          <div className="statLabel">Bookmarks</div>
          <div className="statHint">Saved resources</div>
        </div>

        <div className="statCard card accent2">
          <div className="statNum">{stats.feedback}</div>
          <div className="statLabel">Feedback</div>
          <div className="statHint">Your suggestions</div>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="sectionHead">
        <h2>Quick Actions</h2>
        <p>Access resources instantly.</p>
      </div>

      <div className="quickGrid">
        <button className="quickCard card" onClick={() => navigate("/question-papers")}>
          <div className="qIcon">📄</div>
          <div>
            <h3>Question Papers</h3>
            <p>Download previous year papers</p>
          </div>
          <span className="arrow">›</span>
        </button>

        <button className="quickCard card" onClick={() => navigate("/notes")}>
          <div className="qIcon">📚</div>
          <div>
            <h3>Notes</h3>
            <p>Download unit-wise notes</p>
          </div>
          <span className="arrow">›</span>
        </button>

        <button className="quickCard card" onClick={() => navigate("/quiz")}>
          <div className="qIcon">📝</div>
          <div>
            <h3>Quiz</h3>
            <p>Test your knowledge</p>
          </div>
          <span className="arrow">›</span>
        </button>

        <button className="quickCard card" onClick={() => navigate("/bookmarks")}>
          <div className="qIcon">🔖</div>
          <div>
            <h3>Bookmarks</h3>
            <p>Your saved materials</p>
          </div>
          <span className="arrow">›</span>
        </button>
      </div>
    </div>
  );
}