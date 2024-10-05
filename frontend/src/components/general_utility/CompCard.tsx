import React, { FC } from "react";
import { FaEllipsisV } from "react-icons/fa";
import "./CompCard.css";

interface CardProps {
  compName: string;
  location: string;
  compDate: string;
  compRole: string;
  compCountdown: number;
};

export const CompCard: FC<CardProps> = ({ compName, location, compDate, compRole, compCountdown }) => {
  return (
    <div className="comp-card">
      <div className="card-header">
        <div className="card-top">
          <h2>{compName}</h2>
          <button id="menu-dots"><FaEllipsisV /></button>
        </div>
        <div className="card-middle">
          <div className="card-text">{location}</div>
          <div className="card-text">{compDate}</div>
        </div>
      </div>

      <div className="card-bottom">
        <div className="role">{compRole}</div>
        <div id="card-countdown"> {compCountdown} days to go!</div>
      </div>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${(compCountdown / 30) * 100}%` }}/>
      </div>

    </div>
  );
};