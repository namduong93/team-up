import { FC, useState } from "react";
import { AttendeesCardProps } from "./AttendeesCardProps";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
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
      data-test-id="wide-attendees-card--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv data-test-id="wide-attendees-card--StyledUserNameContainerDiv-0">
        <StyledUserNameGrid data-test-id="wide-attendees-card--StyledUserNameGrid-0">
          <StyledUserIcon data-test-id="wide-attendees-card--StyledUserIcon-0" />
          <StyledUsernameTextSpan data-test-id="wide-attendees-card--StyledUsernameTextSpan-0">
            {attendeesDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-card--StyledStandardContainerDiv-0">
        <StyledStandardSpan data-test-id="wide-attendees-card--StyledStandardSpan-0">{attendeesDetails.sex}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <CompRoles roles={attendeesDetails.roles} />
      <StyledStandardContainerDiv data-test-id="wide-attendees-card--StyledStandardContainerDiv-1">
        <StyledStandardSpan data-test-id="wide-attendees-card--StyledStandardSpan-1">{attendeesDetails.universityName}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan data-test-id="wide-attendees-card--StyledStandardSpan-2">{attendeesDetails.tshirtSize}</StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-card--StyledStandardContainerDiv-3">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.dietaryNeeds}
          data-test-id="wide-attendees-card--StyledBooleanStatus-0">
          {/* {!!attendeesDetails.dietaryNeeds ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-card--StyledStandardContainerDiv-4">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.allergies}
          data-test-id="wide-attendees-card--StyledBooleanStatus-1">
          {/* {!!attendeesDetails.allergies ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-attendees-card--StyledStandardContainerDiv-5">
        <StyledBooleanStatus
          $toggled={!!attendeesDetails.accessibilityNeeds}
          data-test-id="wide-attendees-card--StyledBooleanStatus-2">
          {/* {!!attendeesDetails.accessibilityNeeds ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  </>;
}