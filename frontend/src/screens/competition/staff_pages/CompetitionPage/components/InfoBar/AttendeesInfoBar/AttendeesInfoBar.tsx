import { FC, useState } from "react";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { AttendeesDetails } from "../../../../../../../../shared_types/Competition/staff/AttendeesDetails";
import { StyledInfoBarField, StyledLabelSpan, StyledVerticalInfoBarField } from "../TeamInfoBar/TeamInfoBar.styles";
import { StyledProfilePic } from "../../../../../../Account/Account.styles";
import { CompRoles } from "../../../subroutes/StaffPage/subcomponents/CompRoles";
import { backendURL } from "../../../../../../../../config/backendURLConfig";

interface AttendeesInfoProps extends InfoBarProps {
  attendeesDetails: AttendeesDetails;
  attendeesState: [Array<AttendeesDetails>, React.Dispatch<React.SetStateAction<Array<AttendeesDetails>>>];
}

export const AttendeesInfoBar: FC<AttendeesInfoProps> = ({
  attendeesDetails,
  attendeesState: [attendeesList, setAttendeesList],
  isOpenState: [isOpen, setIsOpen],
}) => {

  const [attendeesData, setAttendeesData] = useState(attendeesDetails);

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]}>

      <StyledInfoBarField>
        <StyledLabelSpan>User Id:</StyledLabelSpan>
        <span>{attendeesData.userId}</span>
      </StyledInfoBarField>

      <StyledProfilePic
        style={{ marginBottom: '15px' }}
        $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
      />

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Name:</StyledLabelSpan>
        <span>{attendeesData.name}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Preferred Name:</StyledLabelSpan>
        <span>{attendeesData.preferredName}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Email:</StyledLabelSpan>
        <span>{attendeesData.email}</span>
      </StyledVerticalInfoBarField>

      <StyledInfoBarField>
        <StyledLabelSpan>Gender:</StyledLabelSpan>
        <span>{attendeesData.sex}</span>
      </StyledInfoBarField>

      <StyledInfoBarField>
        <StyledLabelSpan>Shirt Size:</StyledLabelSpan>
        <span>{attendeesData.tshirtSize}</span>
      </StyledInfoBarField>

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Dietary Requirements:</StyledLabelSpan>
        <span>{attendeesData.dietaryNeeds}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Allergies:</StyledLabelSpan>
        <span>{attendeesData.allergies}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Accessibility Needs:</StyledLabelSpan>
        <span>{attendeesData.accessibilityNeeds}</span>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Roles:</StyledLabelSpan>
        <StyledInfoBarField style={{ maxWidth: '130px' }}>
          <CompRoles roles={attendeesData.roles} />
        </StyledInfoBarField>
      </StyledVerticalInfoBarField>

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Site:</StyledLabelSpan>
        <span>{attendeesData.siteName}</span>
      </StyledVerticalInfoBarField>

      <StyledInfoBarField>
        <StyledLabelSpan>Site Capacity:</StyledLabelSpan>
        <span>{attendeesData.siteCapacity}</span>
      </StyledInfoBarField>

      <StyledVerticalInfoBarField>
        <StyledLabelSpan>Pending Site:</StyledLabelSpan>
        <span>{attendeesData.pendingSiteName ? attendeesData.pendingSiteName : 'None'}</span>
      </StyledVerticalInfoBarField>

      <StyledInfoBarField>
        <StyledLabelSpan>Pending Site Capacity:</StyledLabelSpan>
        <span>{attendeesData.pendingSiteCapacity ? attendeesData.pendingSiteCapacity : 'N/A'}</span>
      </StyledInfoBarField>

    </InfoBar>
  )
}
