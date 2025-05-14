import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const ContentButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SC_Button>
      <button onClick={() => navigate("/form")}>Create Your Blog</button>
    </SC_Button>
  );
};

const SC_Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 150px 20px;

  button {
    padding: 12px 30px;
    font-size: 18px;
    background: transparent;
    color: white;
    border: 2px solid white;
    border-radius: 30px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
      background-color: white;
      color: #482be7;
    }
  }
`;

export default ContentButton;
