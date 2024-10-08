import React, { FC } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import styled from "styled-components";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TeamCard } from "./TeamCard";
import { CustomToggleSwitch } from "../../../components/general_utility/ToggleSwitch";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "../../../components/general_utility/DashboardSidebar";


const OverflowFlexBackground = styled(FlexBackground)`
  overflow: auto;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// const SideBarDiv = styled.div`
//   background-color: #D9D9D9;
//   width: 78px;
//   min-width: 68px;
//   height: 94.92%;
//   border-radius: 20px;
//   margin: auto 1rem auto 1rem;
// `;

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

const pathMap: Record<string, number> = {
  '/coach/page/teams': 0,
  '/coach/page/students': 1,
}

export const CoachPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleToggleTeams = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/coach/page/teams');
  }
  const handleToggleStudents = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/coach/page/students');
  }
  return (
  <OverflowFlexBackground>
    {/* Sidebar */}
    <DashboardSidebar name={"Name"} affiliation={"UNSW"} cropState={true} />

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
          <CustomToggleSwitch defaultBorderIndex={pathMap[pathname] ?? 0} style={{ height: '100%', width: '100%', maxWidth: '300px' }}>
            
            <ToggleOptionDiv onClick={handleToggleTeams}>
              <ToggleOptionTextSpan>Teams</ToggleOptionTextSpan>
            </ToggleOptionDiv>
            
            <ToggleOptionDiv onClick={handleToggleStudents}>
              <ToggleOptionTextSpan>Students</ToggleOptionTextSpan>
            </ToggleOptionDiv>
          </CustomToggleSwitch>
        </PageOptionsContainerDiv>

        {/* Display of Teams/Students */}
        <Outlet />
        
      </MainPageDiv>
  </OverflowFlexBackground>
  );
}