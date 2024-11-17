import { StyledCenterTextDiv, StyledStyledUserIcon, StyledTeamMemberContainerDiv } from "../../TeamCard.styles";

export const TeamCardMember = ({ memberName, level }: { memberName: string, level: string }) => {

  const levelChar = level.slice(-1);

  return (
    <StyledTeamMemberContainerDiv
      draggable='false'
      className="team-card-member--StyledTeamMemberContainerDiv-0">
      <StyledStyledUserIcon className="team-card-member--StyledStyledUserIcon-0" />
      <StyledCenterTextDiv className="team-card-member--StyledCenterTextDiv-0">
        {memberName}
      </StyledCenterTextDiv>
      <StyledCenterTextDiv
        $levelChar={levelChar}
        className="team-card-member--StyledCenterTextDiv-1">
        {levelChar}
      </StyledCenterTextDiv>
    </StyledTeamMemberContainerDiv>
  );
}