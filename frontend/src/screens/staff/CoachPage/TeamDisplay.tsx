import { FC } from "react";
import { TeamCard } from "./TeamCard";
import styled from "styled-components";

const TeamCardGridDisplay = styled.div`
  flex: 1;
  background-color: white;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(294px, 100%), 1fr));
  margin-top: 32px;
  row-gap: 20px;
  overflow: auto;
`;

export const TeamDisplay: FC = () => {
  return (
    <TeamCardGridDisplay>
      {Array(50).fill(0).map((_, index) => (<TeamCard key={index} teamDetails={{
        teamName: 'Team Name',
        status: (index % 3) === 0 ? 'unregistered' : (index % 3) === 1 ? 'registered' : 'pending',
        memberName1: 'Team Member 1',
        memberName2: 'Team Member 2',
        memberName3: 'Team Member 3'
      }} />))}
    </TeamCardGridDisplay>
  )
}