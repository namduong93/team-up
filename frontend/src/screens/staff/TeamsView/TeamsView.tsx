import { FC } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import styled from "styled-components";
import { TeamCard } from "./TeamCard";
import { CustomToggleSwitch } from "../../../components/general_utility/ToggleSwitch";


const OverflowFlexBackground = styled(FlexBackground)`
  overflow: auto;
  font-family: Arial, Helvetica, sans-serif;
`;

const SideBarDiv = styled.div`
  background-color: #D9D9D9;
  width: 78px;
  min-width: 68px;
  height: 94.92%;
  border-radius: 20px;
  margin: auto 1rem auto 1rem;
`;

const MainPageDiv = styled.div`
  flex: 0 1 auto;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 600px;
  flex-direction: column;
`;

const PageHeaderContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  min-height: 117px;
  width: 100%;
`;

const PageHeader = styled.h1`
  margin-bottom: 0;
  font-size: 2em;
`;

const PageDescriptionSpan = styled.span`
  color: #525252;
  font-size: 1em;
`;

const PageOptionsContainerDiv = styled.div`
  min-height: 78px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #D9D9D9;
  z-index: 0;
`;

const ToggleOptionDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ToggleOptionTextSpan = styled.div`
  font-size: 2em;
`;

const TeamCardGridDisplay = styled.div`
  flex: 1;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(294px, 100%), 1fr));
  margin-top: 32px;
  row-gap: 20px;
`;

export const TeamsView: FC = () => {

  return (
    
  <OverflowFlexBackground>
    {/* Sidebar */}
    <SideBarDiv />

      <MainPageDiv>

        {/* Page header */}
        <PageHeaderContainerDiv>
            <PageHeader>Coach Page</PageHeader>
            <PageDescriptionSpan>Manage Teams and Students for your Competition</PageDescriptionSpan>
        </PageHeaderContainerDiv>

        {/* Teams-Students page selection */}
        <PageOptionsContainerDiv>

          {/* Dimensions setting is probably fine like this because the way the toggleSwitch is setup
              Dimension setting is all you need to do for it to work.
          */}
          <CustomToggleSwitch style={{ height: '100%', width: '100%', maxWidth: '300px' }}>
            
            <ToggleOptionDiv>
              <ToggleOptionTextSpan>Teams</ToggleOptionTextSpan>
            </ToggleOptionDiv>
            
            <ToggleOptionDiv>
              <ToggleOptionTextSpan>Students</ToggleOptionTextSpan>
            </ToggleOptionDiv>
          </CustomToggleSwitch>
        </PageOptionsContainerDiv>

        {/* Display of Teams/Students */}
        <TeamCardGridDisplay>
          {Array(50).fill(0).map((_, index) => (<TeamCard key={index} teamDetails={{
            teamName: 'Team Name',
            status: (index % 3) === 0 ? 'unregistered' : (index % 3) === 1 ? 'registered' : 'pending',
            memberName1: 'Team Member 1',
            memberName2: 'Team Member 2',
            memberName3: 'Team Member 3'
          }} />))}
          
        </TeamCardGridDisplay>
      </MainPageDiv>
  </OverflowFlexBackground>
  );
}