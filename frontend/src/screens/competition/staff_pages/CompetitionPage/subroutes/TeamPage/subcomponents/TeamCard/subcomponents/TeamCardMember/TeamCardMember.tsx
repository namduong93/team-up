import {
  StyledCenterTextDiv,
  StyledStyledUserIcon,
  StyledTeamMemberContainerDiv,
} from "../../TeamCard.styles";

/**
 * A React component that displays a team member's name and their level in a styled card format.
 * The component also displays the last character of the level
 *
 * @param {string} props.memberName - The name of the team member.
 * @param {string} props.level - The level associated with the team member.
 * @returns {JSX.Element} - A styled component that represents a team member with their name and level.
 */
export const TeamCardMember = ({
  memberName,
  level,
}: {
  memberName: string;
  level: string;
}) => {
  const levelChar = level.slice(-1);

  return (
    <StyledTeamMemberContainerDiv draggable="false">
      <StyledStyledUserIcon />
      <StyledCenterTextDiv>{memberName}</StyledCenterTextDiv>
      <StyledCenterTextDiv $levelChar={levelChar}>
        {levelChar}
      </StyledCenterTextDiv>
    </StyledTeamMemberContainerDiv>
  );
};
