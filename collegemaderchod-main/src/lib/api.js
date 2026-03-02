// api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // Flask backend URL
});

// Attach JWT token automatically if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ===================== AUTH =====================

// Signup (Register new user)
export const signup = async (userData) => {
  const res = await API.post("/auth/signup", userData);
  localStorage.setItem("token", res.data.token); // save JWT
  return res.data;
};

// Login (Authenticate existing user)
export const login = async (credentials) => {
  const res = await API.post("/auth/login", credentials);
  localStorage.setItem("token", res.data.token);
  return res.data;
};

// Get current user (requires token)
export const getCurrentUser = async () => {
  const res = await API.get("/auth/me");
  return res.data;
};

// Submit feedback (student must be logged in)
export const submitFeedback = async (feedbackData) => {
  const res = await API.post("/student/feedback", feedbackData);
  return res.data;
};

// ===================== ADMIN =====================

// Add a new paper (requires admin token)
export const addPaper = async (formData) => {
  const res = await API.post("/admin/papers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete a paper
export const deletePaper = async (paperId) => {
  const res = await API.delete(`/admin/papers/${paperId}`);
  return res.data;
};

export const addNote = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await API.post("/admin/notes", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

// Delete a note
export const deleteNote = async (noteId) => {
  const res = await API.delete(`/admin/notes/${noteId}`);
  return res.data;
};

// Create a quiz (requires admin token)
export const createQuiz = async (quizData) => {
  const token = localStorage.getItem("token");
  const res = await API.post("/admin/quizzes", quizData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


// Delete a quiz
export const deleteQuiz = async (id) => {
  const token = localStorage.getItem("token");
  const res = await API.delete(`/admin/quizzes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};


// Public getters
export const getPapers = async () => {
  const res = await API.get("/admin/papers");
  return res.data;
};



export const adminLogin = async (credentials) => {
  const res = await API.post("/admin/login", credentials);
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("studyhub_admin", JSON.stringify({ email: credentials.email }));
  return res.data;
};

export const getNotes = async () => {
  const res = await API.get("/admin/notes");
  return res.data;
};

export const getQuizzes = async () => {
  const res = await API.get("/admin/quizzes");
  return res.data;
};


export default API;