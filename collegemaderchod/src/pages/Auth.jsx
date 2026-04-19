import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.css";
import { signup, login } from "../lib/api"; // import API functions

const COURSES = ["BCA", "BBA", "BCOM", "BA", "BSC"];
const SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6"
];

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // login | signup

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    semester: "Semester 1"
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    course: "BCA",
    semester: "Semester 1"
  });

  // ===================== LOGIN =====================
  const onLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login({
        email: loginForm.email,
        password: loginForm.password
      });
      // Save user in localStorage for quick access
      localStorage.setItem(
        "studyhub_user",
        JSON.stringify({ ...data.user, semester: loginForm.semester })
      );
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Login failed");
    }
  };

  // ===================== SIGNUP =====================
  const onSignup = async (e) => {
    e.preventDefault();
    try {
      const data = await signup({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        course: signupForm.course,
        semester: signupForm.semester
      });
      localStorage.setItem("studyhub_user", JSON.stringify(data.user));
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="authShell">
      {/* LEFT PANEL */}
      <div className="authLeft">
        <div className="authLeftIcon" />
        <h1 className="authBrand">StudyHub</h1>
        <p className="authLeftDesc">
          Access previous year papers, study notes, and test your knowledge with interactive quizzes.
        </p>

        <div className="authFeatureList">
          <div className="authFeature">
            <div className="authFeatureIcon">📄</div>
            <div className="authFeatureText">Previous Year Question Papers</div>
          </div>
          <div className="authFeature">
            <div className="authFeatureIcon">📝</div>
            <div className="authFeatureText">Semester-wise Study Notes</div>
          </div>
          <div className="authFeature">
            <div className="authFeatureIcon">🧠</div>
            <div className="authFeatureText">Subject-wise Quizzes</div>
          </div>
          <div className="authFeature">
            <div className="authFeatureIcon">🔖</div>
            <div className="authFeatureText">Bookmark Your Favorites</div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="authRight">
        <div className="authCard">
          <h1 className="authTitle">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="authSubtitle">
            {mode === "login"
              ? "Sign in to access your study materials"
              : "Join StudyHub and start learning"}
          </p>

          {/* toggle pill */}
          <div className="authTabs">
            <button
              className={`authTabBtn ${mode === "login" ? "active" : ""}`}
              onClick={() => setMode("login")}
              type="button"
            >
              Sign In
            </button>
            <button
              className={`authTabBtn ${mode === "signup" ? "active" : ""}`}
              onClick={() => setMode("signup")}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={onLogin} className="authForm">
              <div className="authGroup">
                <label>Email Address</label>
                <input
                  className="authInput"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="authGroup">
                <label>Password</label>
                <input
                  className="authInput"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="authGroup">
                <label>Semester</label>
                <select
                  className="authSelect"
                  value={loginForm.semester}
                  onChange={(e) =>
                    setLoginForm((p) => ({ ...p, semester: e.target.value }))
                  }
                >
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <button className="authBtnPrimary" type="submit">
                Sign In
              </button>

              <p className="authBottomText">
                Don&apos;t have an account?{" "}
                <button
                  className="authLink"
                  type="button"
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={onSignup} className="authForm">
              <div className="authGroup">
                <label>Full Name</label>
                <input
                  className="authInput"
                  value={signupForm.name}
                  onChange={(e) =>
                    setSignupForm((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="authGroup">
                <label>Email Address</label>
                <input
                  className="authInput"
                  value={signupForm.email}
                  onChange={(e) =>
                    setSignupForm((p) => ({ ...p, email: e.target.value }))
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="authGroup">
                <label>Password</label>
                <input
                  className="authInput"
                  type="password"
                  value={signupForm.password}
                  onChange={(e) =>
                    setSignupForm((p) => ({ ...p, password: e.target.value }))
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="authTwoCol">
                <div className="authGroup">
                  <label>Course</label>
                  <select
                    className="authSelect"
                    value={signupForm.course}
                    onChange={(e) =>
                      setSignupForm((p) => ({ ...p, course: e.target.value }))
                    }
                  >
                    {COURSES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="authGroup">
                  <label>Semester</label>
                  <select
                    className="authSelect"
                    value={signupForm.semester}
                    onChange={(e) =>
                      setSignupForm((p) => ({ ...p, semester: e.target.value }))
                    }
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button className="authBtnPrimary" type="submit">
                Create Account
              </button>

              <p className="authBottomText">
                Already have an account?{" "}
                <button
                  className="authLink"
                  type="button"
                  onClick={() => setMode("login")}
                >
                  Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Auth.css";

// const COURSES = ["BCA", "BBA", "BCOM", "BA", "BSC"];
// const SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6"];

// function readUsers() {
//   return JSON.parse(localStorage.getItem("studyhub_users") || "[]");
// }
// function writeUsers(users) {
//   localStorage.setItem("studyhub_users", JSON.stringify(users));
// }

// export default function Auth() {
//   const navigate = useNavigate();
//   const [mode, setMode] = useState("login"); // login | signup

//   const [loginForm, setLoginForm] = useState({
//     email: "",
//     password: "",
//     semester: "Semester 1",
//   });

//   const [signupForm, setSignupForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     course: "BCA",
//     semester: "Semester 1",
//   });

//   const users = useMemo(() => readUsers(), []);

//   const onLogin = (e) => {
//     e.preventDefault();
//     const all = readUsers();
//     const found = all.find(
//       (u) =>
//         u.email.toLowerCase() === loginForm.email.toLowerCase() &&
//         u.password === loginForm.password
//     );
//     if (!found) {
//       alert("Invalid email or password");
//       return;
//     }

//     const user = { ...found, semester: loginForm.semester };
//     localStorage.setItem("studyhub_user", JSON.stringify(user));
//     navigate("/");
//   };

//   const onSignup = (e) => {
//     e.preventDefault();
//     const all = readUsers();
//     const exists = all.some((u) => u.email.toLowerCase() === signupForm.email.toLowerCase());
//     if (exists) {
//       alert("Email already registered. Please login.");
//       setMode("login");
//       return;
//     }

//     const newUser = {
//       id: Date.now(),
//       name: signupForm.name.trim(),
//       email: signupForm.email.trim(),
//       password: signupForm.password,
//       course: signupForm.course,
//       semester: signupForm.semester,
//       role: "student",
//     };

//     const updated = [newUser, ...all];
//     writeUsers(updated);

//     localStorage.setItem("studyhub_user", JSON.stringify(newUser));
//     navigate("/");
//   };

//   return (
//     <div className="authShell">
//       {/* LEFT PANEL (like screenshot) */}
//       <div className="authLeft">
//         <div className="authLeftIcon" />

//         <h1 className="authBrand">StudyHub</h1>
//         <p className="authLeftDesc">
//           Access previous year papers, study notes, and test your knowledge with interactive quizzes.
//         </p>

//         <div className="authFeatureList">
//           <div className="authFeature">
//             <div className="authFeatureIcon">📄</div>
//             <div className="authFeatureText">Previous Year Question Papers</div>
//           </div>

//           <div className="authFeature">
//             <div className="authFeatureIcon">📝</div>
//             <div className="authFeatureText">Semester-wise Study Notes</div>
//           </div>

//           <div className="authFeature">
//             <div className="authFeatureIcon">🧠</div>
//             <div className="authFeatureText">Subject-wise Quizzes</div>
//           </div>

//           <div className="authFeature">
//             <div className="authFeatureIcon">🔖</div>
//             <div className="authFeatureText">Bookmark Your Favorites</div>
//           </div>
//         </div>
//       </div>

//       {/* RIGHT PANEL */}
//       <div className="authRight">
//         <div className="authCard">
//           <h1 className="authTitle">{mode === "login" ? "Welcome Back" : "Create Account"}</h1>
//           <p className="authSubtitle">
//             {mode === "login" ? "Sign in to access your study materials" : "Join StudyHub and start learning"}
//           </p>

//           {/* toggle pill */}
//           <div className="authTabs">
//             <button
//               className={`authTabBtn ${mode === "login" ? "active" : ""}`}
//               onClick={() => setMode("login")}
//               type="button"
//             >
//               Sign In
//             </button>
//             <button
//               className={`authTabBtn ${mode === "signup" ? "active" : ""}`}
//               onClick={() => setMode("signup")}
//               type="button"
//             >
//               Sign Up
//             </button>
//           </div>

//           {mode === "login" ? (
//             <form onSubmit={onLogin} className="authForm">
//               <div className="authGroup">
//                 <label>Email Address</label>
//                 <input
//                   className="authInput"
//                   value={loginForm.email}
//                   onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>

//               <div className="authGroup">
//                 <label>Password</label>
//                 <input
//                   className="authInput"
//                   type="password"
//                   value={loginForm.password}
//                   onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
//                   placeholder="Enter your password"
//                   required
//                 />
//               </div>

//               <div className="authGroup">
//                 <label>Semester</label>
//                 <select
//                   className="authSelect"
//                   value={loginForm.semester}
//                   onChange={(e) => setLoginForm((p) => ({ ...p, semester: e.target.value }))}
//                 >
//                   {SEMESTERS.map((s) => (
//                     <option key={s} value={s}>
//                       {s}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <button className="authBtnPrimary" type="submit">
//                 Sign In
//               </button>

//               <p className="authBottomText">
//                 Don&apos;t have an account?{" "}
//                 <button className="authLink" type="button" onClick={() => setMode("signup")}>
//                   Sign Up
//                 </button>
//               </p>

//               {users.length === 0 && (
//                 <p className="authBottomText" style={{ marginTop: 10 }}>
//                   No users saved yet. Create one using <b>Sign Up</b>.
//                 </p>
//               )}
//             </form>
//           ) : (
//             <form onSubmit={onSignup} className="authForm">
//               <div className="authGroup">
//                 <label>Full Name</label>
//                 <input
//                   className="authInput"
//                   value={signupForm.name}
//                   onChange={(e) => setSignupForm((p) => ({ ...p, name: e.target.value }))}
//                   placeholder="Enter your full name"
//                   required
//                 />
//               </div>

//               <div className="authGroup">
//                 <label>Email Address</label>
//                 <input
//                   className="authInput"
//                   value={signupForm.email}
//                   onChange={(e) => setSignupForm((p) => ({ ...p, email: e.target.value }))}
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>

//               <div className="authGroup">
//                 <label>Password</label>
//                 <input
//                   className="authInput"
//                   type="password"
//                   value={signupForm.password}
//                   onChange={(e) => setSignupForm((p) => ({ ...p, password: e.target.value }))}
//                   placeholder="Enter your password"
//                   required
//                 />
//               </div>

//               <div className="authTwoCol">
//                 <div className="authGroup">
//                   <label>Course</label>
//                   <select
//                     className="authSelect"
//                     value={signupForm.course}
//                     onChange={(e) => setSignupForm((p) => ({ ...p, course: e.target.value }))}
//                   >
//                     {COURSES.map((c) => (
//                       <option key={c} value={c}>
//                         {c}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="authGroup">
//                   <label>Semester</label>
//                   <select
//                     className="authSelect"
//                     value={signupForm.semester}
//                     onChange={(e) => setSignupForm((p) => ({ ...p, semester: e.target.value }))}
//                   >
//                     {SEMESTERS.map((s) => (
//                       <option key={s} value={s}>
//                         {s}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <button className="authBtnPrimary" type="submit">
//                 Create Account
//               </button>

//               <p className="authBottomText">
//                 Already have an account?{" "}
//                 <button className="authLink" type="button" onClick={() => setMode("login")}>
//                   Sign In
//                 </button>
//               </p>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }