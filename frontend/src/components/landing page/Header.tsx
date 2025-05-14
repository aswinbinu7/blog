import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <SC_Header>
      <div className="menu">
        <ul>
          <li>
            <button onClick={() => navigate("/form")}>Sign In</button>
          </li>
          <li>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </li>
        </ul>
      </div>
    </SC_Header>
  );
};

const SC_Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0px;

  .menu {
    display: flex;
    margin-top: 65px;
    width: 100%;

    ul {
      list-style: none;
      width: 95%;
      display: flex;
      justify-content: flex-end;
      gap: 1em;
      padding: 0;
      margin: 0;

      li {
        button {
          background-color: transparent;
          border: 2px solid white;
          color: white;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            background-color: white;
            color: #333;
            transform: scale(1.05);
          }
        }
      }
    }
  }
`;

export default Header;
