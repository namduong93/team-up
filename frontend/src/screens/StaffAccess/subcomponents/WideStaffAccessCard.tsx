import { FC } from "react";
import { StaffAccessCardProps } from "../StaffAccessPage";
import { UserAccess } from "../../../../shared_types/User/User";
import { StaffRequests } from "../../../../shared_types/Competition/staff/StaffInfo";
import { sendRequest } from "../../../utility/request";
import { StyledStandardSpan } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/WideStaffCard";
import { AccessDropdown } from "./AccessDropdown";
import {
  StyledUserIcon,
  StyledUserNameContainerDiv,
  StyledUserNameGrid,
  StyledUsernameTextSpan,
  StyledWideInfoContainerDiv,
} from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentsPage.styles";
import { StyledStandardContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/subcomponents/CompRoles";

/**
 * A React component that displays detailed information about a staff member on a wider display
 *
 * The `WideStaffAccessCard` component shows staff member details such as their name, university affiliation,
 * email, and current access level. It also provides a dropdown menu for changing the staff member's access level.
 *
 * @param {StaffAccessCardProps} props - React StaffAccessCardProps, including:
 * staffDetails, which is the details of the staff member and staffListState, which manages the list.
 * @returns {JSX.Element} - A UI component displaying staff details with the ability to modify their access on a
 * wider displat.
 */
export const WideStaffAccessCard: FC<StaffAccessCardProps> = ({
  staffDetails,
  staffListState: [staffList, setStaffList],
  ...props
}) => {
  const handleAccessChange = async (
    userId: number | undefined,
    newAccess: UserAccess
  ) => {
    const staffRequests: Array<StaffRequests> = [];
    if (userId) {
      staffRequests.push({ userId: userId, access: newAccess });
      try {
        await sendRequest.post("/user/staff_requests", { staffRequests });
        const userIndex = staffList.findIndex(
          (staff) => staff.userId === userId
        );
        setStaffList([
          ...staffList.slice(0, userIndex),
          { ...staffList[userIndex], userAccess: newAccess },
          ...staffList.slice(userIndex + 1),
        ]);
      } catch (error) {
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
            <StyledUsernameTextSpan>{staffDetails.name}</StyledUsernameTextSpan>
          </StyledUserNameGrid>
        </StyledUserNameContainerDiv>

        <StyledStandardContainerDiv>
          <StyledStandardSpan>{staffDetails.universityName}</StyledStandardSpan>
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <AccessDropdown
            staffId={staffDetails.userId}
            currentAccess={staffDetails.userAccess}
            onChange={(newAccess) =>
              handleAccessChange(staffDetails.userId, newAccess)
            }
          />
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <StyledStandardSpan>{staffDetails.email}</StyledStandardSpan>
        </StyledStandardContainerDiv>
      </StyledWideInfoContainerDiv>
    </>
  );
};
