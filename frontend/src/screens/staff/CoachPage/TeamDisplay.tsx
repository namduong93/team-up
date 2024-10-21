import React, { FC, ReactNode, useEffect, useState } from "react";
import { TeamCard, TeamDetails } from "./TeamCard";
import styled, { useTheme } from "styled-components";
import { useOutletContext, useParams } from "react-router-dom";
import { FilterTagButton, RemoveFilterIcon } from "../../Dashboard/Dashboard";
import { sendRequest } from "../../../utility/request";
import Fuse from "fuse.js";
import { ResponsiveButton } from "../../../components/sort_filter_search/PageHeader";
import { FaSave, FaStamp } from "react-icons/fa";

const TeamCardGridDisplay = styled.div`
  flex: 1;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(294px, 100%), 1fr));
  margin-top: 32px;
  row-gap: 20px;
  overflow: auto;
`;

export interface CompetitionPageContext {
  filters: Record<string, Array<string>>;
  sortOption: string;
  searchTerm: string;
  removeFilter: (field: string, value: string) => Record<string, string>;
  setFilterOptions: React.Dispatch<React.SetStateAction<Record<string, Array<string>>>>;
  setSortOptions: React.Dispatch<React.SetStateAction<Array<{ label: string, value: string }>>>;
  setPageButtons: React.Dispatch<React.SetStateAction<ReactNode>>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
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
          setFilterOptions, setSortOptions, setPageButtons } = useOutletContext<CompetitionPageContext>();
  
  const theme = useTheme();


  const [teamList, setTeamList] = useState<Array<TeamDetails>>([]);
  setFilterOptions(TEAM_DISPLAY_FILTER_OPTIONS);
  setSortOptions(TEAM_DISPLAY_SORT_OPTIONS);

  

  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const enableEditTeamStatus = () => {
    setIsEditingStatus(true);
    setFilters({ Status: ['Pending'], ...filters });
  };
  const disableEditTeamStatus = () => {
    setIsEditingStatus(false);
    setFilters({});
  }

  useEffect(() => {

    setPageButtons(
      <>
        {!isEditingStatus &&
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
        <div style={{ maxWidth: '130px', width: '100%', height: '33px' }}>
          <ResponsiveButton onClick={disableEditTeamStatus} label="Confirm Teams" isOpen={false}
            icon={<FaSave style={{ color: theme.fonts.colour}} />}
            style={{
              backgroundColor: theme.colours.confirm,
              color: theme.background,
              border: '0'
            }}
          />
        </div>}
      </>
    );
  }
  , [isEditingStatus])

  useEffect(() => {
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
        return (<TeamCard
          isEditingStatus={isEditingStatus}
          key={`${teamDetails.teamName}${teamDetails.status}${index}`} teamDetails={teamDetails} />)
      })}
    </TeamCardGridDisplay>
    </>
  )
}