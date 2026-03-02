import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("studyhub_user") || "null");

  const logout = () => {
    localStorage.removeItem("studyhub_user");
    navigate("/auth");
  };

  return (
    <header className="nav">
      <div className="nav__left" onClick={() => navigate("/")}>
        <div className="nav__logoBox" />
        <span className="nav__brand">StudyHub</span>
      </div>

      <nav className="nav__links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
          Dashboard
        </NavLink>
        <NavLink to="/question-papers" className={({ isActive }) => (isActive ? "active" : "")}>
          Question Papers
        </NavLink>
        <NavLink to="/notes" className={({ isActive }) => (isActive ? "active" : "")}>
          Notes
        </NavLink>
        <NavLink to="/quiz" className={({ isActive }) => (isActive ? "active" : "")}>
          Quiz
        </NavLink>
        <NavLink to="/bookmarks" className={({ isActive }) => (isActive ? "active" : "")}>
          Bookmarks
        </NavLink>
        <NavLink to="/feedback" className={({ isActive }) => (isActive ? "active" : "")}>
          Feedback
        </NavLink>
      </nav>

      <div className="nav__right">
        <button className="nav__pill" onClick={() => navigate("/profile")}>
          Profile
        </button>

        {user ? (
          <button className="nav__ghost" onClick={logout}>
            Logout
          </button>
        ) : (
          <button className="nav__ghost" onClick={() => navigate("/auth")}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}