import { FC } from "react";
import { useTheme } from "styled-components";
import { StyledUserNameContainerDiv, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "./CompRoles";
import { StyledStandardSpan } from "./WideStaffCard";

export const WideStaffHeader: FC = () => {
  const theme = useTheme();
  return (
    <StyledWideInfoContainerDiv
      $isHeader
      style={{
        backgroundColor: theme.colours.userInfoCardHeader,
        fontWeight: 'bold'
      }}
      data-test-id="wide-staff-header--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv data-test-id="wide-staff-header--StyledUserNameContainerDiv-0">
        <StyledUsernameTextSpan data-test-id="wide-staff-header--StyledUsernameTextSpan-0">Full Name</StyledUsernameTextSpan>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-header--StyledStandardContainerDiv-0">
        <StyledStandardSpan data-test-id="wide-staff-header--StyledStandardSpan-0">Role</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-header--StyledStandardContainerDiv-1">
        <StyledStandardSpan data-test-id="wide-staff-header--StyledStandardSpan-1">Affiliation</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-header--StyledStandardContainerDiv-2">
        <StyledStandardSpan data-test-id="wide-staff-header--StyledStandardSpan-2">Access</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-header--StyledStandardContainerDiv-3">
        <StyledStandardSpan data-test-id="wide-staff-header--StyledStandardSpan-3">Email</StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  );
}