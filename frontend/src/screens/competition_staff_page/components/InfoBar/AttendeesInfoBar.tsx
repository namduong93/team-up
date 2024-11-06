import { FC, useState } from "react";
import { InfoBar, InfoBarProps } from "./InfoBar";
import { AttendeesDetails } from "../../../../../shared_types/Competition/staff/AttendeesDetails";
import { InfoBarField, LabelSpan } from "./TeamInfoBar";
import { backendURL } from "../../../../../config/backendURLConfig";
import { ProfilePic } from "../../../account/Account";
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

      <InfoBarField>
        <LabelSpan>Name:</LabelSpan>
        <span>{attendeesData.name}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Preferred Name:</LabelSpan>
        <span>{attendeesData.preferredName}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Email:</LabelSpan>
        <span>{attendeesData.email}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Gender:</LabelSpan>
        <span>{attendeesData.sex}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Shirt Size:</LabelSpan>
        <span>{attendeesData.tshirtSize}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Dietary Requirements:</LabelSpan>
        <span>{attendeesData.dietaryNeeds}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Allergies:</LabelSpan>
        <span>{attendeesData.allergies}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Accessibility Needs:</LabelSpan>
        <span>{attendeesData.accessibilityNeeds}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Roles:</LabelSpan>
        <StaffRoles roles={attendeesData.roles} />
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Site:</LabelSpan>
        <span>{attendeesData.siteName}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Site Capacity:</LabelSpan>
        <span>{attendeesData.siteCapacity}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Pending Site:</LabelSpan>
        <span>{attendeesData.pendingSiteName}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Pending Site Capacity:</LabelSpan>
        <span>{attendeesData.pendingSiteCapacity}</span>
      </InfoBarField>

    </InfoBar>
  )
}
