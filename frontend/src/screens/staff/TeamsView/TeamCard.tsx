import { FC, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import styled from "styled-components";

interface TeamCardProps {
  teamDetails: {
    teamName: string;
    memberName1?: string;
    memberName2?: string;
    memberName3?: string;
    status: 'pending' | 'registered' | 'unregistered';
  }
}

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
  transition: transform 100ms;
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
  }
`

const CardHeaderDiv = styled.div<{ statusColor: string }>`
  background-color: ${({statusColor}) => statusColor};
  height: 58px;
  width: 100%;
  border-radius: 20px 20px 0px 0px;
  display: flex;
  align-items: center;
`

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
`

export const TeamCard: FC<TeamCardProps> = ({ teamDetails }) => {
  const [status, _ ] = useState(teamDetails.status);
  const colorMap = {
    'pending': '#F48385',
    'unregistered': '#FDD386',
    'registered': '#8BDFA5',
  };
  return (
    <StyledHoverDiv>
      <CardHeaderDiv statusColor={colorMap[status]}>
        <TitleSpan>{teamDetails.teamName}</TitleSpan>
      </CardHeaderDiv>

      <TeamMatesContainerDiv>

        {teamDetails.memberName1 && 
        <TeamMemberDiv>
          <TeamCardMember memberName={teamDetails.memberName1} />
        </TeamMemberDiv>}

        {teamDetails.memberName2 && 
        <TeamMemberDiv>
          <TeamCardMember memberName={teamDetails.memberName2} />
        </TeamMemberDiv>}

        {teamDetails.memberName3 && 
        <TeamMemberDiv>
          <TeamCardMember memberName={teamDetails.memberName3} />
        </TeamMemberDiv>}

      </TeamMatesContainerDiv>

    </StyledHoverDiv>
  )
}