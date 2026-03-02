import React, { useEffect, useMemo, useState } from "react";
import "./Quiz.css";
import { getQuizzes } from "../lib/api"; // backend call

export default function Quiz() {
  const [loaded, setLoaded] = useState([]);

  // ✅ Fetch quizzes from backend
 useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getQuizzes();
      console.log("Raw quizzes from backend:", data);

      const normalized = (data || []).map((quiz) => {
        const quizId = quiz.id || `quiz-${Math.random()}`;
        const questions = (quiz.questions || []).map((q, idx) => {
          return {
            id: q.id ? `${quizId}_${q.id}` : `${quizId}_q${idx + 1}`,
            question: q.question || "",
            options: q.options || [],       // ✅ use backend array directly
            answerIndex: q.answerIndex      // ✅ match backend key
          };
        });

        return {
          id: quizId,
          title: quiz.title || "Untitled Quiz",
          course: quiz.course || "BCA",
          semester: quiz.semester || "Semester 1",
          subject: quiz.subject || "Subject",
          questions,
        };
      });

      setLoaded(normalized);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      setLoaded([]);
    }
  };

  fetchData();
}, []);
  const [course, setCourse] = useState("All Courses");
  const [semester, setSemester] = useState("All Semesters");
  const [subject, setSubject] = useState("All Subjects");

  // screen state
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // answers: { [questionId]: { selectedIndex, isCorrect } }
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const courses = useMemo(
    () => ["All Courses", ...new Set(loaded.map((q) => q.course))],
    [loaded]
  );
  const semesters = useMemo(
    () => ["All Semesters", ...new Set(loaded.map((q) => q.semester))],
    [loaded]
  );
  const subjects = useMemo(
    () => ["All Subjects", ...new Set(loaded.map((q) => q.subject))],
    [loaded]
  );

  const filtered = loaded.filter((q) => {
    if (course !== "All Courses" && q.course !== course) return false;
    if (semester !== "All Semesters" && q.semester !== semester) return false;
    if (subject !== "All Subjects" && q.subject !== subject) return false;
    return true;
  });

  const startQuiz = (quiz) => {
    if (!quiz?.questions?.length) {
      alert("This quiz has no questions. Add questions in Admin Panel.");
      return;
    }
    
    setActiveQuiz({
      ...quiz,
      questions: quiz.questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,        // ✅ keep options
        answerIndex: q.answerIndex
      }))
    });
    console.log("Active quiz set:", quiz.questions);
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setFinished(false);
  };

  const exitQuiz = () => {
    setActiveQuiz(null);
    setCurrentIndex(0);
    setAnswers({});
    setScore(0);
    setFinished(false);
  };

  const onSelectOption = (q, optIndex) => {
    if (answers[q.id]) return;

    const isCorrect = optIndex === q.answerIndex;

    setAnswers((prev) => ({
      ...prev,
      [q.id]: { selectedIndex: optIndex, isCorrect },
    }));

    if (isCorrect) setScore((s) => s + 1);
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    const lastIndex = activeQuiz.questions.length - 1;

    if (currentIndex >= lastIndex) {
      setFinished(true);

      // save result history
      const finalScore = score;
      const history = JSON.parse(localStorage.getItem("studyhub_quiz_history") || "[]");
      history.unshift({
        quizId: activeQuiz.id,
        title: activeQuiz.title,
        course: activeQuiz.course,
        semester: activeQuiz.semester,
        subject: activeQuiz.subject,
        score: finalScore,
        total: activeQuiz.questions.length,
        at: Date.now(),
      });
      localStorage.setItem("studyhub_quiz_history", JSON.stringify(history));

      return;
    }
    setCurrentIndex((i) => i + 1);
  };

  // ------------------------------
  // QUIZ RUNNER UI
  // ------------------------------
  if (activeQuiz) {
    const total = activeQuiz.questions.length;
    const q = activeQuiz.questions[currentIndex];
    const ans = answers[q.id];
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="page quizPage">
        <div className="quizTopBar">
          <div>
            <h1 className="quizTitle">{activeQuiz.title}</h1>
            <p className="quizMeta">
              {activeQuiz.course} • {activeQuiz.semester} • {activeQuiz.subject}
            </p>
          </div>

          <div className="quizTopRight">
            <div className="scorePill">
              Score: <b>{score}</b>/<b>{total}</b>
            </div>
            <button className="btnGhost" onClick={exitQuiz}>
              Back
            </button>
          </div>
        </div>

        <div className="quizCard card">
  {!finished ? (
    <>
      <div className="progressRow">
        <div className="progressText">
          Question <b>{currentIndex + 1}</b> of <b>{total}</b>
        </div>
        <div className="progressText">
          Answered: <b>{answeredCount}</b>/<b>{total}</b>
        </div>
      </div>

      <div className="progressLine">
        <div
          className="progressFill"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>

      <h2 className="questionText">{q.question}</h2>

      <div className="optionsGrid">
        {q.options.map((opt, idx) => {
          const isCorrectOption = idx === q.answerIndex;
          const isSelected = ans?.selectedIndex === idx;
          const isWrongSelected = isSelected && ans && !ans.isCorrect;

          let cls = "optionBtn";
          if (ans) {
            if (isCorrectOption) cls += " correct";
            if (isWrongSelected) cls += " wrong";
            if (isSelected && ans.isCorrect) cls += " selected";
            cls += " locked";
          } else if (isSelected) {
            cls += " selected";
          }

          return (
            <button
              key={idx}
              className={cls}
              onClick={() => onSelectOption(q, idx)}
              type="button"
            >
              <span className="optLetter">{String.fromCharCode(65 + idx)}.</span>
              <span className="optText">{opt}</span>
            </button>
          );
        })}
      </div>

      {ans && (
        <div className={`feedback ${ans.isCorrect ? "ok" : "bad"}`}>
          {ans.isCorrect ? (
            <>✅ Correct! Good job.</>
          ) : (
            <>
              ❌ Wrong! Correct answer is: <b>{q.options[q.answerIndex]}</b>
            </>
          )}
        </div>
      )}

      <div className="navRow">
        <button
          className="btnDark"
          onClick={nextQuestion}
          disabled={!ans}
          type="button"
        >
          {currentIndex === total - 1 ? "Finish Quiz" : "Next"}
        </button>
      </div>
    </>
  ) : (
    <>
      <h2 className="resultTitle">Quiz Completed 🎉</h2>
      <p className="resultSub">
        Your Score: <b>{score}</b> / <b>{total}</b>
      </p>

      <div className="resultBox">
        <div className="resultBig">{Math.round((score / total) * 100)}%</div>
        <div className="resultText">
          {score === total
            ? "Perfect score! 🔥"
            : score >= Math.ceil(total * 0.7)
            ? "Great work! Keep it up."
            : "Good try! Review and attempt again."}
        </div>
      </div>

      <div className="review">
        <h3>Review Answers</h3>

        <div className="reviewList">
        {activeQuiz.questions.map((qq, i) => {
          const a = answers[qq.id];
          const correct = qq.options?.[qq.answerIndex];
          const chosen = a ? qq.options?.[a.selectedIndex] : "Not answered";
          const ok = a?.isCorrect;

          return (
            <div className="reviewItem" key={qq.id}>
              <div className="reviewQ">
                <b>Q{i + 1}.</b> {qq.question}
              </div>

              <div className="options">
                {qq.options?.map((opt, idx) => (
                  <div key={idx}>
                    {idx + 1}. {opt}
                  </div>
                ))}
              </div>

              <div className={`reviewA ${ok ? "ok" : "bad"}`}>
                <div>
                  Your Answer: <b>{chosen}</b>
                </div>
                {!ok && (
                  <div>
                    Correct Answer: <b>{correct}</b>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </div>

      <div className="resultActions">
        <button className="btnPrimary" onClick={() => startQuiz(activeQuiz)}>
          Restart
        </button>
        <button className="btnGhost" onClick={exitQuiz}>
          Back to Quizzes
        </button>
      </div>
    </>
  )}
</div>
      </div>
    );
  }

  // ------------------------------
  // QUIZ LIST UI
  // ------------------------------
  return (
    <div className="page quizPage">
      <h1 className="h1">Quizzes</h1>

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

      <div className="quizList">
        {filtered.map((q) => (
          <div className="quizListCard card" key={q.id}>
            <div>
              <h3 className="listTitle">{q.title}</h3>
              <p className="listMeta">
                {q.course} • {q.semester} • {q.subject}
              </p>
              <small className="listSmall">{q.questions.length} Questions</small>
            </div>

            <button className="startBtn" onClick={() => startQuiz(q)}>
              Start Quiz
            </button>
          </div>
        ))}

        {filtered.length === 0 && <div className="card">No quizzes found.</div>}
      </div>
    </div>
  );
}
