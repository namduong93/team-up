import styled from "styled-components";
import React, { FC, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CompetitionRole } from "../../../../../shared_types/Competition/CompetitionRole";

interface StaffRolesProps extends React.HTMLAttributes<HTMLDivElement> {
  roles: CompetitionRole[];
}

export const StandardContainerDiv = styled.div`
  width: 20%;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
`;

export const StaffRoleDisplay = styled.div<{ $role: CompetitionRole, $isMulti?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  max-width: 175px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  line-height: 1;
  justify-content: center;

  background-color: ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminBackground :
    $role === CompetitionRole.Coach ?
    theme.roles.coachBackground :
    $role === CompetitionRole.SiteCoordinator ?
    theme.roles.siteCoordinatorBackground :
    theme.roles.participantBackground
  )};

  border: 1px solid ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminText :
    $role === CompetitionRole.Coach ?
    theme.roles.coachText :
    $role === CompetitionRole.SiteCoordinator ?
    theme.roles.siteCoordinatorText :
    theme.roles.participantText
  )};

  color: ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminText :
    $role === CompetitionRole.Coach ?
    theme.roles.coachText :
    $role === CompetitionRole.SiteCoordinator ?
    theme.roles.siteCoordinatorText :
    theme.roles.participantText
  )};
  
  &:hover {
    ${({ $isMulti, theme, $role }) => $isMulti && 
    `background-color: 
      ${$role === CompetitionRole.Admin ?
      theme.roles.adminText :
      $role === CompetitionRole.Coach ?
      theme.roles.coachText :
      $role === CompetitionRole.SiteCoordinator ?
      theme.roles.siteCoordinatorText :
      theme.roles.participantText};

    color: 
      ${$role === CompetitionRole.Admin ?
      theme.roles.adminBackground :
      $role === CompetitionRole.Coach ?
      theme.roles.coachBackground :
      $role === CompetitionRole.SiteCoordinator ?
      theme.roles.siteCoordinatorBackground :
      theme.roles.siteCoordinatorBackground};`
    }
  }
`;

const StaffRolesContainerDiv = styled(StandardContainerDiv)`
  /* min-width: 20%; */
  overflow: visible;
  flex: 1;
  display: flex;
  @media (max-width: 1001px) {
    justify-content: center;
  }
`;


const StaffRoleContainer = styled.div<{ $isOpen: boolean }>`
  width: 80%;
  user-select: none;
  height: 50%;
  max-width: 175px;
  border-radius: 10px 10px 0 0;
  transition: background-color 0s !important;
  position: relative;
  ${({ $isOpen, theme }) => $isOpen && `
    border-bottom: 3px solid ${theme.colours.sidebarLine};
    margin-top: 2px;
    background-color: ${theme.colours.sidebarLine};
  `};
`;

const RoleDropdownIcon = styled(IoIosArrowDown)`
  position: absolute;
  pointer-events: none;
  right: 2px;
  bottom: 2px;
`;

const AdditionalRolesContainer = styled.div<{ $numContents: number }>`
  position: absolute;
  height: ${({ $numContents }) => `${$numContents * 100}`}%;
  width: 100%;
  z-index: 5;
  border-radius: 0 0 10px 10px;
  background-color: ${({ theme }) => theme.colours.sidebarLine};
  border-top: none;
  box-sizing: unset;
  top: calc(100% + 2px);
`;

export const StaffRoles: FC<StaffRolesProps> = ({ roles: staffRoles, children, ...props }) => {
  const [roles, setRoles] = useState([...staffRoles]);
  const isMulti = roles.length > 1;


  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    isMulti && setIsOpen((prevState) => !prevState);
  }

  const numContents = roles.length - 1;

  return (
    <StaffRolesContainerDiv>
      <StaffRoleContainer $isOpen={isOpen}>

        <StaffRoleDisplay
          tabIndex={0}
          onClick={handleClick}
          onBlur={() => setIsOpen(false)}
          $isMulti={isMulti}
          $role={roles[0]}
        >
          <span style={{ pointerEvents: 'none' }}>{roles[0]}</span>
        </StaffRoleDisplay>

        {isOpen &&
        <AdditionalRolesContainer
          onMouseDown={(e) => { e.preventDefault(); }}
          $numContents={numContents}
        >
          {roles.slice(1).map((role, index) => 
          <StaffRoleDisplay style={{ height: `${100 / numContents}%` }} key={`${role}${index}`} $role={role}>
            <span style={{ pointerEvents: 'none' }}>{role}</span>
          </StaffRoleDisplay>
          )}
        </AdditionalRolesContainer>}

        {isMulti &&
        <RoleDropdownIcon />}

      </StaffRoleContainer>
    </StaffRolesContainerDiv>
  )
}