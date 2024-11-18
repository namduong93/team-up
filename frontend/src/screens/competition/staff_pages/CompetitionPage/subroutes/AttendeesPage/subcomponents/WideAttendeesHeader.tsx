import { FC } from "react";
import { useTheme } from "styled-components";
import {
  StyledUserNameContainerDiv,
  StyledUsernameTextSpan,
  StyledWideInfoContainerDiv,
} from "../../StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "../../StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";

/**
 * A React component for rendering the header of the wide attendee information display.
 *
 * The `WideAttendeesHeader` component is responsible for rendering the column headers for the attendee information
 * section, which includes Full Name, Gender, Role, University, Shirt Size, Dietary Needs, Allergies, and Accessibility.
 * The headers are styled with bold text and background color taken from the theme's `userInfoCardHeader` color.
 *
 * @returns {JSX.Element} - A UI component displaying the header row with attendee categories in a styled container.
 */
export const WideAttendeesHeader: FC = () => {
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
        <StyledStandardSpan>Gender</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Role</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>University</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Shirt Size</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Dietary Needs</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Allergies</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>Accessibility</StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  );
};
