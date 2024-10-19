import React, { FC, useEffect, useState } from "react";
import { TeamCard, TeamDetails } from "./TeamCard";
import styled from "styled-components";
import { useOutletContext, useParams } from "react-router-dom";
import { FilterTagButton, RemoveFilterIcon } from "../../Dashboard/Dashboard";
import { sendRequest } from "../../../utility/request";
import Fuse from "fuse.js";

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
  const { filters, sortOption, searchTerm, removeFilter,
          setFilterOptions, setSortOptions } = useOutletContext<CompetitionPageContext>();

  const [teamList, setTeamList] = useState<Array<TeamDetails>>([]);
  setFilterOptions(TEAM_DISPLAY_FILTER_OPTIONS);
  setSortOptions(TEAM_DISPLAY_SORT_OPTIONS);

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
        return (<TeamCard key={`${teamDetails.teamName}${teamDetails.status}${index}`} teamDetails={teamDetails} />)
      })}
    </TeamCardGridDisplay>
    </>
  )
}