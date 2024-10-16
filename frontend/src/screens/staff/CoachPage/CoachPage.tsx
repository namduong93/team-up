import React, { FC, ReactNode, useState } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import styled from "styled-components";
// import { TeamCard } from "./TeamCard";
 
import { CustomToggleSwitch } from "../../../components/general_utility/ToggleSwitch";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { AlertButton, SortButton } from "../../Dashboard/Dashboard";
import { FaBell, FaSearch } from "react-icons/fa";
import { PageHeader } from "../../../components/sort_filter_search/PageHeader";
import { TEAM_DISPLAY_FILTER_OPTIONS, TEAM_DISPLAY_SORT_OPTIONS } from "./TeamDisplay";

export const OverflowFlexBackground = styled(FlexBackground)`
  overflow: auto;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

 
// const SideBarDiv = styled.div`
//   background-color: #D9D9D9;
//   width: 78px;
//   min-width: 68px;
//   height: 94.92%;
//   border-radius: 20px;
//   margin: auto 1rem auto 1rem;
// `;

export const MainPageDiv = styled.div`
  flex: 0 1 auto;
  display: flex;
  width: 100%;
  height: 100%;
  min-height: 600px;
  flex-direction: column;
`;

export const PageOptionsContainerDiv = styled.div`
  min-height: 78px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #D9D9D9;
  z-index: 0;
`;

export const ToggleOptionDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ToggleOptionTextSpan = styled.div`
  font-size: 2em;
`;

export const MenuOptionsContainerDiv = styled.div`
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
  min-width: 29px;
`;

interface ResponsiveSortButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  icon: ReactNode;
  label: string;
}

export const SortFilterSearchContainerDiv = styled.div`
  width: 100%;
  /* min-width: 152px; */
  height: 66px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  min-width: 58px;
`;

export const ResponsiveButton: FC<ResponsiveSortButtonProps> = ({ onClick, icon, label, style, isOpen, ...props }) => {
  return (
    <SortButton onClick={onClick} style={{
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      padding: '0',
      display: 'flex',
      flexWrap: 'wrap',
      ...style
    }} $isSortOpen={isOpen} {...props}>
      <div style={{ display: 'flex', alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%', justifyContent: 'center' }}>
        <div style={{ height: '200%' }}>
          {icon}
        </div>
        <span>{label}</span>
      </div>
    </SortButton>
  )
}

const pathMap: Record<string, number> = {
  '/coach/page/teams': 0,
  '/coach/page/students': 1,
}

const SearchInput = styled.input`
  height: 100%;
  width: 100%;
  min-width: 29px;
  border: 1px solid ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  padding: 0;
  grid-row: 1 / 2;
  grid-column: 1 / 3;
  box-sizing: border-box;
  padding-left: 5px;
  &:focus + div {
    display: none;
  }
`;

const SearchIcon = styled(FaSearch)`
  min-width: 29px;
  pointer-events: none;
`;

const SearchContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  flex-wrap: wrap;
`;

const SearchCell = styled.div`
  min-width: 29px;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  flex-wrap: wrap;
  pointer-events: none;
  overflow: hidden;
  left: 0;
  z-index: 1;
  color: ${({ theme }) => theme.colours.filterText};
`;

export const SearchBar: FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ value, onChange, ...props }) => {
  return (
  <SearchContainer>
    <SearchInput type="text" value={value} onChange={onChange} {...props} />
    {!value && <SearchCell>
      <div style={{ display: 'flex', alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%', justifyContent: 'center' }}>
        <div style={{ height: '200%' }}>
          <SearchIcon />
        </div>
          <span>Search</span>
      </div>
    </SearchCell>}
  </SearchContainer>
  )
}

export const CoachPage: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const { pathname } = useLocation();

  const [sortOption, setSortOption] = useState<string | null>(null);
  const sortOptions = TEAM_DISPLAY_SORT_OPTIONS;

  const [filters, setFilters] = useState<{ [field: string]: string[] }>({});

  const [searchTerm, setSearchTerm] = useState<string>('');

  const filterOptions = TEAM_DISPLAY_FILTER_OPTIONS;

  const handleToggleTeams = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/coach/page/teams/${compId}`);
  }
  const handleToggleStudents = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/coach/page/students/${compId}`);
  }

  const removeFilter = (field: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[field] = updatedFilters[field].filter((v) => v !== value);
      if (updatedFilters[field].length === 0) {
        delete updatedFilters[field];
      }
      return updatedFilters; // trigger render to update filter dropdown
    });
  };
  return (
  <OverflowFlexBackground>
    {/* Sidebar */}

      <MainPageDiv>

        {/* Page header */}
        <PageHeader 
          pageTitle="Coach Page"
          pageDescription="Manage Teams and Students for your Competition"
          sortOptions={sortOptions}
          filterOptions={filterOptions}
          sortOptionState={{ sortOption, setSortOption }}
          filtersState={{ filters, setFilters }}
          searchTermState={{ searchTerm, setSearchTerm }}
        >
          <AlertButton onClick={() => {}} ><FaBell /></AlertButton>
        </PageHeader>

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
        <Outlet context={{ filters, sortOption, searchTerm, removeFilter }} />
        
      </MainPageDiv>
  </OverflowFlexBackground>
  );
}