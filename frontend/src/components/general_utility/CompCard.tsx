import React, { FC } from "react";
import { FaEllipsisV } from "react-icons/fa";
import "./CompCard.css";
import { useNavigate } from "react-router-dom";

interface CardProps {
  compName: string;
  location: string;
  compDate: string;
  compRole: string;
  compCountdown: number;
  compId: string;
};

export const CompCard: FC<CardProps> = ({ compName, location, compDate, compRole, compCountdown, compId }) => {
  const navigate = useNavigate();
  const roleUrl = (role: string) => {
    switch (role) {
      case 'Participant':
        return `/competition/${compId}/participant`;
      case 'Coach':
        return `/competition/${compId}/coach`;
      case 'Site-Coordinator':
        return `/competition/${compId}/site-coordinator`;
      case 'Admin':
        return `/competition/${compId}/admin`;
      default:
        return `/competition/${compId}/participant`;
    }
  };

  return (
    <div className="comp-card" onClick={() => navigate(roleUrl(compRole))}>
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