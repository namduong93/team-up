import { FC } from "react";
import { useTheme } from "styled-components";
import { StyledUserNameContainerDiv, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "../../StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";

export const WideAttendeesHeader: FC = () => {
  const theme = useTheme();
  return (
    <StyledWideInfoContainerDiv
      $isHeader
      style={{
        backgroundColor: theme.colours.userInfoCardHeader,
        fontWeight: 'bold'
      }}
      data-test-id="wide-attendees-header--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv data-test-id="wide-attendees-header--StyledUserNameContainerDiv-0">
        <StyledUsernameTextSpan data-test-id="wide-attendees-header--StyledUsernameTextSpan-0">Full Name</StyledUsernameTextSpan>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-header--StyledStandardContainerDiv-0">
        <StyledStandardSpan data-test-id="wide-attendees-header--StyledStandardSpan-0">Gender</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-header--StyledStandardContainerDiv-1">
        <StyledStandardSpan data-test-id="wide-attendees-header--StyledStandardSpan-1">Role</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-header--StyledStandardContainerDiv-2">
        <StyledStandardSpan data-test-id="wide-attendees-header--StyledStandardSpan-2">University</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-header--StyledStandardContainerDiv-3">
        <StyledStandardSpan data-test-id="wide-attendees-header--StyledStandardSpan-3">Shirt Size</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-header--StyledStandardContainerDiv-4">
        <StyledStandardSpan data-test-id="wide-attendees-header--StyledStandardSpan-4">Dietary Needs</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-header--StyledStandardContainerDiv-5">
        <StyledStandardSpan data-test-id="wide-attendees-header--StyledStandardSpan-5">Allergies</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-header--StyledStandardContainerDiv-6">
        <StyledStandardSpan data-test-id="wide-attendees-header--StyledStandardSpan-6">Accessibility</StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  );
}