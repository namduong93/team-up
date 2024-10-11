import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { FlexBackground } from "../components/general_utility/Background";
import { FaBell, FaFilter, FaTimes } from "react-icons/fa";
import { DashboardSidebar } from "../components/general_utility/DashboardSidebar";
import { CompCard } from "../components/general_utility/CompCard";
import { FilterIcon, FilterSelect } from "../components/general_utility/FilterSelect";
import { ActionButton } from "../components/general_utility/ActionButton";
import { SortIcon, SortSelect } from "../components/general_utility/SortSelect";
import { Notifications } from "../components/general_utility/Notifications";
import { sendRequest } from "../utility/request";
import { useNavigate } from "react-router-dom";
import { ResponsiveButton, SortContainer } from "./staff/CoachPage/CoachPage";
interface Competition {
  compName: string;
  location: string;
  compDate: string; // format: "YYYY-MM-DD"
  roles: string[];
  compId: string;
  compCreationDate: string;
}

interface DashboardsProps {
  name: string;
  affiliation: string;
  competitions: Competition[];
}

const OverflowFlexBackground = styled(FlexBackground)`
  overflow: hidden;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
  /* overflow-y: hidden; */
  overflow-x: visible;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 117px;
  min-width: fit-content;
  align-items: center;
  overflow-x: visible;
  gap: 30px;
  margin-right: 20px;
  margin-left: 20px;
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const WelcomeText = styled.div``;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
  width: 100%;
  margin-right: 20px;
`;

const RegisterAlert = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const AlertButton = styled.button`
  border-radius: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.secondaryDark};
    color: ${({ theme }) => theme.background};
  }
`;

const SortFilterSearch = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  width: 100%;
  max-width: 360px;
`;

// const FilterButton = styled.button<{ $isFilterOpen: boolean }>`
//   background-color: ${({ theme }) => theme.background};
//   border-radius: 10px;
//   border: 1px solid ${({ theme }) => theme.colours.filterText};
//   color: ${({ theme }) => theme.colours.filterText};
//   padding: 8px 16px;
//   display: flex;
//   gap: 10px;
//   align-items: center;

//   ${({ $isFilterOpen: isFilterOpen, theme }) =>
//     isFilterOpen &&
//     `
//     background-color: ${theme.colours.sidebarBackground};
//     color: ${theme.fonts.colour};
//   `}

//   &:hover {
//     cursor: pointer;
//     background-color: ${({ theme }) => theme.colours.sidebarBackground};
//     color: ${({ theme }) => theme.fonts.colour};
//   }
// `;

export const SortButton = styled.button<{ $isSortOpen: boolean }>`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.filterText};
  color: ${({ theme }) => theme.colours.filterText};
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;

  ${({ $isSortOpen: isSortOpen, theme }) =>
    isSortOpen &&
    `
    background-color: ${theme.colours.sidebarBackground};
    color: ${theme.fonts.colour};
  `}

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;

const FilterTagButton = styled.button`
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  cursor: auto;
`;

const RemoveFilterIcon = styled(FaTimes)`
  margin-left: 5px;
  color: ${({ theme }) => theme.fonts.colour};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

const SearchInput = styled.input`
  max-width: 150px;
  width: 100%;
  max-height: 38px;
  border: 1px solid ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  padding: 10px;
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
`;

const ContentArea = styled.div`
  margin-top: 32px;
  overflow-y: auto;
  overflow-x: auto;
  flex: 1;
  max-height: calc(100vh - 200px);
`;

const CompetitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(294px, 1fr));
  gap: 20px;
  width: 100%;
  min-height: 500px;
  padding: 0 20px;
  box-sizing: border-box;
