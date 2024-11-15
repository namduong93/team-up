import { FC, useState } from "react";
import { StaffCardProps } from "./StaffCardProps";
import { Field, StyledStudentInfoContainerDiv } from "../../StudentsPage/subcomponents/StudentInfoCard";
import { StyledNarrowStatusDiv, StyledStaffAccessLevel } from "../StaffPage.styles";
import { CompRoles } from "./CompRoles";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";
import { StaffInfoBar } from "../../../components/InfoBar/StaffInfoBar/StaffInfoBar";


export const NarrowStaffCard: FC<StaffCardProps> = ({
  staffDetails,
  staffListState: [staffList, setStaffList],
  ...props
}) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return (
    <>
      <StaffInfoBar
        isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
        staffInfo={staffDetails}
        staffListState={[staffList, setStaffList]}
      />
      <StyledStudentInfoContainerDiv
        onDoubleClick={() => setIsInfoBarOpen(true)}
        {...props}
      >
        <Field
          label="Full Name"
          value={staffDetails.name}
          style={{ width: "20%", minWidth: "120px" }}
        />
        <Field
          label="Role"
          value={
            <StyledNarrowStatusDiv>
              <CompRoles
                style={{ width: "100%" }}
                roles={staffDetails.roles as CompetitionRole[]}
              />
            </StyledNarrowStatusDiv>
          }
          style={{ width: "20%", minWidth: "125px" }}
        />
        <Field
          label="Affiliation"
          value={staffDetails.universityName}
          style={{
            width: "20%",
            minWidth: "170px",
            whiteSpace: "break-spaces",
          }}
        />
        <Field
          label="Access"
          value={
            <StyledNarrowStatusDiv>
              <StyledStaffAccessLevel $access={staffDetails.access as StaffAccess}>
                {staffDetails.access}
              </StyledStaffAccessLevel>
            </StyledNarrowStatusDiv>
          }
          style={{ width: "20%", minWidth: "125px" }}
        />
        <Field
          label="Email"
          value={staffDetails.email}
          style={{ width: "25%", minWidth: "170px" }}
        />

        <div style={{ display: "flex" }}></div>
      </StyledStudentInfoContainerDiv>
    </>
  );
};
