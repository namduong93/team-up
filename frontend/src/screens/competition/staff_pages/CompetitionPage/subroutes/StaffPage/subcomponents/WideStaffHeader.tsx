import { FC } from "react";
import { useTheme } from "styled-components";
import { UserNameContainerDiv, UsernameTextSpan, WideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { StandardContainerDiv } from "./StaffRole";
import { StandardSpan } from "./WideStaffCard";

export const WideStaffHeader: FC = () => {
  const theme = useTheme();
  return (
    <WideInfoContainerDiv $isHeader style={{
      backgroundColor: theme.colours.userInfoCardHeader,
      fontWeight: 'bold'
    }}>
      <UserNameContainerDiv>
        <UsernameTextSpan>
          Full Name
        </UsernameTextSpan>
      </UserNameContainerDiv>
      
      <StandardContainerDiv>
        <StandardSpan>Role</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Affiliation</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Access</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Email</StandardSpan>
      </StandardContainerDiv>


    </WideInfoContainerDiv>
  )
}