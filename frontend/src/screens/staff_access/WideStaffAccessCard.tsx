import { FC, useEffect } from "react";
import { StaffAccessCardProps } from "./StaffAccounts";
import { StaffAccessLevel } from "../competition_staff_page/staff_page/StaffDisplay";
import { StandardContainerDiv } from "../competition_staff_page/staff_page/components/StaffRole";
import { UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideInfoContainerDiv } from "../competition_staff_page/students_page/StudentDisplay";
import { StandardSpan } from "../competition_staff_page/staff_page/components/WideStaffCard";
import { useTheme } from "styled-components";

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

export const WideStaffAccessCard: FC<StaffAccessCardProps> = ({
  staffDetails,
  ...props  }) => {

  useEffect(() => {
    // console.log(staffDetails);
  }, []);

  return (
  <>
    <WideInfoContainerDiv {...props}>
      <UserNameContainerDiv>
        <UserNameGrid>
          <UserIcon />
          <UsernameTextSpan>
            {staffDetails.name}
          </UsernameTextSpan>
        </UserNameGrid>
      </UserNameContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>
          {staffDetails.universityName}
        </StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StaffAccessLevel $access={staffDetails.access}>
          {staffDetails.access}
        </StaffAccessLevel>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>
          {staffDetails.email}
        </StandardSpan>
      </StandardContainerDiv>


    </WideInfoContainerDiv>
  </>
  );
}