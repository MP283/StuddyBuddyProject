import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function getUser() {
  return JSON.parse(localStorage.getItem("studyhub_user") || "null");
}

function getBookmarks() {
  return JSON.parse(localStorage.getItem("studyhub_bookmarks") || "[]");
}

function getFeedbackList() {
  return JSON.parse(localStorage.getItem("studyhub_feedback") || "[]");
}

// optional demo: store activity like [{type:"LOGIN", text:"Signed in", at: Date.now()}]
function getActivity() {
  return JSON.parse(localStorage.getItem("studyhub_activity") || "[]");
}

export default function Profile() {
  const navigate = useNavigate();
  const user = getUser();

  const stats = useMemo(() => {
    const bookmarks = getBookmarks().length;
    const feedback = getFeedbackList().length;
    // demo numbers (replace later with API counts)
    const notes = 80;
    const papers = 120;
    const quizzes = 50;

    return { bookmarks, feedback, notes, papers, quizzes };
  }, []);

  const activity = useMemo(() => {
    const a = getActivity();
    return a.slice(0, 6);
  }, []);

  const logout = () => {
    localStorage.removeItem("studyhub_user");
    navigate("/auth");
  };

  const clearLocalData = () => {
    const keepUser = localStorage.getItem("studyhub_user");
    localStorage.clear();
    if (keepUser) localStorage.setItem("studyhub_user", keepUser);
    alert("Cleared app data (kept logged-in user).");
    window.location.reload();
  };

  const initials = (user?.name || "Student")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  return (
    <div className="page profilePage">
      <div className="profileHeader card">
        <div className="avatar">{initials}</div>

        <div className="profileInfo">
          <div className="nameRow">
            <h1 className="profileName">{user?.name || "Student"}</h1>
            <span className="roleBadge">{user?.role || "student"}</span>
          </div>

          <p className="profileEmail">{user?.email || "-"}</p>

          <div className="metaRow">
            <div className="metaPill">
              <span className="metaLabel">Course</span>
              <span className="metaValue">{user?.course || "-"}</span>
            </div>
            <div className="metaPill">
              <span className="metaLabel">Semester</span>
              <span className="metaValue">{user?.semester || "-"}</span>
            </div>
          </div>
        </div>

        <div className="profileActions">
          <button className="btnPrimary" onClick={() => navigate("/bookmarks")}>
            View Bookmarks
          </button>
          <button className="btnGhost" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profileGrid">
        {/* About Card */}
        <div className="card aboutCard">
          <h3 className="cardTitle">About</h3>
          <p className="aboutText">
            Welcome to StudyHub! Here you can access notes, question papers and quizzes based on your course & semester.
            Your bookmarks and feedback are saved locally (demo).
          </p>

          <div className="aboutList">
            <div className="aboutItem">
              <span className="dot" />
              <span>Quick access to study resources</span>
            </div>
            <div className="aboutItem">
              <span className="dot" />
              <span>Bookmark important notes & papers</span>
            </div>
            <div className="aboutItem">
              <span className="dot" />
              <span>Give feedback to improve content</span>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="card statsCard">
          <h3 className="cardTitle">Your Stats</h3>

          <div className="statsGrid">
            <div className="statBox">
              <div className="statNum">{stats.bookmarks}</div>
              <div className="statLabel">Bookmarks</div>
            </div>
            <div className="statBox">
              <div className="statNum">{stats.notes}+</div>
              <div className="statLabel">Notes</div>
            </div>
            <div className="statBox">
              <div className="statNum">{stats.papers}+</div>
              <div className="statLabel">Papers</div>
            </div>
            <div className="statBox">
              <div className="statNum">{stats.quizzes}+</div>
              <div className="statLabel">Quizzes</div>
            </div>
            <div className="statBox">
              <div className="statNum">{stats.feedback}</div>
              <div className="statLabel">Feedback</div>
            </div>
          </div>

          <div className="statsButtons">
            <button className="btnPrimary" onClick={() => navigate("/notes")}>
              Explore Notes
            </button>
            <button className="btnDark" onClick={() => navigate("/quiz")}>
              Start Quiz
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card activityCard">
          <h3 className="cardTitle">Recent Activity</h3>

          {activity.length === 0 ? (
            <p className="mutedText">
              No activity found. (Optional) Save activity logs in localStorage under <b>studyhub_activity</b>.
            </p>
          ) : (
            <div className="activityList">
              {activity.map((a, idx) => (
                <div className="activityItem" key={idx}>
                  <div className="activityTag">{a.type || "INFO"}</div>
                  <div className="activityText">
                    <div className="activityMain">{a.text || "Activity"}</div>
                    <div className="activityTime">
                      {a.at ? new Date(a.at).toLocaleString() : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="dangerZone">
            <div>
              <h4>Danger Zone</h4>
              <p className="mutedText">This will remove bookmarks/feedback etc. (keeps logged-in user).</p>
            </div>
            <button className="btnDanger" onClick={clearLocalData}>
              Clear App Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}