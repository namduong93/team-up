import { FC, useState } from "react";
import styled from "styled-components";
import { StaffCardProps } from "./StaffCardProps";
import { StyledUserIcon, StyledUserNameContainerDiv, StyledUserNameGrid, StyledUsernameTextSpan, StyledWideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { CompRoles, StyledStandardContainerDiv } from "./CompRoles";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";
import { StyledStaffAccessLevel } from "../StaffPage.styles";
import { StaffInfoBar } from "../../../components/InfoBar/StaffInfoBar/StaffInfoBar";

export const StyledStandardSpan = styled.span``;

export const WideStaffCard: FC<StaffCardProps> = ({
  staffDetails, staffListState: [staffList, setStaffList],
  ...props  }) => {

  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return <>
    <StaffInfoBar
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
      staffInfo={staffDetails}
      staffListState={[staffList, setStaffList]}
    />
    <StyledWideInfoContainerDiv
      onDoubleClick={() => setIsInfoBarOpen(true)}
      {...props}
      data-test-id="wide-staff-card--StyledWideInfoContainerDiv-0">
      <StyledUserNameContainerDiv data-test-id="wide-staff-card--StyledUserNameContainerDiv-0">
        <StyledUserNameGrid data-test-id="wide-staff-card--StyledUserNameGrid-0">
          <StyledUserIcon data-test-id="wide-staff-card--StyledUserIcon-0" />
          <StyledUsernameTextSpan data-test-id="wide-staff-card--StyledUsernameTextSpan-0">
            {staffDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>
      <StyledStandardContainerDiv
        style={{ overflow: 'visible' }}
        data-test-id="wide-staff-card--StyledStandardContainerDiv-0">
        <StyledStandardContainerDiv
          style={{ maxWidth: '90%', overflow: 'visible' }}
          data-test-id="wide-staff-card--StyledStandardContainerDiv-1">
          <CompRoles roles={staffDetails.roles as CompetitionRole[]} />
        </StyledStandardContainerDiv>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-card--StyledStandardContainerDiv-2">
        <StyledStandardSpan data-test-id="wide-staff-card--StyledStandardSpan-0">
          {staffDetails.universityName}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-card--StyledStandardContainerDiv-3">
        <StyledStaffAccessLevel
          $access={staffDetails.access as StaffAccess}
          data-test-id="wide-staff-card--StyledStaffAccessLevel-0">
          {staffDetails.access}
        </StyledStaffAccessLevel>
      </StyledStandardContainerDiv>
      <StyledStandardContainerDiv data-test-id="wide-staff-card--StyledStandardContainerDiv-4">
        <StyledStandardSpan data-test-id="wide-staff-card--StyledStandardSpan-1">
          {staffDetails.email}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>
    </StyledWideInfoContainerDiv>
  </>;
}