import { FC } from "react";
import { TeamCard } from "./TeamCard";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import { FilterTagButton, RemoveFilterIcon } from "../../Dashboard";

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
  const { filters, sortOption, searchTerm, removeFilter } = useOutletContext<CoachPageContext>();
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
      {Array(50).fill(0).map((_, index) => (<TeamCard key={index} teamDetails={{
        teamName: 'Team Name',
        status: (index % 3) === 0 ? 'unregistered' : (index % 3) === 1 ? 'registered' : 'pending',
        memberName1: 'Team Member 1',
        memberName2: 'Team Member 2',
        memberName3: 'Team Member 3'
      }} />))}
    </TeamCardGridDisplay>
    </>
  )
}