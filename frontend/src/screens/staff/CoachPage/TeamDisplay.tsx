import { FC, useEffect, useState } from "react";
import { TeamCard, TeamDetails } from "./TeamCard";
import styled from "styled-components";
import { useOutletContext, useParams } from "react-router-dom";
import { FilterTagButton, RemoveFilterIcon } from "../../Dashboard/Dashboard";
import { sendRequest } from "../../../utility/request";

const TeamCardGridDisplay = styled.div`
  flex: 1;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(294px, 100%), 1fr));
  margin-top: 32px;
  row-gap: 20px;
  overflow: auto;
`;

interface CoachPageContext {
  filters: Record<string, Array<string>>;
  sortOption: { label: string, value: string };
  searchTerm: string;
  removeFilter: (field: string, value: string) => Record<string, string>;
}

export const TeamDisplay: FC = () => {
  const { compId } = useParams();
  const { filters, sortOption, searchTerm, removeFilter } = useOutletContext<CoachPageContext>();

  const [teamList, setTeamList] = useState<Array<TeamDetails>>([]);

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
      {teamList.map((teamDetails: TeamDetails, index) => {
        console.log(teamList);
        console.log(teamDetails);
        return (<TeamCard key={index} teamDetails={teamDetails} />)
      })}
    </TeamCardGridDisplay>
    </>
  )
}