`;

export const Dashboard: FC<DashboardsProps> = ({ name, affiliation, competitions }) => {
  const [filters, setFilters] = useState<{ [field: string]: string[] }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const sortOptions = [
    { label: "Default", value: "original" },
    { label: "Alphabetical (Name)", value: "name" },
    { label: "Competition Date", value: "date" },
    { label: "Alphabetical (Location)", value: "location" },
    { label: "Time Remaining", value: "timeRemaining" },
  ];

  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await sendRequest.get<{ preferredName: string }>('/student/dash_info');
        // Can also store the preferredName from the response and use it in the sidebar.
        // Request any personal info needed here and then if there's an auth error in any of them
        // the page will redirect.
        setIsLoaded(true);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          setIsLoaded(false);
          navigate('/');
          console.log('Authentication Error: ', error);
        });
        // can handle other codes or types of errors here if needed.
      }
    })();
  }, []);

  // "YYYY-MM-DD" format
  const today = new Date().toISOString().split("T")[0];

  // filter options based on the Competition fields (location, role, status, year)
  const filterOptions = {
    Location: Array.from(new Set(competitions.map(comp => comp.location))).sort(),
    Role: Array.from(new Set(competitions.flatMap(comp => comp.roles))),
    Status: ["Completed", "Upcoming"],
    Year: Array.from(new Set(competitions.map(comp => comp.compDate.split("-")[0]))).sort((a, b) => parseInt(a) - parseInt(b)),
  };

  // // click outside filter to close popup
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
  //       setIsFilterOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  const handleFilterToggle = () => {
    setIsFilterOpen(prev => !prev);
  };

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

  const matchesSearch = (comp: Competition) => {
    const searchLower = searchTerm.toLowerCase();
    const compDateMonth = new Date(comp.compDate).toLocaleString('default', { month: 'long' }).toLowerCase();
    
    return (
      comp.compName.toLowerCase().includes(searchLower) ||
      comp.location.toLowerCase().includes(searchLower) ||
      comp.roles.some(role => role.toLowerCase().includes(searchLower)) ||
      compDateMonth.includes(searchLower)
    );
  };

  const filteredCompetitions = competitions.filter((comp) => {
    return (
      matchesSearch(comp) && // filter by search criteria
      Object.keys(filters).every((field) => {
        if (!filters[field].length) return true;
        if (field === "Status") {
          return (
            (comp.compDate < today && filters[field].includes("Completed")) ||
            (comp.compDate >= today && filters[field].includes("Upcoming"))
          );
        }
        if (field === "Year") {
          return filters[field].includes(comp.compDate.split("-")[0]);
        }
        return filters[field].some((filterValue) => {
          if (field === "Location") {
            return comp.location === filterValue;
          }
          if (field === "Role") {
            return comp.roles.includes(filterValue);
          }
          return false;
        });
      })
    );
  });

  const handleSortToggle = () => {
    setIsSortOpen((prev) => !prev);
  };

  // click outside sort to close popup
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
  //       setIsSortOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [sortRef]);

  const sortedCompetitions = [...filteredCompetitions].sort((a, b) => {
    const defaultIndices = filteredCompetitions.map((comp) => comp.compId);

    switch (sortOption) {
      case "name":
        return a.compName.localeCompare(b.compName);
      case "date":
        return new Date(a.compDate).getTime() - new Date(b.compDate).getTime();
      case "location":
        return a.location.localeCompare(b.location);
      case "timeRemaining":
        { const aRemaining = new Date(a.compDate).getTime() - Date.now();
        const bRemaining = new Date(b.compDate).getTime() - Date.now();
        return aRemaining - bRemaining; };
      case "original":
        return defaultIndices.indexOf(a.compId) - defaultIndices.indexOf(b.compId);
      default:
        return 0;
    }
  });
  
  return (isLoaded &&
    <OverflowFlexBackground>
      <DashboardSidebar name={name} affiliation={affiliation} cropState={false}/>
      <DashboardContent>
        <DashboardHeader>
          <WelcomeMessage>
            <h1>Dashboard</h1>
            <WelcomeText>Welcome back, {name}!</WelcomeText>
          </WelcomeMessage>
          
          <ActionButtons>
            <RegisterAlert>
              <ActionButton 
                actionName="Register" 
                question="Register for a new competition?" 
                redirectPath="/comp/register"
                actionType="primary"
              />
              <AlertButton onClick={() => setIsNotificationsVisible(prev => !prev)}><FaBell /></AlertButton>
            </RegisterAlert>
            
            <SortFilterSearch>
            <SortContainer>
                <ResponsiveButton
                  icon={<SortIcon />}
                  label='Sort'
                  isOpen={isSortOpen}
                  onClick={handleSortToggle}
                >
                </ResponsiveButton>
                {isSortOpen && (
                <SortSelect
                  options={sortOptions}
                  onSortChange={(selectedSort) => setSortOption(selectedSort)}
                  isOpen={isSortOpen}
                />
                )}
              </SortContainer>

              <SortContainer>
                <ResponsiveButton
                  icon={<FilterIcon />}
                  label='Filter'
                  isOpen={isFilterOpen}
                  onClick={handleFilterToggle}
                >
                  <FaFilter /> Filter
                </ResponsiveButton>
                <FilterSelect
                  options={filterOptions}
                  onFilterChange={(selectedFilters) => setFilters(selectedFilters)}
                  isOpen={isFilterOpen}
                  currentFilters={filters}
                />
              </SortContainer>
              <SearchInput
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </SortFilterSearch>
          </ActionButtons>
        </DashboardHeader>

        {/* Notifications Popup */}
        {isNotificationsVisible && <Notifications />}
  
        {/* Active Filters Display */}
        <div>
          {Object.entries(filters).map(([field, values]) =>
            values.map((value) => (
              <FilterTagButton key={`${field}-${value}`}>
                {value} 
                <RemoveFilterIcon 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFilter(field, value);
                  }} 
                />
              </FilterTagButton>
            ))
          )}
        </div>
  
        {/* Filter Dropdown */}
        {/* <div ref={filterRef}>
          <FilterSelect
            options={filterOptions}
            onFilterChange={(selectedFilters) => setFilters(selectedFilters)}
            isOpen={isFilterOpen}
            currentFilters={filters}
          />
        </div> */}

        {/* Sort Dropdown */}
        {/* <div ref={sortRef}>
          {isSortOpen && (
            <SortSelect
              options={sortOptions}
              onSortChange={handleSortChange}
              isOpen={isSortOpen}
            />
          )}
        </div> */}
        
        <ContentArea>
          <CompetitionGrid>
            {sortedCompetitions.map((comp, index) => (
              <CompCard
                key={index}
                compName={comp.compName}
                location={comp.location}
                compDate={comp.compDate}
                roles={comp.roles}
                compId={comp.compId}
                compCreationDate={comp.compCreationDate}
              />
            ))}
          </CompetitionGrid>
        </ContentArea>
      </DashboardContent>
    </OverflowFlexBackground>
  );
};