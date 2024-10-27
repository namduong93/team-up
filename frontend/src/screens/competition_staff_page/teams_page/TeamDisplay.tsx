import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import { FilterTagButton, RemoveFilterIcon } from "../../dashboard/Dashboard";
import { sendRequest } from "../../../utility/request";
import Fuse from "fuse.js";
import { useCompetitionOutletContext } from "../hooks/useCompetitionOutletContext";
import { TeamCard, TeamDetails } from "./components/TeamCard";
import { ThirdStepPopUp } from "../../student/ThirdStepPopUp";
import { CompetitionRole } from "../CompetitionPage";

const TeamCardGridDisplay = styled.div`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(294px, 100%), 1fr));
  margin-top: 32px;
  row-gap: 20px;
  overflow: auto;
`;

export const TEAM_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
];

export const TEAM_DISPLAY_FILTER_OPTIONS = {
  Status: ['Pending', 'Unregistered', 'Registered'],
  "Team Name Approval": ['Approved', 'Unapproved'], 
};

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`
const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`

export const TeamDisplay: FC = () => {
  const { compId } = useParams();
  const { filters, sortOption, searchTerm, removeFilter, setFilters,
          editingStatusState: [isEditingStatus, setIsEditingStatus],
          teamIdsState: [approveTeamIds, setApproveTeamIds],
          rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
          universityOption, roles,
          editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
          setFilterOptions, setSortOptions, setEnableTeamButtons } = useCompetitionOutletContext('teams');

  const [teamList, setTeamList] = useState<Array<TeamDetails>>([]);


  useEffect(() => {
    setFilterOptions(TEAM_DISPLAY_FILTER_OPTIONS);
    setSortOptions(TEAM_DISPLAY_SORT_OPTIONS);
    setEnableTeamButtons(!roles.includes(CompetitionRole.SiteCoordinator) && true);

    const fetchCompetitionTeams = async () => {
      try {
        const response = await sendRequest.get<{ teamList: Array<TeamDetails>}>('/competition/teams', { compId });
        const { teamList } = response.data
        setTeamList(teamList);

      } catch (error: unknown) {

      }

    };

    fetchCompetitionTeams();


  }, []);
  
  const filteredTeamList = teamList.filter((team: TeamDetails) => {
    if (filters.Status) {
      if (!filters.Status.some((status) => status.toLocaleLowerCase() === team.status)) {
        return false;
      }
    }

    if (filters["Team Name Approval"]) {

      if (!filters["Team Name Approval"].some((approvalString) => 
        (approvalString === 'Approved') === team.teamNameApproved
      )) {
        return false;
      }
    }
    
    if (!(universityOption.value === '') && !(team.universityId === parseInt(universityOption.value))) {
      return false;
    }
    
    return true;
  });


  const sortedTeamList = filteredTeamList.sort((team1, team2) => {
    if (!sortOption) {
      return 0;
    }

    if (sortOption === 'name') {
      return team1.teamName.localeCompare(team2.teamName);
    }

    return 0;
  });

  const fuse = new Fuse(sortedTeamList, {
    keys: ['teamName', 'memberName1', 'memberName2', 'memberName3'],
    threshold: 0.5
  });

  

  let searchedCompetitions;
  if (searchTerm) {
    searchedCompetitions = fuse.search(searchTerm);
  } else {
    searchedCompetitions = sortedTeamList.map((team) => { return { item: team } });
  }


  const location = useLocation();
  const [isCreationSuccessPopUpOpen, setIsCreationSuccessPopUpOpen] = useState(false);

   const handleClosePopUp = () => {
    setIsCreationSuccessPopUpOpen(false);
  }

  useEffect(() => {
    console.log("hello")
    console.log(location.state)
    if (location.state?.isSuccessPopUpOpen) {
      setIsCreationSuccessPopUpOpen(true);
    }
  }, [location.state]);

  return (
    <>
    {isCreationSuccessPopUpOpen && (
      <>
      <Overlay $isOpen={true} />
      <ThirdStepPopUp
        heading={<Heading>The competition has successfully {"\nbeen created"} </Heading>}
        onClose={handleClosePopUp}
      />
    </>
    )}
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
    <TeamCardGridDisplay>
      {searchedCompetitions.map(({item: teamDetails}, index) => {
        return (
        <TeamCard
          teamIdsState={[approveTeamIds, setApproveTeamIds]}
          rejectedTeamIdsState={[rejectedTeamIds, setRejectedTeamIds]}
          isEditingStatus={isEditingStatus}
          isEditingNameStatus={isEditingNameStatus}
          key={`${teamDetails.teamName}${teamDetails.status}${index}`} teamDetails={teamDetails} />)
      })}
    </TeamCardGridDisplay>
    </>
  )
}