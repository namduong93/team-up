import { FC } from "react";
import { StaffAccessCardProps } from "./StaffAccounts";
import { StandardContainerDiv } from "../competition_staff_page/staff_page/components/StaffRole";
import { UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideInfoContainerDiv } from "../competition_staff_page/students_page/StudentDisplay";
import { StandardSpan } from "../competition_staff_page/staff_page/components/WideStaffCard";
import { useTheme } from "styled-components";
import { AccessDropdown } from "./AccessDropdown";
import { StaffAccess } from "../../../shared_types/Competition/staff/StaffInfo";

export const WideStaffAccessHeader: FC = () => {
  const theme = useTheme();
  return (
    <WideInfoContainerDiv style={{
      backgroundColor: theme.colours.sidebarBackground,
      color: theme.fonts.colour,
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

  const handleAccessChange = async (newAccess: StaffAccess) => {
    console.log(newAccess);

    // TODO: Backend hook to update user's access
  };

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
        <AccessDropdown
          staffId={staffDetails.userId}
          currentAccess={staffDetails.access}
          onChange={(newAccess) => handleAccessChange(newAccess)}
        />
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