import { FC, useState } from "react";
import { InfoBar, InfoBarProps } from "./InfoBar";
import { AttendeesDetails } from "../../../../../shared_types/Competition/staff/AttendeesDetails";
import { InfoBarField, LabelSpan, VerticalInfoBarField } from "./TeamInfoBar";
import { backendURL } from "../../../../../config/backendURLConfig";
import { ProfilePic } from "../../../Account/Account";
import { StaffRoles } from "../../staff_page/components/StaffRole";

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

      <InfoBarField>
        <LabelSpan>User Id:</LabelSpan>
        <span>{attendeesData.userId}</span>
      </InfoBarField>

      <ProfilePic
        style={{ marginBottom: '15px' }}
        $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
      />

      <VerticalInfoBarField>
        <LabelSpan>Name:</LabelSpan>
        <span>{attendeesData.name}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Preferred Name:</LabelSpan>
        <span>{attendeesData.preferredName}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Email:</LabelSpan>
        <span>{attendeesData.email}</span>
      </VerticalInfoBarField>

      <InfoBarField>
        <LabelSpan>Gender:</LabelSpan>
        <span>{attendeesData.sex}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Shirt Size:</LabelSpan>
        <span>{attendeesData.tshirtSize}</span>
      </InfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Dietary Requirements:</LabelSpan>
        <span>{attendeesData.dietaryNeeds}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Allergies:</LabelSpan>
        <span>{attendeesData.allergies}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Accessibility Needs:</LabelSpan>
        <span>{attendeesData.accessibilityNeeds}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Roles:</LabelSpan>
        <InfoBarField style={{ maxWidth: '130px' }}>
          <StaffRoles roles={attendeesData.roles} />
        </InfoBarField>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Site:</LabelSpan>
        <span>{attendeesData.siteName}</span>
      </VerticalInfoBarField>

      <InfoBarField>
        <LabelSpan>Site Capacity:</LabelSpan>
        <span>{attendeesData.siteCapacity}</span>
      </InfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Pending Site:</LabelSpan>
        <span>{attendeesData.pendingSiteName ? attendeesData.pendingSiteName : 'None'}</span>
      </VerticalInfoBarField>

      <InfoBarField>
        <LabelSpan>Pending Site Capacity:</LabelSpan>
        <span>{attendeesData.pendingSiteCapacity ? attendeesData.pendingSiteCapacity : 'N/A'}</span>
      </InfoBarField>

    </InfoBar>
  )
}
