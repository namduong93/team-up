import { FC, useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { FlexBackground } from "../components/general_utility/Background";
import { FaBell, FaFilter } from "react-icons/fa";
import { DashboardSidebar } from "../components/general_utility/DashboardSidebar";
import { CompCard } from "../components/general_utility/CompCard";
import { FilterSelect } from "../components/general_utility/FilterSelect";

interface Competition {
  compName: string;
  location: string;
  compDate: string; // format: "YYYY-MM-DD"
  role: string;
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
`;

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow: hidden;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 117px;
  width: 100%;
  align-items: center; // Centers elements vertically
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const WelcomeText = styled.div`
  color: ${({ theme }) => theme.fonts.color};
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: space-between; // This aligns both sections to the ends
  align-items: center; // Ensures vertical alignment of buttons
  gap: 10px; // Adjusted gap for spacing
  width: 100%; // Ensures full width for alignment
`;

const RegisterAlert = styled.div`
  display: flex;
  gap: 10px;
  align-items: center; // Ensures vertical alignment of buttons
`;

const RegisterButton = styled.button`
  background-color: ${({ theme }) => theme.colours.primaryLight};
  border-radius: 10px;
  border: none;
  padding: 8px 20px;
  white-space: nowrap; // Prevents button text from wrapping
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.primaryDark};
    color: ${({ theme }) => theme.background};
  }
`;

const AlertButton = styled.button`
  border-radius: 10px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.secondaryDark};
    color: ${({ theme }) => theme.background};
  }
`;

const FilterSearch = styled.div`
  display: flex;
  gap: 10px;
  align-items: center; // Ensures vertical alignment of buttons
`;

const FilterButton = styled.button<{ isFilterOpen: boolean }>`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colours.filterText};
  color: ${({ theme }) => theme.colours.filterText};
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;

  ${({ isFilterOpen, theme }) =>
    isFilterOpen &&
    `
    background-color: ${theme.colours.sidebarBackground};
    color: ${theme.fonts.colours};
  `}

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;

const SearchInput = styled.input`
  max-width: 150px;
  max-height: 38px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  margin-right: 10px;
`;

const ContentArea = styled.div`
  margin-top: 32px;
  padding-right: 16px;
  overflow-y: auto;
  overflow-x: hidden;
  flex: 1;
  max-height: calc(100vh - 200px);
`;

const CompetitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(294px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 0 16px;
`;

export const Dashboard: FC<DashboardsProps> = ({ name, affiliation, competitions }) => {
  const [filters, setFilters] = useState<{ [field: string]: string[] }>({});
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  // "YYYY-MM-DD" format
  const today = new Date().toISOString().split("T")[0];

  // filter options based on the Competition fields (location, role, status, year)
  const filterOptions = {
    Location: Array.from(new Set(competitions.map(comp => comp.location))).sort(),
    Role: Array.from(new Set(competitions.map(comp => comp.role))),
    Status: ["Completed", "Upcoming"],
    Year: Array.from(new Set(competitions.map(comp => comp.compDate.split("-")[0]))).sort((a, b) => parseInt(a) - parseInt(b)),
  };

  // click outside filter to close popup
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFilterToggle = () => {
    setIsFilterOpen(prev => !prev);
  };

  const filteredCompetitions = competitions.filter((comp) => {
    return Object.keys(filters).every((field) => {
      if (!filters[field].length) return true;
  
      if (field === "Status") {
        const isCompleted = today > comp.compDate;
        return filters.Status.includes(isCompleted ? "Completed" : "Upcoming");
      }
      if (field === "Year") {
        const year = comp.compDate.split("-")[0];
        return filters.Year.includes(year);
      }
  
      const fieldKey = field.toLowerCase() as keyof Competition;
      return filters[field].includes(comp[fieldKey] as unknown as string);
    });
  });

  return (
    <OverflowFlexBackground>
      <DashboardSidebar name={name} affiliation={affiliation} />
      <DashboardContent>
      <DashboardHeader>
        <WelcomeMessage>
          <h1>Dashboard</h1>
          <WelcomeText>Welcome back, {name}!</WelcomeText>
        </WelcomeMessage>
        
        <ActionButtons>
          <RegisterAlert>
            <RegisterButton>Register</RegisterButton>
            <AlertButton><FaBell /></AlertButton>
          </RegisterAlert>
          
          <FilterSearch>
            <FilterButton
              isFilterOpen={isFilterOpen}
              onClick={handleFilterToggle}
            >
              <FaFilter /> Filter
            </FilterButton>
            <SearchInput type="text" placeholder="Search" />
          </FilterSearch>
        </ActionButtons>
      </DashboardHeader>
        <div ref={filterRef}>
          <FilterSelect
            options={filterOptions}
            onFilterChange={(selectedFilters) => setFilters(selectedFilters)}
            isOpen={isFilterOpen}
          />
        </div>

        <ContentArea>
          <CompetitionGrid>
            {filteredCompetitions.map((comp, index) => (
              <CompCard
                key={index}
                compName={comp.compName}
                location={comp.location}
                compDate={comp.compDate}
                role={comp.role}
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
