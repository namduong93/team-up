import { FC } from "react";
import { useTheme } from "styled-components";
import { UserNameContainerDiv, UsernameTextSpan, WideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { StandardContainerDiv } from "../../StaffPage/subcomponents/StaffRole";
import { StandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";

export const WideAttendeesHeader: FC = () => {
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
        <StandardSpan>Gender</StandardSpan>
      </StandardContainerDiv>
      
      <StandardContainerDiv>
        <StandardSpan>Role</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>University</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Shirt Size</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Dietary Needs</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Allergies</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Accessibility</StandardSpan>
      </StandardContainerDiv>

    </WideInfoContainerDiv>
  )
}