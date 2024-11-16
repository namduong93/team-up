import { FC } from "react";
import { useTheme } from "styled-components";
import { StyledUserNameContainerDiv, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/WideStaffCard";

export const WideStaffAccessHeader: FC = () => {
  const theme = useTheme();
  return (
    <StyledWideInfoContainerDiv
      $isHeader={true}
      style={{
        backgroundColor: theme.colours.userInfoCardHeader,
        fontWeight: 'bold'
      }}
      data-test-id="wide-staff-access-header--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv data-test-id="wide-staff-access-header--StyledUserNameContainerDiv-0">
        <StyledUsernameTextSpan data-test-id="wide-staff-access-header--StyledUsernameTextSpan-0">Full Name</StyledUsernameTextSpan>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-access-header--StyledStandardContainerDiv-0">
        <StyledStandardSpan data-test-id="wide-staff-access-header--StyledStandardSpan-0">Affiliation</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-access-header--StyledStandardContainerDiv-1">
        <StyledStandardSpan data-test-id="wide-staff-access-header--StyledStandardSpan-1">Access</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-access-header--StyledStandardContainerDiv-2">
        <StyledStandardSpan data-test-id="wide-staff-access-header--StyledStandardSpan-2">Email</StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  );
}
