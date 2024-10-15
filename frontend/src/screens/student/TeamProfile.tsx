import { FC  } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { DashboardSidebar } from "../../components/general_utility/DashboardSidebar";
import styled from "styled-components";


const Background = styled(FlexBackground)`
  background-color: ${({ theme }) => theme.background};
`;

export const TeamProfile: FC = () => {
  return (
  <Background>
    <DashboardSidebar cropState={false}/>
    <h2>Team profile Page</h2>
    <div> 
    
    </div>
  </Background>
  );
}