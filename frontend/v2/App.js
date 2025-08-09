import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login/Login";
import AdminHome from "./components/AdminHome/AdminHome";
import StudentForm from "./components/StudentForm/StudentForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/student" element={<StudentForm />} />
      </Routes>
    </Router>
  );
}

export default App;
