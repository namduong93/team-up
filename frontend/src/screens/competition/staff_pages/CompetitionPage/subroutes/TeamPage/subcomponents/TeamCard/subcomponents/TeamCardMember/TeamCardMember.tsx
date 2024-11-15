import { StyledCenterTextDiv, StyledStyledUserIcon, StyledTeamMemberContainerDiv } from "../../TeamCard.styles";

export const TeamCardMember = ({ memberName, level }: { memberName: string, level: string }) => {

  const levelChar = level.slice(-1);

  return (
  <StyledTeamMemberContainerDiv draggable='false'>
    <StyledStyledUserIcon />
    <StyledCenterTextDiv>
      {memberName}
    </StyledCenterTextDiv>
    <StyledCenterTextDiv $levelChar={levelChar} >
      {levelChar}
    </StyledCenterTextDiv>
  </StyledTeamMemberContainerDiv>
  );
}