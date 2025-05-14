import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../AxiosInstance";

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/register", {
        email,
        password,
      });

      if (response.status === 200) {
        alert("Account created successfully!");
        navigate("/form");
      }
    } catch (error: any) {
      console.error("Signup Error:", error);
      if (error.response?.status === 400) {
        alert("User already exists.");
      } else {
        alert("Something went wrong. Try again.");
      }
    }
  };

  return (
    <SC_SignUp>
      <form className="containerForm" onSubmit={handleSignUp}>
        <div className="auth">
          <h2>Create an Account</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button className="submitBtn" type="submit">
            Sign Up
          </button>
          <button
            className="linkBtn"
            type="button"
            onClick={() => navigate("/form")}
          >
            Already have an account? <span>Sign In Here!</span>
          </button>
        </div>
      </form>
    </SC_SignUp>
  );
};

const SC_SignUp = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  .containerForm {
    width: 320px;
    padding: 30px;
    border-radius: 15px;
    backdrop-filter: blur(15px);
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  }

  .auth {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;

    h2 {
      color: white;
      margin-bottom: 10px;
    }

    input {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      background: rgba(255, 255, 255, 0.9);
      outline: none;
      transition: 0.3s ease;

      &:focus {
        box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.5);
      }
    }

    .submitBtn {
      width: 100%;
      padding: 12px;
      background-color: #5c6bc0;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background-color: #3f51b5;
      }
    }

    .linkBtn {
      background: none;
      border: none;
      color: white;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: underline;
      transition: color 0.3s ease;

      span {
        font-weight: bold;
        color: #90caf9;
      }

      &:hover span {
        color: #64b5f6;
      }
    }
  }
`;

export default SignUp;
