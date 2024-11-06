import { FC } from "react";
import {
  NarrowStatusDiv,
  StaffAccessLevel,
  StaffCardProps,
} from "../StaffDisplay";
import {
  Field,
  StudentInfoContainerDiv,
} from "../../students_page/components/StudentInfoCard";
// import { CompetitionRole } from "../../CompetitionPage"
import { StaffRoleDisplay, StaffRoles } from "./StaffRole";

export const NarrowStaffCard: FC<StaffCardProps> = ({
  staffDetails,
  ...props
}) => {
  return (
    <StudentInfoContainerDiv {...props}>
      <Field
        label="Full Name"
        value={staffDetails.name}
        style={{ width: "20%", minWidth: "120px" }}
      />
      <Field
        label="Role"
        value={
          <NarrowStatusDiv>
            <StaffRoles roles={staffDetails.roles} />
          </NarrowStatusDiv>
        }
        style={{ width: "20%", minWidth: "125px" }}
      />
      <Field
        label="Affiliation"
        value={staffDetails.universityName}
        style={{ width: "20%", minWidth: "170px", whiteSpace: "break-spaces" }}
      />
      <Field
        label="Access"
        value={
          <NarrowStatusDiv>
            <StaffAccessLevel $access={staffDetails.access}>
              {staffDetails.access}
            </StaffAccessLevel>
          </NarrowStatusDiv>
        }
        style={{ width: "20%", minWidth: "125px" }}
      />
      <Field
        label="Email"
        value={staffDetails.email}
        style={{ width: "25%", minWidth: "170px" }}
      />

      <div style={{ display: "flex" }}></div>
    </StudentInfoContainerDiv>
  );
};
