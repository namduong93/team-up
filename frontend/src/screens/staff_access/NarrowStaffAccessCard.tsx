import { FC } from "react";
import { Field, StudentInfoContainerDiv } from "../competition_staff_page/students_page/components/StudentInfoCard";
import { StaffAccessCardProps } from "./StaffAccounts";
import { NarrowStatusDiv } from "../competition_staff_page/staff_page/StaffDisplay";
import { AccessDropdown } from "./AccessDropdown";
import { StaffAccess } from "../../../shared_types/Competition/staff/StaffInfo";

export const NarrowStaffAccessCard: FC<StaffAccessCardProps> = ({
  staffDetails,
  ...props
}) => {

  const handleAccessChange = async (newAccess: StaffAccess) => {
    console.log(newAccess);
    
    // TODO: Backend hook to update user's staff access
  };

  return (
    <StudentInfoContainerDiv {...props}>
      <Field label="Full Name" value={staffDetails.name} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Affiliation" value={staffDetails.universityName} style={{ width: '20%', minWidth: '170px', whiteSpace: 'break-spaces' }} />
      <Field
        label="Access"
        value={
          <NarrowStatusDiv>
            <AccessDropdown
              currentAccess={staffDetails.access}
              onChange={(newAccess) => handleAccessChange(newAccess)}
            />
          </NarrowStatusDiv>
        }
        style={{ width: '20%', minWidth: '125px' }}
      />
      <Field label="Email" value={staffDetails.email} style={{ width: '25%', minWidth: '170px' }} />
      <div style={{ display: 'flex' }}></div>
    </StudentInfoContainerDiv>
  );
};
