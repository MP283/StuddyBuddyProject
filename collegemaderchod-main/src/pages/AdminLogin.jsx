import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";
import { adminLogin } from "../lib/api"; // <-- add this helper in api.js

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin(form); // call backend
      // Save admin info + token
      localStorage.setItem(
        "studyhub_admin",
        JSON.stringify({ email: form.email, role: "admin" })
      );
      localStorage.setItem("token", res.token);
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Invalid admin email or password ❌");
    }
  };

  return (
    <div className="adminLoginWrap">
      <div className="adminLoginCard card">
        <h1 className="adminTitle">Admin Login</h1>
        <p className="adminSub">
          Only authorized admin can access the Admin Panel.
        </p>

        <form className="adminForm" onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
              placeholder="Enter password"
              required
            />
          </div>

          <button className="adminBtn" type="submit">
            Login
          </button>

          <div className="adminHint">
            Demo Login: <br />
            Email: <b>admin</b> <br />
            Password: <b>admin123</b>
          </div>
        </form>
      </div>
    </div>
  );
}