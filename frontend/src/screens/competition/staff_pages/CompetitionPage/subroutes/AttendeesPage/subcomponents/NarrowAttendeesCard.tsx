import { FC, useState } from "react";
import { AttendeesCardProps } from "./AttendeesCardProps";
import { Field, StyledStudentInfoContainerDiv } from "../../StudentsPage/subcomponents/StudentInfoCard";
import { StyledNarrowStatusDiv } from "../../StaffPage/StaffPage.styles";
import { CompRoles } from "../../StaffPage/subcomponents/CompRoles";
import { StyledBooleanStatus } from "./BooleanStatus";
import { AttendeesInfoBar } from "../../../components/InfoBar/AttendeesInfoBar/AttendeesInfoBar";

export const NarrowAttendeesCard: FC<AttendeesCardProps> = ({
  attendeesDetails,
  attendeesListState: [attendeesList, setAttendeesList],
  ...props
}) => {

  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return <>
    <AttendeesInfoBar
      attendeesDetails={attendeesDetails}
      attendeesState={[attendeesList, setAttendeesList]}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
    />
    <StyledStudentInfoContainerDiv
      onDoubleClick={() => setIsInfoBarOpen((p) => !p)}
      {...props}
      className="narrow-attendees-card--StyledStudentInfoContainerDiv-0">
      <Field label="Full Name" value={attendeesDetails.name} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Gender" value={attendeesDetails.sex} style={{ width: '10%', minWidth: '60px' }} />
      <Field label="Role" 
        value={
          <StyledNarrowStatusDiv className="narrow-attendees-card--StyledNarrowStatusDiv-0">
            <CompRoles roles={attendeesDetails.roles} />
          </StyledNarrowStatusDiv>
        }
        style={{ width: '20%', minWidth: '125px' }}
      />
      <Field label="University" value={attendeesDetails.universityName} style={{ width: '20%', minWidth: '170px', whiteSpace: 'break-spaces' }} />
      {/* <Field label="Email" value={attendeesDetails.email} style={{ width: '25%', minWidth: '170px' }} /> */}
      <Field label="Shirt Size" value={attendeesDetails.tshirtSize} style={{ width: '20%', minWidth: '170px' }} />
      <Field label="Dietary Needs" style={{ width: '10%', minWidth: '90px' }}
        value={
          <StyledNarrowStatusDiv className="narrow-attendees-card--StyledNarrowStatusDiv-1">
            <StyledBooleanStatus
              $toggled={!!attendeesDetails.dietaryNeeds}
              className="narrow-attendees-card--StyledBooleanStatus-0">
              {/* {!!attendeesDetails.dietaryNeeds ? 'Yes' : 'No'} */}
            </StyledBooleanStatus>
          </StyledNarrowStatusDiv>
        }
      />
      <Field label="Allergies" style={{ width: '10%', minWidth: '90px' }}
        value={
          <StyledNarrowStatusDiv className="narrow-attendees-card--StyledNarrowStatusDiv-2">
            <StyledBooleanStatus
              $toggled={!!attendeesDetails.allergies}
              className="narrow-attendees-card--StyledBooleanStatus-1">
              {/* {!!attendeesDetails.allergies ? 'Yes' : 'No'} */}
            </StyledBooleanStatus>
          </StyledNarrowStatusDiv>
        }
      />
      <Field label="Accessibility" style={{ width: '10%', minWidth: '90px' }}
        value={
          <StyledNarrowStatusDiv className="narrow-attendees-card--StyledNarrowStatusDiv-3">
            <StyledBooleanStatus
              $toggled={!!attendeesDetails.accessibilityNeeds}
              className="narrow-attendees-card--StyledBooleanStatus-2">
              {/* {!!attendeesDetails.accessibilityNeeds ? 'Yes' : 'No'} */}
            </StyledBooleanStatus>
          </StyledNarrowStatusDiv>
        }
      />
      <div style={{ display: 'flex' }}>
        
      </div>
    </StyledStudentInfoContainerDiv>
  </>;
}