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

  return (<>
    <StaffInfoBar
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
      staffInfo={staffDetails}
      staffListState={[staffList, setStaffList]}
    />
    <StyledWideInfoContainerDiv onDoubleClick={() => setIsInfoBarOpen(true)} {...props}>
      <StyledUserNameContainerDiv>
        <StyledUserNameGrid>
          <StyledUserIcon />
          <StyledUsernameTextSpan>
            {staffDetails.name}
          </StyledUsernameTextSpan>
        </StyledUserNameGrid>
      </StyledUserNameContainerDiv>

      <StyledStandardContainerDiv style={{ overflow: 'visible' }}>
        <StyledStandardContainerDiv style={{ maxWidth: '90%', overflow: 'visible' }}>
          <CompRoles roles={staffDetails.roles as CompetitionRole[]} />
        </StyledStandardContainerDiv>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>
          {staffDetails.universityName}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStaffAccessLevel $access={staffDetails.access as StaffAccess}>
          {staffDetails.access}
        </StyledStaffAccessLevel>
      </StyledStandardContainerDiv>

      <StyledStandardContainerDiv>
        <StyledStandardSpan>
          {staffDetails.email}
        </StyledStandardSpan>
      </StyledStandardContainerDiv>


    </StyledWideInfoContainerDiv>
  </>);
}