import { FC, useState } from "react";
import { AttendeesCardProps } from "./AttendeesCardProps";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentPage.styles";
import { CompRoles, StyledStandardContainerDiv } from "../../StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";
import { StyledBooleanStatus } from "./BooleanStatus";
import { AttendeesInfoBar } from "../../../components/InfoBar/AttendeesInfoBar/AttendeesInfoBar";

export const WideAttendeesCard: FC<AttendeesCardProps> = ({
  attendeesDetails,
  attendeesListState: [attendeesList, setAttendeesList],
  ...props
}) => {

  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return <>
    <AttendeesInfoBar
      attendeesState={[attendeesList, setAttendeesList]}
      attendeesDetails={attendeesDetails}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
    />
    <StyledWideInfoContainerDiv
      onDoubleClick={() => setIsInfoBarOpen((p) => !p)}
      {...props}
      className="wide-attendees-card--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv className="wide-attendees-card--StyledUserNameContainerDiv-0">
        <StyledUserNameGrid className="wide-attendees-card--StyledUserNameGrid-0">
          <StyledUserIcon className="wide-attendees-card--StyledUserIcon-0" />
          <StyledUsernameTextSpan className="wide-attendees-card--StyledUsernameTextSpan-0">
            {attendeesDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-0">
        <StyledStandardSpan className="wide-attendees-card--StyledStandardSpan-0">{attendeesDetails.sex}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <CompRoles roles={attendeesDetails.roles} />
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-1">
        <StyledStandardSpan className="wide-attendees-card--StyledStandardSpan-1">{attendeesDetails.universityName}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan className="wide-attendees-card--StyledStandardSpan-2">{attendeesDetails.tshirtSize}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-3">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.dietaryNeeds}
          className="wide-attendees-card--StyledBooleanStatus-0">
          {/* {!!attendeesDetails.dietaryNeeds ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-4">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.allergies}
          className="wide-attendees-card--StyledBooleanStatus-1">
          {/* {!!attendeesDetails.allergies ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv className="wide-attendees-card--StyledStandardContainerDiv-5">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.accessibilityNeeds}
          className="wide-attendees-card--StyledBooleanStatus-2">
          {/* {!!attendeesDetails.accessibilityNeeds ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  </>;
}