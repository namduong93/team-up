import { FC, useState } from "react";
import { CiCircleAlert } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import styled from "styled-components";

export type MemberDetails = [
  name: string,
  siteId: number,
  ICPCEligible: boolean,
  level: string,
  boersenEligible: boolean,
  isRemote: boolean
];

export enum Member {
  name = 0,
  siteId = 1,
  ICPCEligible = 2,
  level = 3,
  boersenEligible = 4,
  isRemote = 5,
}
export interface TeamDetails {
  teamId: number;
  universityId: number;
  teamName: string;
  member1?: MemberDetails;
  member2?: MemberDetails;
  member3?: MemberDetails;
  status: 'pending' | 'registered' | 'unregistered';
  teamNameApproved: boolean;
};

interface TeamCardProps {
  teamDetails: TeamDetails;
};

const TeamMemberContainerDiv = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 20% 80%;
  user-select: none;
`

const StyledUserIcon = styled(FaRegUser)`
  width: 50%;
  min-width: 18px;
  margin: auto 0 auto 25%;
  pointer-events: none;
  user-select: none;
`

const CenterTextDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const TeamCardMember = ({ memberName }: { memberName: string }) => {

  return (
  <TeamMemberContainerDiv draggable='false'>
    <StyledUserIcon />
    <CenterTextDiv>
      {memberName}
    </CenterTextDiv>
  </TeamMemberContainerDiv>
  );
}

const StyledHoverDiv = styled.div`
  transition: transform 0.2s ease-in-out !important;
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  min-height: 260px;
  max-height: 260px;
  max-width: 294px;
  min-width: 140px;
  border-radius: 20px 20px 20px 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  user-select: none;
  &:hover {
    transform: translate(2px, 2px);
    cursor: pointer;
  }
`

const CardHeaderDiv = styled.div<{ $statusColor: string }>`
  background-color: ${(props) => props.$statusColor};
  height: 58px;
  width: 100%;
  border-radius: 20px 20px 0px 0px;
  display: flex;
  align-items: center;
  gap: 2.5%;
`;

const TitleSpan = styled.span`
  font-size: 1.5rem;
  margin-left: 5%;
`

const TeamMatesContainerDiv = styled.div`
  background-color: white;
  flex: 1 1 auto;
  border-radius: 0px 0px 20px 20px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-top: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
`

const TeamMemberDiv = styled.div`
  border-radius: 10px;
  border: 1px solid rgb(200, 200, 200);
  width: 85.37%;
  height: 20.79%;
`;

const RedTeamNameAlert = styled(CiCircleAlert)`
  color: red;
  min-height: 32px;
  min-width: 32px;
  margin-right: 5%;
`;

export const TeamCard: FC<TeamCardProps> = ({ teamDetails }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, _ ] = useState(teamDetails.status);
  const colorMap = {
    'pending': '#F48385',
    'unregistered': '#FDD386',
    'registered': '#8BDFA5',
  };
  console.log(teamDetails);
  return (
    <StyledHoverDiv>
      <CardHeaderDiv $statusColor={colorMap[status]}>
        <TitleSpan>{teamDetails.teamName}</TitleSpan>
        {!teamDetails.teamNameApproved && <RedTeamNameAlert />}
      </CardHeaderDiv>

      <TeamMatesContainerDiv>

        {teamDetails.member1 && 
        <TeamMemberDiv>
          <TeamCardMember memberName={teamDetails.member1[Member.name]} />
        </TeamMemberDiv>}

        {teamDetails.member2 && 
        <TeamMemberDiv>
          <TeamCardMember memberName={teamDetails.member2[Member.name]} />
        </TeamMemberDiv>}

        {teamDetails.member3 && 
        <TeamMemberDiv>
          <TeamCardMember memberName={teamDetails.member3[Member.name]} />
        </TeamMemberDiv>}

      </TeamMatesContainerDiv>

    </StyledHoverDiv>
  )
}