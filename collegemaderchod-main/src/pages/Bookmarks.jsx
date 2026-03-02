import React, { useEffect, useState } from "react";
import "./Bookmarks.css";

function getBookmarks() {
  return JSON.parse(localStorage.getItem("studyhub_bookmarks") || "[]");
}
function setBookmarks(bm) {
  localStorage.setItem("studyhub_bookmarks", JSON.stringify(bm));
}

export default function Bookmarks() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(getBookmarks());
  }, []);

  const removeItem = (idx) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    setBookmarks(next);
  };

  return (
    <div className="page">
      <h1 className="h1">Your Bookmarks</h1>

      <div className="bmList">
        {items.map((b, i) => (
          <div className="bmCard card" key={i}>
            <div className="bmLeft">
              <h3>{b.title}</h3>
              <p>
                {b.semester} • {b.subject}
              </p>
              <small className="bmType">{b.type}</small>
            </div>

            <button className="removeBtn" onClick={() => removeItem(i)}>
              Remove
            </button>
          </div>
        ))}

        {items.length === 0 && <div className="card">No bookmarks yet.</div>}
      </div>
    </div>
  );
}