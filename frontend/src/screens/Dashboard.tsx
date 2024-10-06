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
  compId: string;
  compCreationDate: string;
};

interface DashboardsProps {
  name: string;
  affiliation: string;
  competitions: Competition[];
};

// Component styling
const OverflowFlexBackground = styled(FlexBackground)`
  overflow: auto;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  height: 100vh;
`;

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 117px;
  width: 100%;
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
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const RegisterAlert = styled.div`
  display: flex;
  margin-top: 10px;
`;

const RegisterButton = styled.button`
  background-color: ${({ theme }) => theme.colours.primaryLight};
  border-radius: 10px;
  border: none;
  padding: 8px 20px;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.primaryDark};
    color: white;
  }
`;

const AlertButton = styled.button`
  border-radius: 10px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  border: none;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const FilterSearch = styled.div`
  display: flex;
  gap: 10px;
`;

const FilterButton = styled.button`
  background-color: white;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  color: #6c757d;
  padding: 8px 16px;
  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    color: black;
  }
`;

const SearchInput = styled.input`
  padding: 8px;
  width: 200px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
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
