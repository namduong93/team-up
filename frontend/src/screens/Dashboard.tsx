import { FC } from "react";
import { FlexBackground } from "../components/general_utility/Background";
import { FaBell, FaFilter } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import { DashboardSidebar } from "../components/general_utility/DashboardSidebar";
import { CompCard } from "../components/general_utility/CompCard";


interface Competition {
  compName: string;
  location: string;
  compDate: string;
  compRole: string;
  compCountdown: number;
};
interface DashboardsProps {
  name: string;
  affiliation: string;
  competitions: Competition[];
};

export const Dashboard: FC<DashboardsProps> = ({ name, affiliation, competitions }) => {
  // const navigate = useNavigate();
  return (
  <FlexBackground>
      <DashboardSidebar name={name} affiliation={affiliation} />
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div className="welcome-message">
            <h1>Dashboard</h1>
            <div id="welcome-message">Welcome back, {name}!</div>
          </div>

          <div className="action-buttons">
            <div className="register-alert">
              <button className="register-button">Register</button>
              <button className="alert-button"> <FaBell /> </button>
            </div>
            <div className="filter-search">
              <button className="filter-button"><FaFilter /> Filter</button>
              <input type="text" placeholder="Search" className="search-input" />
            </div>
          </div>
        </div>

        <div className="content-area">
        <div className="competition-grid">
          {competitions.map((comp, index) => (
            <CompCard
              key={index}
              compName={comp.compName}
              location={comp.location}
              compDate={comp.compDate}
              compRole={comp.compRole}
              compCountdown={comp.compCountdown}
            />
          ))}
        </div>
      </div>
      </div>

  </FlexBackground>
  );
};
