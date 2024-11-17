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
      className="wide-staff-header--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv className="wide-staff-header--StyledUserNameContainerDiv-0">
        <StyledUsernameTextSpan className="wide-staff-header--StyledUsernameTextSpan-0">Full Name</StyledUsernameTextSpan>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-header--StyledStandardContainerDiv-0">
        <StyledStandardSpan className="wide-staff-header--StyledStandardSpan-0">Role</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-header--StyledStandardContainerDiv-1">
        <StyledStandardSpan className="wide-staff-header--StyledStandardSpan-1">Affiliation</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-header--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-header--StyledStandardSpan-2">Access</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-header--StyledStandardContainerDiv-3">
        <StyledStandardSpan className="wide-staff-header--StyledStandardSpan-3">Email</StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  );
}