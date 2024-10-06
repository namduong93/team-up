import { FC } from "react";
import styled from "styled-components";
import { FlexBackground } from "../components/general_utility/Background";
import { FaBell, FaFilter } from "react-icons/fa";
import { DashboardSidebar } from "../components/general_utility/DashboardSidebar";
import { CompCard } from "../components/general_utility/CompCard";


interface Competition {
  compName: string;
  location: string;
  compDate: string;
  compRole: string;
  compCountdown: number;
  compId: string;
};
interface DashboardsProps {
  name: string;
  affiliation: string;
  competitions: Competition[];
};

// Component styling
const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  font-family: Arial, Helvetica, sans-serif;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const WelcomeMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const WelcomeText = styled.div`
  color: #6c757d;
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-right: 2rem;
`;

const RegisterAlert = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const RegisterButton = styled.button`
  background-color: ${({ theme }) => theme.colours.primaryLight};
  padding: 0.5rem 3rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: bold;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.primaryDark};
    color: white;
  }
`;

const AlertButton = styled.button`
  border-radius: 0.5rem;
  padding: 0.6rem;
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  border: none;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const FilterSearch = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterButton = styled.button`
  background-color: white;
  border-radius: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  color: #6c757d;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    color: black;
  }
`;

const SearchInput = styled.input`
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 0.5rem;
`;

const ContentArea = styled.div`
  margin-top: 0;
  margin-right: 1rem;
`;

const CompetitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 2rem;

  // Responsive adjustments
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
    gap: 0.5rem;
  }
`;

export const Dashboard: FC<DashboardsProps> = ({ name, affiliation, competitions }) => {
  return (
    <FlexBackground>
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
              <FilterButton><FaFilter /> Filter</FilterButton>
              <SearchInput type="text" placeholder="Search" />
            </FilterSearch>
          </ActionButtons>
        </DashboardHeader>
        <ContentArea>
          <CompetitionGrid>
            {competitions.map((comp, index) => (
              <CompCard
                key={index}
                compName={comp.compName}
                location={comp.location}
                compDate={comp.compDate}
                compRole={comp.compRole}
                compCountdown={comp.compCountdown}
                compId={comp.compId}
              />
            ))}
          </CompetitionGrid>
        </ContentArea>
      </DashboardContent>
    </FlexBackground>
  );
};
