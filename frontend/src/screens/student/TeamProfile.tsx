import { FC  } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
// import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "../../components/general_utility/DashboardSidebar";

export const TeamProfile: FC = () => {
  // const navigate = useNavigate();
  const name = "Name";
  const affiliation = "UNSW";


  return (
  <FlexBackground>
    <DashboardSidebar name={name} affiliation={affiliation} />
    <h2>Team profile Page</h2>
    <div> 
    
    </div>
  </FlexBackground>
  );
}