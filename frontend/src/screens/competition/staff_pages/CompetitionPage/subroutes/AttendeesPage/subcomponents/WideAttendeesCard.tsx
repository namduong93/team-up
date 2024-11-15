import { FC, useState } from "react";
import { AttendeesCardProps } from "./AttendeesCardProps";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { StaffRoles, StyledStandardContainerDiv } from "../../StaffPage/subcomponents/StaffRole";
import { StyledStandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";
import { StyledBooleanStatus } from "./BooleanStatus";
import { AttendeesInfoBar } from "../../../components/InfoBar/AttendeesInfoBar/AttendeesInfoBar";

export const WideAttendeesCard: FC<AttendeesCardProps> = ({
  attendeesDetails,
  attendeesListState: [attendeesList, setAttendeesList],
  ...props
}) => {

  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return (<>
    <AttendeesInfoBar
      attendeesState={[attendeesList, setAttendeesList]}
      attendeesDetails={attendeesDetails}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
    />
    <StyledWideInfoContainerDiv onDoubleClick={() => setIsInfoBarOpen((p) => !p)} {...props}>

      <StyledUserNameContainerDiv>
        <StyledUserNameGrid>
          <StyledUserIcon />
          <StyledUsernameTextSpan>
            {attendeesDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>{attendeesDetails.sex}</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StaffRoles roles={attendeesDetails.roles} />

      <StyledStandardContainerDiv>
        <StyledStandardSpan>{attendeesDetails.universityName}</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>{attendeesDetails.tshirtSize}</StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledBooleanStatus $toggled={!!attendeesDetails.dietaryNeeds}>
          {/* {!!attendeesDetails.dietaryNeeds ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledBooleanStatus $toggled={!!attendeesDetails.allergies}>
          {/* {!!attendeesDetails.allergies ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledBooleanStatus $toggled={!!attendeesDetails.accessibilityNeeds}>
            {/* {!!attendeesDetails.accessibilityNeeds ? 'Yes' : 'No'} */}
        </StyledBooleanStatus>
      </StyledStandardContainerDiv>

    </StyledWideInfoContainerDiv>
  </>)
}