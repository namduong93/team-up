import React, { FC, useEffect, useState } from "react";
import { TeamCard, TeamDetails } from "./TeamCard";
import styled, { useTheme } from "styled-components";
import { useParams } from "react-router-dom";
import { FilterTagButton, RemoveFilterIcon } from "../../Dashboard/Dashboard";
import { sendRequest } from "../../../utility/request";
import Fuse from "fuse.js";
import { ResponsiveButtonProps } from "../../../components/sort_filter_search/PageHeader";
import { FaCheck, FaCheckCircle, FaRegCheckCircle, FaSave, FaStamp } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { useCompetitionOutletContext } from "./useCompetitionOutletContext";

const TeamCardGridDisplay = styled.div`
  flex: 1;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(294px, 100%), 1fr));
  margin-top: 32px;
  row-gap: 20px;
  overflow: auto;
`;

export interface PageButtonsProps {
  filtersState: [Record<string, Array<string>>, React.Dispatch<React.SetStateAction<Record<string, string[]>>>];
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  editingNameStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  rejectedTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
}

export const TeamPageButtons: FC<PageButtonsProps> = ({
  filtersState: [filters, setFilters],
  editingStatusState: [isEditingStatus, setIsEditingStatus],
  teamIdsState: [approveTeamIds, setApproveTeamIds],

  rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
  editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus]
}) => {
  
  const theme = useTheme();

  const enableEditTeamStatus = () => {
    setIsEditingStatus(true);
    setFilters({ ...filters, Status: ['Pending'] });
  };
  const disableEditTeamStatus = () => {
    setIsEditingStatus(false);
    setFilters({});
    setApproveTeamIds([]);
  }
  const confirmTeams = () => {
    // do something with the approveTeamIds:
    console.log('accepted', approveTeamIds);

    disableEditTeamStatus();
  }

  const enableEditNameStatus = () => {
    setIsEditingNameStatus(true);
    setFilters({ ...filters, "Team Name Approval": ['Unapproved'] });
  }
  const disableEditNameStatus = () => {
    setIsEditingNameStatus(false);
    setFilters({});
    setApproveTeamIds([]);
    setRejectedTeamIds([]);
  }
  const confirmNames = () => {
    // do something with the approveTeamIds and rejectedteamIds:
    console.log('accepted', approveTeamIds);
    console.log('rejected', rejectedTeamIds);

    disableEditNameStatus();
  }

  return (<>
  {!isEditingStatus && !isEditingNameStatus &&
  <div style={{ maxWidth: '130px', width: '100%', height: '33px' }}>
    <ResponsiveButton onClick={enableEditTeamStatus} label="Edit Team Status" isOpen={false}
      icon={<FaStamp style={{ color: theme.fonts.colour}} />}
      style={{
        backgroundColor: theme.colours.confirm,
        color: theme.background,
        border: '0'
      }}
    />
  </div>}
  {isEditingStatus && 
  <>
  <div style={{ maxWidth: '130px', width: '100%', height: '33px' }}>
    <ResponsiveButton onClick={confirmTeams} label="Confirm Teams" isOpen={false}
      icon={<FaSave style={{ color: theme.fonts.colour}} />}
      style={{
        backgroundColor: theme.colours.confirm,
        color: theme.background,
        border: '0'
      }}
    />
  </div>
  <div style={{ maxWidth: '100px', width: '100%', height: '33px' }}>
  <ResponsiveButton onClick={disableEditTeamStatus} label="Cancel" isOpen={false}
      icon={<GiCancel style={{ color: theme.fonts.colour}} />}
      style={{
        backgroundColor: theme.colours.cancel,
        color: theme.background,
        border: '0'
      }}
    />
  </div>
  </>}

  {!isEditingStatus && !isEditingNameStatus &&
  <div style={{ maxWidth: '150px', width: '100%', height: '33px' }}>
    <ResponsiveButton onClick={enableEditNameStatus} label="Approve Names" isOpen={false}
      icon={<FaRegCheckCircle style={{ color: theme.fonts.colour}} />}
      style={{
        backgroundColor: theme.colours.confirm,
        color: theme.background,
        border: '0'
      }}
    />
  </div>}

  {isEditingNameStatus && 
  <>
  <div style={{ maxWidth: '130px', width: '100%', height: '33px' }}>
    <ResponsiveButton onClick={confirmNames} label="Confirm Names" isOpen={false}
      icon={<FaSave style={{ color: theme.fonts.colour}} />}
      style={{
        backgroundColor: theme.colours.confirm,
        color: theme.background,
        border: '0'
      }}
    />
  </div>
  <div style={{ maxWidth: '100px', width: '100%', height: '33px' }}>
  <ResponsiveButton onClick={disableEditNameStatus} label="Cancel" isOpen={false}
      icon={<GiCancel style={{ color: theme.fonts.colour}} />}
      style={{
        backgroundColor: theme.colours.cancel,
        color: theme.background,
        border: '0'
      }}
    />
  </div>
  </>}

  </>);
}

export const TEAM_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
];

export const TEAM_DISPLAY_FILTER_OPTIONS = {
  Status: ['Pending', 'Unregistered', 'Registered'],
  "Team Name Approval": ['Approved', 'Unapproved'], 
};

export const TeamDisplay: FC = () => {
  const { compId } = useParams();
  const { filters, sortOption, searchTerm, removeFilter, setFilters,
          editingStatusState: [isEditingStatus, setIsEditingStatus],
          teamIdsState: [approveTeamIds, setApproveTeamIds],
          rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
          editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
          setFilterOptions, setSortOptions, setEnableTeamButtons } = useCompetitionOutletContext('teams');

  const [teamList, setTeamList] = useState<Array<TeamDetails>>([]);


  useEffect(() => {
    setFilterOptions(TEAM_DISPLAY_FILTER_OPTIONS);
    setSortOptions(TEAM_DISPLAY_SORT_OPTIONS);
    setEnableTeamButtons(true);

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

  return (
    <>
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