import { FC, useState } from "react";
import styled from "styled-components";
import { StaffCardProps } from "./StaffCardProps";
import { UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideInfoContainerDiv } from "../../StudentsPage/StudentsPage.styles";
import { StaffRoles, StandardContainerDiv } from "./StaffRole";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";
import { StaffAccessLevel } from "../StaffPage.styles";
import { StaffInfoBar } from "../../../components/InfoBar/StaffInfoBar/StaffInfoBar";

export const StandardSpan = styled.span``;

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
    <WideInfoContainerDiv onDoubleClick={() => setIsInfoBarOpen(true)} {...props}>
      <UserNameContainerDiv>
        <UserNameGrid>
          <UserIcon />
          <UsernameTextSpan>
            {staffDetails.name}
          </UsernameTextSpan>
        </UserNameGrid>
      </UserNameContainerDiv>

      <StandardContainerDiv style={{ overflow: 'visible' }}>
        <StandardContainerDiv style={{ maxWidth: '90%', overflow: 'visible' }}>
          <StaffRoles roles={staffDetails.roles as CompetitionRole[]} />
        </StandardContainerDiv>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>
          {staffDetails.universityName}
        </StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StaffAccessLevel $access={staffDetails.access as StaffAccess}>
          {staffDetails.access}
        </StaffAccessLevel>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>
          {staffDetails.email}
        </StandardSpan>
      </StandardContainerDiv>


    </WideInfoContainerDiv>
  </>);
}