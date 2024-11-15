import { FC } from "react";
import { useTheme } from "styled-components";
import { StyledUserNameContainerDiv, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "../../StaffPage/subcomponents/StaffRole";
import { StyledStandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";

export const WideAttendeesHeader: FC = () => {
  const theme = useTheme();
  return (
    <StyledWideInfoContainerDiv $isHeader style={{
      backgroundColor: theme.colours.userInfoCardHeader,
      fontWeight: 'bold'
    }}>
      <StyledUserNameContainerDiv>
        <StyledUsernameTextSpan>
          Full Name
        </StyledUsernameTextSpan>
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
  )
}