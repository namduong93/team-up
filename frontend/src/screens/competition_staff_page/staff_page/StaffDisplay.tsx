import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FilterTagButton, RemoveFilterIcon } from "../../dashboard/Dashboard";
import { FlexBackground } from "../../../components/general_utility/Background";
import styled, { useTheme } from "styled-components";
import { Field, StudentInfoContainerDiv } from "../students_page/components/StudentInfoCard";
import { sendRequest } from "../../../utility/request";
import Fuse from "fuse.js";
import { useCompetitionOutletContext } from "../hooks/useCompetitionOutletContext";
import { NarrowDisplayDiv, UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideDisplayDiv, WideInfoContainerDiv } from "../students_page/StudentDisplay";
import { CompetitionRole } from "../../../../shared_types/Competition/CompetitionRole";


enum StaffAccess {
  Accepted = 'Accepted',
  Pending = 'Pending',
  Rejected = 'Rejected',
}

export interface StaffDetails {
  userId: number;
  name: string;
  roles: Array<CompetitionRole>;
  universityName: string;
  access: StaffAccess;
  email: string;
}

interface StaffCardProps extends React.HTMLAttributes<HTMLDivElement> {
  staffDetails: StaffDetails;
}

export const StandardContainerDiv = styled.div`
  width: 20%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
`;

export const StandardSpan = styled.span``;

export const StaffStatus = styled.div<{ $role: CompetitionRole }>`
  width: 80%;
  height: 50%;
  max-width: 175px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  line-height: 1;
  justify-content: center;
  box-sizing: border-box;
  background-color: ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminBackground :
    $role === CompetitionRole.Coach ?
    theme.roles.coachBackground :
    theme.roles.siteCoordinatorBackground
  )};

  border: 1px solid ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminText :
    $role === CompetitionRole.Coach ?
    theme.roles.coachText :
    theme.roles.siteCoordinatorText
  )};

  color: ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminText :
    $role === CompetitionRole.Coach ?
    theme.roles.coachText :
    theme.roles.siteCoordinatorText
  )};
`;

const StaffAccessLevel = styled.div<{ $access: StaffAccess }>`
  width: 80%;
  height: 50%;
  max-width: 130px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedBackground :
    $access === StaffAccess.Pending ?
    theme.access.pendingBackground :
    theme.access.rejectedBackground
  )};

  border: 1px solid ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedText :
    $access === StaffAccess.Pending ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};

  color: ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedText :
    $access === StaffAccess.Pending ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};
`;

export const WideStaffCard: FC<StaffCardProps> = ({ staffDetails, ...props }) => {

  return (
    <WideInfoContainerDiv {...props}>
      <UserNameContainerDiv>
        <UserNameGrid>
          <UserIcon />
          <UsernameTextSpan>
            {staffDetails.name}
          </UsernameTextSpan>
        </UserNameGrid>
      </UserNameContainerDiv>

      <StandardContainerDiv>
        <StaffStatus $role={staffDetails.roles[0]}>
          { staffDetails.roles[0] }
        </StaffStatus>
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
  );
}



export const WideStaffHeader: FC = () => {
  const theme = useTheme();
  return (
    <WideInfoContainerDiv style={{
      backgroundColor: theme.colours.userInfoCardHeader,
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

export const NarrowStatusDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 3px;
`;

export const NarrowStaffCard: FC<StaffCardProps> = ({ staffDetails, ...props }) => {

  return (
    <StudentInfoContainerDiv {...props}>
      <Field label="Full Name" value={staffDetails.name} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Role" 
        value={
          <NarrowStatusDiv>
            <StaffStatus $role={staffDetails.roles[0]}>
              {staffDetails.roles[0] === CompetitionRole.SiteCoordinator ? 'Site Coordinator' : staffDetails.roles[0]}
            </StaffStatus>
          </NarrowStatusDiv>
        }
        style={{ width: '20%', minWidth: '125px' }}
      />
      <Field label="Affiliation" value={staffDetails.universityName} style={{ width: '20%', minWidth: '170px', whiteSpace: 'break-spaces' }} />
      <Field label="Access" 
        value={
          <NarrowStatusDiv>
            <StaffAccessLevel $access={staffDetails.access}>
              {staffDetails.access}
            </StaffAccessLevel>
          </NarrowStatusDiv>
        }
        style={{ width: '20%', minWidth: '125px' }}
      />
      <Field label="Email" value={staffDetails.email} style={{ width: '25%', minWidth: '170px' }} />
      
      <div style={{ display: 'flex' }}>
        
      </div>
    </StudentInfoContainerDiv>
  )
}

const STAFF_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
]

const STAFF_DISPLAY_FILTER_OPTIONS = {
  Access: [StaffAccess.Accepted, StaffAccess.Pending, StaffAccess.Rejected],
  Roles: [CompetitionRole.Admin, CompetitionRole.Coach, CompetitionRole.SiteCoordinator]
};

export const StaffDisplay: FC = () => {
  const { compId } = useParams();
  const { filters, sortOption, searchTerm, removeFilter, setFilters, universityOption,
    setFilterOptions, setSortOptions,
    staffListState: [staffList, setStaffList],
  } = useCompetitionOutletContext('staff');

  


  useEffect(() => {

    setSortOptions(STAFF_DISPLAY_SORT_OPTIONS);
    setFilterOptions(STAFF_DISPLAY_FILTER_OPTIONS);
    
  }, []);

  const filteredStaff = staffList.filter((staffDetails) => {
    if (filters.Access) {
      if (!filters.Access.some((staffAccess) => staffAccess === staffDetails.access)) {
        return false;
      }

    }

    if (filters.Roles) {
      if (!filters.Roles.some((role) => staffDetails.roles.includes(role as CompetitionRole))) {
        return false;
      }
    }

    if (!(universityOption.value === '') && !(staffDetails.universityName === universityOption.label)) {
      return false;
    }

    return true;
  });

  const sortedStaff = filteredStaff.sort((staffDetails1, staffDetails2) => {

    if (sortOption === 'name') {
      return staffDetails1.name.localeCompare(staffDetails2.name);
    }

    return 0;
  })

  const fuse = new Fuse(sortedStaff, {
    keys: ['name', 'roles', 'universityName', 'access', 'email'],
    threshold: 0.5
  });
  
  let searchedStaff;
  if (searchTerm) {
    searchedStaff = fuse.search(searchTerm);
  } else {
    searchedStaff = sortedStaff.map((staff) => { return { item: staff } });
  }
  

  return (
    <>
    <div>
      {Object.entries(filters).map(([field, values]) =>
        values.map((value) => (
        <FilterTagButton key={`${field}-${value}`}>
          {value} 
          <RemoveFilterIcon
            onClick={(e) => {
            e.stopPropagation();
            removeFilter(field, value);
            }} 
          />
        </FilterTagButton>
        ))
      )}
    </div>
    <FlexBackground>
      <NarrowDisplayDiv>
        {searchedStaff.map(({ item: staffDetails }, index) => {
          return (
            <NarrowStaffCard key={`${staffDetails.email}${index}`} staffDetails={staffDetails} />
          );
        })}
      </NarrowDisplayDiv>

      <WideDisplayDiv>
        <WideStaffHeader />
        {searchedStaff.map(({ item: staffDetails }, index) => {
          return (
            <WideStaffCard key={`${staffDetails.email}${index}`} staffDetails={staffDetails} />
          );
        })}

      </WideDisplayDiv>
    </FlexBackground>
    </>
  )
};