import styled from "styled-components";
import React, { FC, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";

interface StaffRolesProps extends React.HTMLAttributes<HTMLDivElement> {
  roles: CompetitionRole[];
}

export const StyledStandardContainerDiv = styled.div`
  width: 20%;
  height: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
`;

export const StyledStaffRoleDisplay = styled.div<{ $role: CompetitionRole, $isMulti?: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 25px;
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

const StyledStaffRolesContainerDiv = styled(StyledStandardContainerDiv)`
  /* min-width: 20%; */
  overflow: visible;
  flex: 1;
  display: flex;
  @media (max-width: 1001px) {
    justify-content: center;
  }
`;


const StyledStaffRoleContainer = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  user-select: none;
  height: 50%;
  max-width: 175px;
  border-radius: 10px 10px 0 0;
  transition: background-color 0s !important;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ $isOpen, theme }) => $isOpen && `
    border-bottom: 3px solid ${theme.colours.sidebarLine};
    margin-top: 2px;
    background-color: ${theme.colours.sidebarLine};
  `};
`;

const StyledRoleDropdownIcon = styled(IoIosArrowDown)`
  position: absolute;
  pointer-events: none;
  right: 2px;
  bottom: 2px;
`;

const StyledAdditionalRolesContainer = styled.div<{ $numContents: number }>`
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

export const CompRoles: FC<StaffRolesProps> = ({ roles, children, ...props }) => {
  const isMulti = roles.length > 1;


  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    isMulti && setIsOpen((prevState) => !prevState);
  }

  const numContents = roles.length - 1;

  return (
    <StyledStaffRolesContainerDiv data-test-id="comp-roles--StyledStaffRolesContainerDiv-0">
      <StyledStaffRoleContainer $isOpen={isOpen} data-test-id="comp-roles--StyledStaffRoleContainer-0">
        <StyledStaffRoleDisplay
          tabIndex={0}
          onClick={handleClick}
          onBlur={() => setIsOpen(false)}
          $isMulti={isMulti}
          $role={roles[0]}
          data-test-id="comp-roles--StyledStaffRoleDisplay-0">
          <div style={{ pointerEvents: 'none' }}>{roles[0]}</div>
        </StyledStaffRoleDisplay>
        {isOpen &&
        <StyledAdditionalRolesContainer
          onMouseDown={(e) => { e.preventDefault(); }}
          $numContents={numContents}
          data-test-id="comp-roles--StyledAdditionalRolesContainer-0">
          {roles.slice(1).map((role, index) => 
          <StyledStaffRoleDisplay
            style={{ height: `${100 / numContents}%` }}
            key={`${role}${index}`}
            $role={role}
            data-test-id="comp-roles--StyledStaffRoleDisplay-1">
            <span style={{ pointerEvents: 'none' }}>{role}</span>
          </StyledStaffRoleDisplay>
          )}
        </StyledAdditionalRolesContainer>}
        {isMulti &&
        <StyledRoleDropdownIcon data-test-id="comp-roles--StyledRoleDropdownIcon-0" />}
      </StyledStaffRoleContainer>
    </StyledStaffRolesContainerDiv>
  );
}