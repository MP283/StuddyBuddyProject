import React, { useEffect, useState } from "react";
import "./Notes.css";
import { getNotes } from "../lib/api";

function getBookmarks() {
  return JSON.parse(localStorage.getItem("studyhub_bookmarks") || "[]");
}
function setBookmarks(bm) {
  localStorage.setItem("studyhub_bookmarks", JSON.stringify(bm));
}

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [course, setCourse] = useState("All");
  const [semester, setSemester] = useState("All");
  const [subject, setSubject] = useState("All");

  // ✅ Fetch notes from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNotes();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setNotes([]); // fallback
      }
    };
    fetchData();
  }, []);

  const courses = ["All", ...new Set(notes.map((n) => n.course))];
  const semesters = ["All", ...new Set(notes.map((n) => n.semester))];
  const subjects = ["All", ...new Set(notes.map((n) => n.subject))];

  const filtered = notes.filter((n) => {
    if (course !== "All" && n.course !== course) return false;
    if (semester !== "All" && n.semester !== semester) return false;
    if (subject !== "All" && n.subject !== subject) return false;
    return true;
  });

  const toggleBookmark = (note) => {
    const bm = getBookmarks();
    const exists = bm.some((b) => b.type === "NOTE" && b.itemId === note.id);
    const next = exists
      ? bm.filter((b) => !(b.type === "NOTE" && b.itemId === note.id))
      : [
          {
            type: "NOTE",
            itemId: note.id,
            title: note.title,
            course: note.course,
            semester: note.semester,
            subject: note.subject
          },
          ...bm
        ];
    setBookmarks(next);
    alert(exists ? "Removed from bookmarks" : "Bookmarked");
  };

  const downloadNote = (note) => {
    if (note.file_path) {
      window.open(`http://localhost:5000/${note.file_path}`, "_blank");
      return;
    }
    alert(`No file available for ${note.title}`);
  };

  return (
    <div className="page notesPage">
      <h1 className="h1">Notes</h1>
      <p className="sub">Select Course + Semester + Subject</p>

      <div className="selectRow">
        <div>
          <label>Course</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            {courses.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Semester</label>
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
            {semesters.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Subject</label>
          <select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="list">
        {filtered.map((n) => (
          <div className="itemCard card" key={n.id}>
            <div className="itemLeft">
              <h3>{n.title}</h3>
              <p>{n.course} • {n.semester} • {n.subject}</p>
            </div>
            <div className="itemRight">
              <button className="downloadBtn" onClick={() => downloadNote(n)}>Download</button>
              <button className="bookmarkBtn" onClick={() => toggleBookmark(n)} title="Bookmark">🔖</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="card">No notes found.</div>}
      </div>
    </div>
  );
}