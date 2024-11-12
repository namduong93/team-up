import { FC } from "react";
import { StaffAccessCardProps } from "./StaffAccounts";
import { StandardContainerDiv } from "../competition_staff_page/staff_page/components/StaffRole";
import { UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideInfoContainerDiv } from "../competition_staff_page/students_page/StudentDisplay";
import { StandardSpan } from "../competition_staff_page/staff_page/components/WideStaffCard";
import { useTheme } from "styled-components";
import { AccessDropdown } from "./AccessDropdown";
import { UserAccess } from "../../../shared_types/User/User";
import { sendRequest } from "../../utility/request";
import { StaffRequests } from "../../../shared_types/Competition/staff/StaffInfo";

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
  staffListState: [staffList, setStaffList],
  ...props  }) => {

  const handleAccessChange = async (userId: number | undefined, newAccess: UserAccess) => {
    const staffRequests : Array<StaffRequests> = [];
    if(userId) {
      staffRequests.push({ userId: userId, access: newAccess });
      try {
        await sendRequest.post("/user/staff_requests", { staffRequests });
        const userIndex = staffList.findIndex((staff) => staff.userId === userId);
        setStaffList([
          ...staffList.slice(0, userIndex),
          { ...staffList[userIndex], userAccess: newAccess },
          ...staffList.slice(userIndex + 1)
        ]);
      }
      catch (error) {
        console.error(error);
      }
    }
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
          currentAccess={staffDetails.userAccess}
          onChange={(newAccess) => handleAccessChange(staffDetails.userId, newAccess)}
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