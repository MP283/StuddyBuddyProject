// AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";
import {
  addPaper,
  deletePaper,
  getPapers,
  addNote,
  deleteNote,
  getNotes,
  createQuiz,
  deleteQuiz,
  getQuizzes,
} from "../lib/api";

const SUBJECTS_BY_COURSE = {
  BCA: ["Mathematics I", "Programming Basics", "DBMS", "Data Structures", "Operating System"],
  BBA: ["Business Mathematics", "Accounting", "Marketing", "Economics"],
  BCOM: ["Financial Accounting", "Business Law", "Taxation"],
  BA: ["History", "Political Science", "English Literature"],
  BSC: ["Physics", "Chemistry", "Mathematics"],
};

const COURSES = Object.keys(SUBJECTS_BY_COURSE);
const SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];

export default function AdminPanel() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("papers");

  const [papers, setPapers] = useState([]);
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const admin = JSON.parse(localStorage.getItem("studyhub_admin") || "null");

  const logout = () => {
    localStorage.removeItem("studyhub_admin");
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  // Load data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      setPapers(await getPapers());
      setNotes(await getNotes());
      setQuizzes(await getQuizzes());
    };
    fetchData();
  }, []);

  // ===================== PAPERS =====================
  const [paperForm, setPaperForm] = useState({
    title: "",
    course: "BCA",
    semester: "Semester 1",
    subject: SUBJECTS_BY_COURSE["BCA"][0],
    year: "",
    file: null,
  });

  const addPaperHandler = async (e) => {
    e.preventDefault();
    if (!paperForm.file) return alert("Please select a PDF file.");

    const formData = new FormData();
    formData.append("title", paperForm.title);
    formData.append("course", paperForm.course);
    formData.append("semester", paperForm.semester);
    formData.append("subject", paperForm.subject);
    formData.append("year", paperForm.year);
    formData.append("file", paperForm.file);

    try {
      const res = await addPaper(formData);
      alert(res.message);
      setPapers((prev) => [res, ...prev]);
      setPaperForm({ title: "", course: "BCA", semester: "Semester 1", subject: SUBJECTS_BY_COURSE["BCA"][0], year: "", file: null });
    } catch (err) {
      console.error(err);
      alert("Failed to upload paper");
    }
  };

  

  const deletePaperHandler = async (id) => {
    try {
      await deletePaper(id);
      setPapers((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete paper");
    }
  };

  // ===================== NOTES =====================
  const [noteForm, setNoteForm] = useState({
    title: "",
    course: "BCA",
    semester: "Semester 1",
    subject: SUBJECTS_BY_COURSE["BCA"][0],
    year: "",
    file: null,
  });

  

  const addNoteHandler = async (e) => {
    e.preventDefault();
    if (!noteForm.file) return alert("Please select a PDF file.");

    const formData = new FormData();
    formData.append("title", noteForm.title);
    formData.append("course", noteForm.course);
    formData.append("semester", noteForm.semester);
    formData.append("subject", noteForm.subject);
    formData.append("year", noteForm.year);
    formData.append("file", noteForm.file);

    try {
      const res = await addNote(formData); // calls API helper
      alert(res.message);
      setNotes((prev) => [res, ...prev]); // update state
      setNoteForm({
        title: "",
        course: "BCA",
        semester: "Semester 1",
        subject: SUBJECTS_BY_COURSE["BCA"][0],
        year: "",
        file: null,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to upload note");
    }
  };

  const deleteNoteHandler = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete note");
    }
  };

  // ===================== QUIZZES =====================
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [quizForm, setQuizForm] = useState({ title: "", course: "BCA", semester: "Semester 1", subject: SUBJECTS_BY_COURSE["BCA"][0] });
  const [questionDraft, setQuestionDraft] = useState({ question: "", options: ["", "", "", ""], answerIndex: 0 });
  const [draftQuestions, setDraftQuestions] = useState([]);

  const resetQuizForm = () => {
    setEditingQuiz(null);
    setQuizForm({ title: "", course: "BCA", semester: "Semester 1", subject: SUBJECTS_BY_COURSE["BCA"][0] });
    setDraftQuestions([]);
    setQuestionDraft({ question: "", options: ["", "", "", ""], answerIndex: 0 });
  };

  const addDraftQuestion = () => {
    if (!questionDraft.question.trim()) return alert("Question is required.");
    if (questionDraft.options.some((o) => !o.trim())) return alert("All 4 options are required.");

    setDraftQuestions((prev) => [...prev, { ...questionDraft, id: Date.now() }]);
    setQuestionDraft({ question: "", options: ["", "", "", ""], answerIndex: 0 });
  };

  // Load quizzes on mount
useEffect(() => {
  const fetchQuizzes = async () => {
    setQuizzes(await getQuizzes());
  };
  fetchQuizzes();
}, []);

// Submit quiz
const submitQuizHandler = async (e) => {
  e.preventDefault();
  if (!quizForm.title.trim()) return alert("Quiz Title is required.");
  if (draftQuestions.length === 0) return alert("Add at least 1 question.");

  const quizData = {
    title: quizForm.title,
    course: quizForm.course,
    semester: quizForm.semester,
    subject: quizForm.subject,
    questions: draftQuestions,
  };

  try {
    const res = await createQuiz(quizData);
    alert(res.message);
    setQuizzes((prev) => [quizData, ...prev]); // add new quiz to state
    resetQuizForm();
  } catch (err) {
    console.error(err);
    alert("Failed to create quiz");
  }
};

// Delete quiz
const deleteQuizHandler = async (id) => {
  try {
    await deleteQuiz(id);
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  } catch (err) {
    console.error(err);
    alert("Failed to delete quiz");
  }
};

  
    // ===================== UI =====================
  return (
    <div className="page adminPage">
      <div className="adminTop">
        <div>
          <h1 className="h1">Admin Panel</h1>
          <p className="adminMeta">
            Logged in as: <b>{admin?.email || "admin"}</b>
          </p>
        </div>
        <div className="adminTopActions">
          <button className="btnGhost" onClick={() => navigate("/")}>Student Site</button>
          <button className="btnDark" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="adminTabs">
        <button className={tab === "papers" ? "tab active" : "tab"} onClick={() => setTab("papers")}>
          Question Papers
        </button>
        <button className={tab === "notes" ? "tab active" : "tab"} onClick={() => setTab("notes")}>
          Notes
        </button>
        <button className={tab === "quizzes" ? "tab active" : "tab"} onClick={() => setTab("quizzes")}>
          Quizzes
        </button>
      </div>

      

      {/* ===================== PAPERS ===================== */}
      {tab === "papers" && (
        <div className="adminGrid">
          <div className="card">
            <h3 className="cardTitle">Add Question Paper (PDF)</h3>
            <form className="adminForm" onSubmit={addPaperHandler}>
              <div>
                <label>Title</label>
                <input
                  value={paperForm.title}
                  onChange={(e) => setPaperForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Math I Paper 2024"
                  required
                />
              </div>
              <div className="twoCol">
                <div>
                  <label>Course</label>
                  <select
                    value={paperForm.course}
                    onChange={(e) => {
                      const newCourse = e.target.value;
                      setPaperForm((p) => ({
                        ...p,
                        course: newCourse,
                        subject: SUBJECTS_BY_COURSE[newCourse][0],
                      }));
                    }}
                  >
                    {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Semester</label>
                  <select
                    value={paperForm.semester}
                    onChange={(e) => setPaperForm((p) => ({ ...p, semester: e.target.value }))}
                  >
                    {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="twoCol">
                <div>
                  <label>Subject</label>
                  <select
                    value={paperForm.subject}
                    onChange={(e) => setPaperForm((p) => ({ ...p, subject: e.target.value }))}
                  >
                    {SUBJECTS_BY_COURSE[paperForm.course].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label>Year</label>
                  <input
                    value={paperForm.year}
                    onChange={(e) => setPaperForm((p) => ({ ...p, year: e.target.value }))}
                    placeholder="e.g. 2024"
                    required
                  />
                </div>
              </div>
              <div>
                <label>Upload PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setPaperForm((p) => ({ ...p, file: e.target.files?.[0] || null }))}
                  required
                />
                <small className="hint">Only PDF allowed.</small>
              </div>
              <button className="btnPrimary" type="submit">Add Paper</button>
            </form>
          </div>

          <div className="card">
            <h3 className="cardTitle">All Question Papers</h3>
            <div className="adminList">
              {papers.length === 0 && <div className="empty">No papers added.</div>}
              {papers.map((p) => (
                <div className="rowItem" key={p.id}>
                  <div className="rowLeft">
                    <div className="rowTitle">{p.title}</div>
                    <div className="rowMeta">{p.course} • {p.semester} • {p.subject} • {p.year}</div>
                    <div className="rowFile">📄 {p.file_path}</div>
                  </div>
                  <div className="rowRight">
                    <button className="btnDanger" type="button" onClick={() => deletePaperHandler(p.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

            {/* ===================== NOTES ===================== */}
      {tab === "notes" && (
        <div className="adminGrid">
          <div className="card">
            <h3 className="cardTitle">Add Notes (PDF)</h3>
            <form className="adminForm" onSubmit={addNoteHandler}>
              <div>
                <label>Title</label>
                <input
                  value={noteForm.title}
                  onChange={(e) => setNoteForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. DBMS Unit 1 Notes"
                  required
                />
              </div>
              <div className="twoCol">
                <div>
                  <label>Course</label>
                  <select
                    value={noteForm.course}
                    onChange={(e) => {
                      const newCourse = e.target.value;
                      setNoteForm((p) => ({
                        ...p,
                        course: newCourse,
                        subject: SUBJECTS_BY_COURSE[newCourse][0],
                      }));
                    }}
                  >
                    {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Semester</label>
                  <select
                    value={noteForm.semester}
                    onChange={(e) => setNoteForm((p) => ({ ...p, semester: e.target.value }))}
                  >
                    {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="twoCol">
                <div>
                  <label>Subject</label>
                  <select
                    value={noteForm.subject}
                    onChange={(e) => setNoteForm((p) => ({ ...p, subject: e.target.value }))}
                  >
                    {SUBJECTS_BY_COURSE[noteForm.course].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label>Year</label>
                  <input
                    value={noteForm.year}
                    onChange={(e) => setNoteForm((p) => ({ ...p, year: e.target.value }))}
                    placeholder="e.g. 2026"
                    required
                  />
                </div>
              </div>
              <div>
                <label>Upload PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setNoteForm((p) => ({ ...p, file: e.target.files?.[0] || null }))}
                  required
                />
                <small className="hint">Only PDF allowed.</small>
              </div>
              <button className="btnPrimary" type="submit">Add Note</button>
            </form>
          </div>

          <div className="card">
            <h3 className="cardTitle">All Notes</h3>
            <div className="adminList">
              {notes.length === 0 && <div className="empty">No notes added.</div>}
              {notes.map((n) => (
                <div className="rowItem" key={n.id}>
                  <div className="rowLeft">
                    <div className="rowTitle">{n.title}</div>
                    <div className="rowMeta">{n.course} • {n.semester} • {n.subject} • {n.year}</div>
                    <div className="rowFile">📄 {n.file_path}</div>
                  </div>
                  <div className="rowRight">
                    <button className="btnDanger" type="button" onClick={() => deleteNoteHandler(n.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================== QUIZZES ===================== */}
      {tab === "quizzes" && (
        <div className="adminGrid">
          <div className="card">
            <div className="panelHead">
              <h3 className="cardTitle">{editingQuiz ? "Edit Quiz" : "Create Quiz"}</h3>
              {editingQuiz && (
                <button className="btnGhost" type="button" onClick={resetQuizForm}>
                  Cancel Edit
                </button>
              )}
            </div>

            <form className="adminForm" onSubmit={submitQuizHandler}>
              <div>
                <label>Quiz Title</label>
                <input
                  value={quizForm.title}
                  onChange={(e) => setQuizForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. DBMS Unit 1 Quiz"
                  required
                />
              </div>
              <div className="twoCol">
                <div>
                  <label>Course</label>
                  <select
                    value={quizForm.course}
                    onChange={(e) => {
                      const newCourse = e.target.value;
                      setQuizForm((p) => ({
                        ...p,
                        course: newCourse,
                        subject: SUBJECTS_BY_COURSE[newCourse][0],
                      }));
                    }}
                  >
                    {COURSES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label>Semester</label>
                  <select
                    value={quizForm.semester}
                    onChange={(e) => setQuizForm((p) => ({ ...p, semester: e.target.value }))}
                  >
                    {SEMESTERS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label>Subject</label>
                <select
                  value={quizForm.subject}
                  onChange={(e) => setQuizForm((p) => ({ ...p, subject: e.target.value }))}
                >
                  {SUBJECTS_BY_COURSE[quizForm.course].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

                          <div className="divider" />

              <h4 className="miniTitle">Add Question (MCQ)</h4>
              <div>
                <label>Question</label>
                <input
                  value={questionDraft.question}
                  onChange={(e) => setQuestionDraft((p) => ({ ...p, question: e.target.value }))}
                  placeholder="Type question..."
                />
              </div>

              <div className="twoCol">
                <div>
                  <label>Option A</label>
                  <input
                    value={questionDraft.options[0]}
                    onChange={(e) =>
                      setQuestionDraft((p) => ({
                        ...p,
                        options: [e.target.value, p.options[1], p.options[2], p.options[3]],
                      }))
                    }
                    placeholder="Option A"
                  />
                </div>
                <div>
                  <label>Option B</label>
                  <input
                    value={questionDraft.options[1]}
                    onChange={(e) =>
                      setQuestionDraft((p) => ({
                        ...p,
                        options: [p.options[0], e.target.value, p.options[2], p.options[3]],
                      }))
                    }
                    placeholder="Option B"
                  />
                </div>
              </div>

              <div className="twoCol">
                <div>
                  <label>Option C</label>
                  <input
                    value={questionDraft.options[2]}
                    onChange={(e) =>
                      setQuestionDraft((p) => ({
                        ...p,
                        options: [p.options[0], p.options[1], e.target.value, p.options[3]],
                      }))
                    }
                    placeholder="Option C"
                  />
                </div>
                <div>
                  <label>Option D</label>
                  <input
                    value={questionDraft.options[3]}
                    onChange={(e) =>
                      setQuestionDraft((p) => ({
                        ...p,
                        options: [p.options[0], p.options[1], p.options[2], e.target.value],
                      }))
                    }
                    placeholder="Option D"
                  />
                </div>
              </div>

              <div>
                <label>Correct Answer</label>
                <select
                  value={questionDraft.answerIndex}
                  onChange={(e) => setQuestionDraft((p) => ({ ...p, answerIndex: Number(e.target.value) }))}
                >
                  <option value={0}>A</option>
                  <option value={1}>B</option>
                  <option value={2}>C</option>
                  <option value={3}>D</option>
                </select>
              </div>

              <button className="btnGhost" type="button" onClick={addDraftQuestion}>
                + Add Question
              </button>

              <div className="draftBox">
                <div className="draftHead">
                  <b>Questions Added:</b> {draftQuestions.length}
                </div>
                {draftQuestions.length === 0 ? (
                  <div className="empty">No questions yet.</div>
                ) : (
                  draftQuestions.map((q) => (
                    <div className="draftItem" key={q.id}>
                      <div className="draftText">
                        <b>{q.question}</b>
                        <div className="hint">Correct: {String.fromCharCode(65 + q.answerIndex)}</div>
                      </div>
                      <button className="btnDanger" type="button" onClick={() => setDraftQuestions((prev) => prev.filter((dq) => dq.id !== q.id))}>
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>

              <button className="btnPrimary" type="submit">
                {editingQuiz ? "Update Quiz" : "Create Quiz"}
              </button>
            </form>
          </div>

          <div className="card">
            <h3 className="cardTitle">All Quizzes</h3>
            <div className="adminList">
              {quizzes.length === 0 && <div className="empty">No quizzes created.</div>}
              {quizzes.map((q) => (
                <div className="rowItem" key={q.id}>
                  <div className="rowLeft">
                    <div className="rowTitle">{q.title}</div>
                    <div className="rowMeta">{q.course} • {q.semester} • {q.subject}</div>
                    <div className="rowFile">📝 Questions: {q.questions?.length || 0}</div>
                  </div>
                  <div className="rowRight">
                    <button className="btnGhost" type="button" onClick={() => {
                      setEditingQuiz(q);
                      setQuizForm({ title: q.title, course: q.course, semester: q.semester, subject: q.subject });
                      setDraftQuestions(q.questions || []);
                    }}>
                      Edit
                    </button>
                    <button className="btnDanger" type="button" onClick={() => deleteQuizHandler(q.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}