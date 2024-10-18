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
  grid-template-columns: repeat(auto-fill, minmax(min(294px, 100%), 1fr));
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
        setTeamList([...teamList, 
          { 
            teamName: 'himself everywhere',
            memberName1: 'Cole Hughes',
            memberName2: 'Winifred Payne',
            memberName3: 'Ellen Moore',
            status: 'registered',
            teamNameApproved: true
          },
          { 
            teamName: 'family hospital leave valley',
            memberName1: 'Estelle Garcia',
            memberName2: 'Lettie Flores',
            memberName3: 'Bobby Sullivan',
            status: 'registered',
            teamNameApproved: true
          },
          { 
            teamName: 'where touch pony too',
            memberName1: 'Elnora James',
            memberName2: 'Ruth Elliott',
            memberName3: 'Steve Ramsey',
            status: 'pending',
            teamNameApproved: true
          },
          { 
            teamName: 'arrangement mind nuts lack',
            memberName1: 'Jon Snyder',
            memberName2: 'Lora Gill',
            memberName3: 'Edna Owen',
            status: 'pending',
            teamNameApproved: true
          },
          { 
            teamName: 'look income bear article',
            memberName1: 'Fannie Cain',
            memberName2: 'Lula Ruiz',
            memberName3: 'Steven Pope',
            status: 'registered',
            teamNameApproved: false
          },
          { 
            teamName: 'skin shape out that',
            memberName1: 'Linnie Martin',
            memberName2: 'Sean Tran',
            memberName3: 'Derrick Munoz',
            status: 'unregistered',
            teamNameApproved: true
          },
          { 
            teamName: 'pony industrial offer',
            memberName1: 'Ricky Sandoval',
            memberName2: 'Mike Rios',
            memberName3: 'Nathaniel Gibson',
            status: 'unregistered',
            teamNameApproved: true
          },
          { 
            teamName: 'snow forest design',
            memberName1: 'Beatrice Logan',
            memberName2: 'Cory Burke',
            memberName3: 'Ida Waters',
            status: 'unregistered',
            teamNameApproved: true
          },
          { 
            teamName: 'caught path fought believed',
            memberName1: 'Bernice Pratt',
            memberName2: 'Callie Woods',
            memberName3: 'Ida Flowers',
            status: 'registered',
            teamNameApproved: true
          },
          { 
            teamName: 'remove among last fox',
            memberName1: 'Phoebe Rowe',
            memberName2: 'Jeffrey Reynolds',
            memberName3: 'Louis Craig',
            status: 'registered',
            teamNameApproved: false
          },
          { 
            teamName: 'seeing finest nest farther',
            memberName1: 'Hester Lopez',
            memberName2: 'Lois Blair',
            memberName3: 'Donald Franklin',
            status: 'registered',
            teamNameApproved: false
          },
          { 
            teamName: 'manner brief principle',
            memberName1: 'Harvey Houston',
            memberName2: 'Ethan Valdez',
            memberName3: 'Joseph Potter',
            status: 'registered',
            teamNameApproved: false
          },
          { 
            teamName: 'birds thick pressure out',
            memberName1: 'Hulda Hall',
            memberName2: 'Antonio Frank',
            memberName3: 'Rhoda Aguilar',
            status: 'unregistered',
            teamNameApproved: true
          },
          { 
            teamName: 'new they yes fish scale',
            memberName1: 'Lee Cole',
            memberName2: 'Evelyn Waters',
            memberName3: 'Stephen Lamb',
            status: 'unregistered',
            teamNameApproved: true
          },
          { 
            teamName: 'necessary studying unit',
            memberName1: 'Kyle Perez',
            memberName2: 'Olga Shaw',
            memberName3: 'Landon Murray',
            status: 'pending',
            teamNameApproved: true
          },
        ]);

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