import React, { FC, useState } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import styled from "styled-components";
// import { TeamCard } from "./TeamCard";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CustomToggleSwitch } from "../../../components/general_utility/ToggleSwitch";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { SortSelect } from "../../../components/general_utility/SortSelect";
import { SortButton } from "../../Dashboard";
import { FaSort } from "react-icons/fa";
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

export const SortFilterSearchContainerDiv = styled.div`
  margin-right: min(20px, 2%);
  flex: 1;
  max-width: 360px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
`;

export const SortContainer = styled.div`
  width: 19%;
  height: 33px;
  position: relative;

`;

interface ResponsiveSortButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isSortOpen: boolean;
}

export const SortButtonResponsive: FC<ResponsiveSortButtonProps> = ({ onClick, style, isSortOpen, ...props }) => {
  return (
    <SortButton onClick={onClick} style={{
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      padding: '0',
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      alignItems: 'center',
      alignContent: 'center',
      minWidth: '29px',
      ...style
    }} isSortOpen={isSortOpen} {...props}>
      <div style={{ display: 'flex', alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%', justifyContent: 'center' }}>
        <div style={{ height: '200%' }}>
          <FaSort style={{ height: '50%', flex: '0 0 auto' }} />
        </div>
        <span>Sort</span>
      </div>
    </SortButton>
  )
}

const pathMap: Record<string, number> = {
  '/coach/page/teams': 0,
  '/coach/page/students': 1,
}

export const CoachPage: FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>(null);
  console.log(sortOption);
  const sortOptions = [
    { label: "Default", value: "original" },
    { label: "Alphabetical (Name)", value: "name" },
    { label: "Competition Date", value: "date" },
    { label: "Alphabetical (Location)", value: "location" },
    { label: "Time Remaining", value: "timeRemaining" },
  ];

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
    <DashboardSidebar name={"Name"} affiliation={"UNSW"} cropState={false} />

      <MainPageDiv>

        {/* Page header */}
        <PageHeaderContainerDiv style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-around' }}>
            <PageHeader>Coach Page</PageHeader>
            <PageDescriptionSpan>Manage Teams and Students for your Competition</PageDescriptionSpan>
          </div>
          <SortFilterSearchContainerDiv>
            <SortContainer>
              <SortButtonResponsive isSortOpen={isSortOpen} onClick={() => setIsSortOpen((prev) => !prev)} />
              {isSortOpen && 
                <SortSelect isOpen={isSortOpen} onSortChange={(sortOption) => setSortOption(sortOption)}
                options={sortOptions} />}
              </SortContainer>
          </SortFilterSearchContainerDiv>
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