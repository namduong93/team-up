import { FC } from "react";
import { StaffAccessCardProps } from "../StaffAccessPage";
import { UserAccess } from "../../../../shared_types/User/User";
import { StaffRequests } from "../../../../shared_types/Competition/staff/StaffInfo";
import { sendRequest } from "../../../utility/request";
// import { UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentsPage.styles";
import { StyledStandardSpan } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/WideStaffCard";
import { AccessDropdown } from "./AccessDropdown";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentPage.styles";
import { StyledStandardContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/CompRoles";

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

  return <>
    <StyledWideInfoContainerDiv
      {...props}
      className="wide-staff-access-card--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv className="wide-staff-access-card--StyledUserNameContainerDiv-0">
        <StyledUserNameGrid className="wide-staff-access-card--StyledUserNameGrid-0">
          <StyledUserIcon className="wide-staff-access-card--StyledUserIcon-0" />
          <StyledUsernameTextSpan className="wide-staff-access-card--StyledUsernameTextSpan-0">
            {staffDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-0">
        <StyledStandardSpan className="wide-staff-access-card--StyledStandardSpan-0">
          {staffDetails.universityName}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-1">
        <AccessDropdown
          staffId={staffDetails.userId}
          currentAccess={staffDetails.userAccess}
          onChange={(newAccess) => handleAccessChange(staffDetails.userId, newAccess)}
        />
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-staff-access-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-staff-access-card--StyledStandardSpan-1">
          {staffDetails.email}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  </>;
}