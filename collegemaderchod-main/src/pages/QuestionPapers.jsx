import React, { useEffect, useState } from "react";
import "./QuestionPapers.css";
import { getPapers } from "../lib/api"; // <-- new API function

function getBookmarks() {
  return JSON.parse(localStorage.getItem("studyhub_bookmarks") || "[]");
}
function setBookmarks(bm) {
  localStorage.setItem("studyhub_bookmarks", JSON.stringify(bm));
}

export default function QuestionPapers() {
  const [papers, setPapers] = useState([]);
  const [course, setCourse] = useState("All");
  const [semester, setSemester] = useState("All");
  const [subject, setSubject] = useState("All");

  // ✅ Fetch papers from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPapers(); // call API
        setPapers(data); // backend returns array of papers
      } catch (err) {
        console.error("Error fetching papers:", err);
        setPapers([]); // fallback
      }
    };
    fetchData();
  }, []);

  const courses = ["All", ...new Set(papers.map((p) => p.course))];
  const semesters = ["All", ...new Set(papers.map((p) => p.semester))];
  const subjects = ["All", ...new Set(papers.map((p) => p.subject))];

  const filtered = papers.filter((p) => {
    if (course !== "All" && p.course !== course) return false;
    if (semester !== "All" && p.semester !== semester) return false;
    if (subject !== "All" && p.subject !== subject) return false;
    return true;
  });

  const toggleBookmark = (paper) => {
    const bm = getBookmarks();
    const exists = bm.some((b) => b.type === "PAPER" && b.itemId === paper.id);
    const next = exists
      ? bm.filter((b) => !(b.type === "PAPER" && b.itemId === paper.id))
      : [
          {
            type: "PAPER",
            itemId: paper.id,
            title: paper.title,
            course: paper.course,
            semester: paper.semester,
            subject: paper.subject,
            year: paper.year,
          },
          ...bm,
        ];
    setBookmarks(next);
    alert(exists ? "Removed from bookmarks" : "Bookmarked");
  };

  const downloadPaper = (paper) => {
    if (paper.file_path) {
      // backend should serve file via /files/<filename>
      window.open(`http://localhost:5000/${paper.file_path}`, "_blank");
      return;
    }
    alert("No file available");
  };

  return (
    <div className="page">
      <h1 className="h1">Question Papers</h1>

      <div className="selectRow">
        <div>
          <label>Course</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            {courses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Semester</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            {semesters.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="qpList">
        {filtered.map((p) => (
          <div className="qpCard card" key={p.id}>
            <div className="qpLeft">
              <h3>{p.title}</h3>
              <p>
                {p.course} • {p.semester} • {p.subject} • {p.year}
              </p>
              <small className="muted">
                File: {p.file_path ? p.file_path : "(no file)"}
              </small>
            </div>

            <div className="qpRight">
              <button className="downloadBtn" onClick={() => downloadPaper(p)}>
                Download
              </button>
              <button
                className="bookmarkBtn"
                onClick={() => toggleBookmark(p)}
                title="Bookmark"
              >
                🔖
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && <div className="card">No papers found.</div>}
      </div>
    </div>
  );
}