import { FC } from "react";
import { useTheme } from "styled-components";
import { StyledUserNameContainerDiv, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/WideStaffCard";

export const WideStaffAccessHeader: FC = () => {
  const theme = useTheme();
  return (
    <StyledWideInfoContainerDiv $isHeader={true} style={{
      backgroundColor: theme.colours.userInfoCardHeader,
      fontWeight: 'bold'
    }}>
      <StyledUserNameContainerDiv>
        <StyledUsernameTextSpan>
          Full Name
        </StyledUsernameTextSpan>
      </StyledUserNameContainerDiv>

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
  )
}
