import { FC } from "react";
import { useTheme } from "styled-components";
import { StyledUserNameContainerDiv, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "./StaffRole";
import { StyledStandardSpan } from "./WideStaffCard";

export const WideStaffHeader: FC = () => {
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
  )
}