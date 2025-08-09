import React, { useState } from "react";
import "./Login.css";

const Login = () => {
  const [loginType, setLoginType] = useState("student");
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("regNo", regNo);

    if (loginType === "student") {
      window.location.href = "/student";
    } else {
      window.location.href = "/admin";
    }
  };

  return (
    <section id="loginPage">
      <div id="loginBox">
        <div id="loginTypeSelection">
          <button
            className={`loginTypeButton ${
              loginType === "student" ? "selected" : ""
            }`}
            onClick={() => setLoginType("student")}
          >
            Student
          </button>
          <button
            className={`loginTypeButton ${
              loginType === "admin" ? "selected" : ""
            }`}
            onClick={() => setLoginType("admin")}
          >
            Admin
          </button>
        </div>

        <form id="loginForm" onSubmit={handleSubmit}>
          <input
            type="number"
            placeholder={
              loginType === "student" ? "Register Number" : "Admin Number"
            }
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" id="loginButton">
            Login
          </button>
        </form>

        <a href="#" id="forgotPassword">
          Forgot Password?
        </a>
      </div>
    </section>
  );
};

export default Login;
