import { CenterTextDiv, StyledUserIcon, TeamMemberContainerDiv } from "../../TeamCard.styles";

export const TeamCardMember = ({ memberName, level }: { memberName: string, level: string }) => {

  const levelChar = level.slice(-1);

  return (
  <TeamMemberContainerDiv draggable='false'>
    <StyledUserIcon />
    <CenterTextDiv>
      {memberName}
    </CenterTextDiv>
    <CenterTextDiv $levelChar={levelChar} >
      {levelChar}
    </CenterTextDiv>
  </TeamMemberContainerDiv>
  );
}