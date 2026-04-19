import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  const admin = JSON.parse(localStorage.getItem("studyhub_admin") || "null");

  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <div className="footer__icon" />
          <div>
            <h3>StudyHub</h3>
            <p>Study smarter with notes, papers & quizzes.</p>
          </div>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Pages</h4>
            <Link to="/">Dashboard</Link>
            <Link to="/question-papers">Question Papers</Link>
            <Link to="/notes">Notes</Link>
            <Link to="/quiz">Quiz</Link>
          </div>

          <div className="footer__col">
            <h4>More</h4>
            <Link to="/bookmarks">Bookmarks</Link>
            <Link to="/feedback">Feedback</Link>
            <Link to="/profile">Profile</Link>

            {/* ✅ Admin Links */}
            {admin ? (
              <Link to="/admin">Admin Panel</Link>
            ) : (
              <Link to="/admin/login">Admin Login</Link>
            )}
          </div>
        </div>
      </div>

      <div className="footer__bottom">© 2026 StudyHub • All rights reserved</div>
    </footer>
  );
}