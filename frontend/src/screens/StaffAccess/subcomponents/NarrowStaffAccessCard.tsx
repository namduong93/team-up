import { FC } from "react";
import { StaffAccessCardProps } from "../StaffAccessPage";
import { UserAccess } from "../../../../shared_types/User/User";
import { sendRequest } from "../../../utility/request";
import { Field, StyledStudentInfoContainerDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StudentsPage/subcomponents/StudentInfoCard";
import { StyledNarrowStatusDiv } from "../../competition/staff_pages/CompetitionPage/subroutes/StaffPage/StaffPage.styles";
import { AccessDropdown } from "./AccessDropdown";

export const NarrowStaffAccessCard: FC<StaffAccessCardProps> = ({
  staffDetails,
  staffListState: [staffList, setStaffList],
  ...props
}) => {

  const handleAccessChange = async (userId: number | undefined, newAccess: UserAccess) => {
    if(userId) {
      try {
        await sendRequest.post("/user/staff_requests", { staffRequests: [{ userId, access: newAccess }] });
        const userIndex = staffList.findIndex((staff) => staff.userId === userId);
        setStaffList([
          ...staffList.slice(0, userIndex),
          { ...staffList[userIndex], userAccess: newAccess },
          ...staffList.slice(userIndex + 1)
        ]);
      }
      catch (error) {
        console.error("Error updating staff access: ", error);
      }
    }
  };

  return (
    <StyledStudentInfoContainerDiv {...props}>
      <Field label="Full Name" value={staffDetails.name} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Affiliation" value={staffDetails.universityName} style={{ width: '20%', minWidth: '170px', whiteSpace: 'break-spaces' }} />
      <Field
        label="Access"
        value={
          <StyledNarrowStatusDiv>
            <AccessDropdown
              staffId={staffDetails.userId}
              currentAccess={staffDetails.userAccess}
              onChange={(newAccess) => handleAccessChange(staffDetails.userId, newAccess)}
            />
          </StyledNarrowStatusDiv>
        }
        style={{ width: '20%', minWidth: '125px' }}
      />
      <Field label="Email" value={staffDetails.email} style={{ width: '25%', minWidth: '170px' }} />
      <div style={{ display: 'flex' }}></div>
    </StyledStudentInfoContainerDiv>
  );
};
