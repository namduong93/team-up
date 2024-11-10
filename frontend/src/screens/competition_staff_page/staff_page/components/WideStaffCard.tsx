import { FC, useState } from "react";
import { UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideInfoContainerDiv } from "../../students_page/StudentDisplay";
import styled, { useTheme } from "styled-components";
import { StaffAccessLevel, StaffCardProps } from "../StaffDisplay";
import { StaffRoles, StandardContainerDiv } from "./StaffRole";
import { StaffInfoBar } from "../../components/InfoBar/StaffInfoBar";


export const StandardSpan = styled.span``;


export const WideStaffHeader: FC = () => {
  const theme = useTheme();
  return (
    <WideInfoContainerDiv style={{
      backgroundColor: theme.colours.sidebarBackground,
      color: theme.fonts.colour,
      fontWeight: 'bold'
    }}>
      <UserNameContainerDiv>
        <UsernameTextSpan>
          Full Name
        </UsernameTextSpan>
      </UserNameContainerDiv>
      
      <StandardContainerDiv>
        <StandardSpan>Role</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Affiliation</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Access</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Email</StandardSpan>
      </StandardContainerDiv>


    </WideInfoContainerDiv>
  )
}

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
          <StaffRoles roles={staffDetails.roles} />
        </StandardContainerDiv>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>
          {staffDetails.universityName}
        </StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StaffAccessLevel $access={staffDetails.access}>
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