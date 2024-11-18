import { FC, useState } from "react";
import { AttendeesCardProps } from "./AttendeesCardProps";
import {
  StyledUserIcon,
  StyledUserNameContainerDiv,
  StyledUserNameGrid,
  StyledUsernameTextSpan,
  StyledWideInfoContainerDiv,
} from "../../StudentsPage/StudentsPage.styles";
import {
  CompRoles,
  StyledStandardContainerDiv,
} from "../../StaffPage/subcomponents/CompRoles";
import { StyledStandardSpan } from "../../StaffPage/subcomponents/WideStaffCard";
import { StyledBooleanStatus } from "./BooleanStatus";
import { AttendeesInfoBar } from "../../../components/InfoBar/AttendeesInfoBar/AttendeesInfoBar";

/**
 * A React component for displaying attendee information in a compact card format within
 * a competition context.
 *
 * The `WideAttendeesCard` component displays an attendee's details, such as their full name,
 * gender, role, university, T-shirt size, dietary needs, allergies, and accessibility requirements.
 * It includes a feature where double-clicking the card toggles the visibility of the AttendeesInfoBar,
 * which provides additional information about the attendee. The card is styled for wider displays and
 * provides an expanded view of the attendee details.
 *
 * @param {AttendeesCardProps} props - React props containing attendeeDetails, which includes information
 * about the attendee, such as name, gender, role, university, T-shirt size, dietary needs, allergies, and
 * accessibility needs. The component also accepts other props that are passed down to the outermost container
 * element.
 * @returns {JSX.Element} - A UI component that displays the attendee's information in a wider card format display.
 */
export const WideAttendeesCard: FC<AttendeesCardProps> = ({
  attendeesDetails,
  ...props
}) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return (
    <>
      <AttendeesInfoBar
        attendeesDetails={attendeesDetails}
        isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
      />
      <StyledWideInfoContainerDiv
        onDoubleClick={() => setIsInfoBarOpen((p) => !p)}
        {...props}
      >
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

        <CompRoles roles={attendeesDetails.roles} />

        <StyledStandardContainerDiv>
          <StyledStandardSpan>
            {attendeesDetails.universityName}
          </StyledStandardSpan>
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <StyledStandardSpan>{attendeesDetails.tshirtSize}</StyledStandardSpan>
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <StyledBooleanStatus $toggled={!!attendeesDetails.dietaryNeeds}>
          </StyledBooleanStatus>
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <StyledBooleanStatus $toggled={!!attendeesDetails.allergies}>
          </StyledBooleanStatus>
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <StyledBooleanStatus $toggled={!!attendeesDetails.accessibilityNeeds}>
          </StyledBooleanStatus>
        </StyledStandardContainerDiv>
      </StyledWideInfoContainerDiv>
    </>
  );
};
