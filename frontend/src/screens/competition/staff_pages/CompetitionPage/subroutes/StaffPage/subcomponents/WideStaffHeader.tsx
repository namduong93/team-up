import { FC } from "react";
import { useTheme } from "styled-components";
import {
  StyledUserNameContainerDiv,
  StyledUsernameTextSpan,
  StyledWideInfoContainerDiv,
} from "../../StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "./CompRoles";
import { StyledStandardSpan } from "./WideStaffCard";

/**
 * A React functional component for rendering the header row in the wide staff information table.
 *
 * The `WideStaffHeader` component displays column headers for the wide staff information card,
 * including labels for "Full Name," "Role," "Affiliation," "Access," and "Email."
 *
 * @returns {JSX.Element} - A styled header row component for the wide staff information table
 */
export const WideStaffHeader: FC = () => {
  const theme = useTheme();
  return (
    <StyledWideInfoContainerDiv
      $isHeader
      style={{
        backgroundColor: theme.colours.userInfoCardHeader,
        fontWeight: "bold",
      }}
    >
      <StyledUserNameContainerDiv>
        <StyledUsernameTextSpan>Full Name</StyledUsernameTextSpan>
      </StyledUserNameContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Role</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Affiliation</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Access</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Email</StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  );
};
