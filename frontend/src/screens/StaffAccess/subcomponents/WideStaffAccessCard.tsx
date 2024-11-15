import { FC } from "react";
import { StaffAccessCardProps } from "../StaffAccounts";
import { UserAccess } from "../../../../shared_types/User/User";
import { StaffRequests } from "../../../../shared_types/Competition/staff/StaffInfo";
import { sendRequest } from "../../../utility/request";
// import { UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentsPage.styles";
import { StyledStandardSpan } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/WideStaffCard";
import { AccessDropdown } from "./AccessDropdown";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/StaffRole";

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
    <StyledWideInfoContainerDiv {...props}>
      <StyledUserNameContainerDiv>
        <StyledUserNameGrid>
          <StyledUserIcon />
          <StyledUsernameTextSpan>
            {staffDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>
          {staffDetails.universityName}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <AccessDropdown
          staffId={staffDetails.userId}
          currentAccess={staffDetails.userAccess}
          onChange={(newAccess) => handleAccessChange(staffDetails.userId, newAccess)}
        />
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>
          {staffDetails.email}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>


    </StyledWideInfoContainerDiv>
  </>
  );
}