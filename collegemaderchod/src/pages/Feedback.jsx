import React, { useState } from "react";
import "./Feedback.css";
import { submitFeedback } from "../lib/api";   // ✅ correct import

export default function Feedback() {
  const [text, setText] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return alert("Write feedback first!");

    try {
      const res = await submitFeedback({ text });   // ✅ token auto-attached
      alert(res.message);
      setText("");
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Failed to submit feedback — are you logged in?");
    }
  };

  return (
    <div className="page">
      <div className="fbWrap card">
        <h1 className="fbTitle">Give Your Feedback</h1>
        <div className="stars">★★★★★</div>

        <form onSubmit={submit}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your feedback here..."
            rows={7}
          />
          <button className="fbBtn" type="submit">
            Submit Feedback
          </button>
        </form>
      </div>
    </div>
  );
}