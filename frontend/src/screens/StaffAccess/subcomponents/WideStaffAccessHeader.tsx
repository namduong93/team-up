import { FC } from "react";
import { useTheme } from "styled-components";
import { UserNameContainerDiv, UsernameTextSpan, WideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentsPage.styles";
import { StandardContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/StaffRole";
import { StandardSpan } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/WideStaffCard";

export const WideStaffAccessHeader: FC = () => {
  const theme = useTheme();
  return (
    <WideInfoContainerDiv $isHeader={true} style={{
      backgroundColor: theme.colours.userInfoCardHeader,
      fontWeight: 'bold'
    }}>
      <UserNameContainerDiv>
        <UsernameTextSpan>
          Full Name
        </UsernameTextSpan>
      </UserNameContainerDiv>

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
