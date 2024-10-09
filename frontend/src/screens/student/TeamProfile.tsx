import { FC  } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { DashboardSidebar } from "../../components/general_utility/DashboardSidebar";
import styled from "styled-components";


const Background = styled(FlexBackground)`
  background-color: ${({ theme }) => theme.background};
`;

export const TeamProfile: FC = () => {
  const name = "Name";
  const affiliation = "UNSW";


  return (
  <Background>
    <DashboardSidebar name={name} affiliation={affiliation} cropState={false}/>
    <h2>Team profile Page</h2>
    <div> 
    
    </div>
  </Background>
  );
}