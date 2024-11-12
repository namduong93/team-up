import React, { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCompetitionOutletContext } from "../hooks/useCompetitionOutletContext";
import { FilterTagButton, RemoveFilterIcon } from "../../dashboard/Dashboard";
import { FlexBackground } from "../../../components/general_utility/Background";
import { NarrowDisplayDiv, UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideDisplayDiv, WideInfoContainerDiv } from "../students_page/StudentDisplay";
import Fuse from "fuse.js";
import { Field, StudentInfoContainerDiv } from "../students_page/components/StudentInfoCard";
import { NarrowStatusDiv } from "../staff_page/StaffDisplay";
import styled, { useTheme } from "styled-components";
import { StandardSpan } from "../staff_page/components/WideStaffCard";
import { StaffRoles, StandardContainerDiv } from "../staff_page/components/StaffRole";
import { AttendeesDetails } from "../../../../shared_types/Competition/staff/AttendeesDetails";
import { AttendeesInfoBar } from "../components/InfoBar/AttendeesInfoBar";

interface AttendeesCardProps extends React.HTMLAttributes<HTMLDivElement> {
  attendeesListState: [Array<AttendeesDetails>, React.Dispatch<React.SetStateAction<Array<AttendeesDetails>>>];
  attendeesDetails: AttendeesDetails;
}

export const BooleanStatus = styled.div<{ $toggled: boolean }>`
  width: 80%;
  height: 50%;
  min-height: 25px;
  max-width: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  
  background-color: ${({ theme, $toggled }) => $toggled ? theme.access.acceptedBackground : theme.access.rejectedBackground};
  color: ${({ theme, $toggled }) => $toggled ? theme.access.acceptedText : theme.access.rejectedText};
  border: 1px solid ${({ theme, $toggled }) => $toggled ? theme.access.acceptedText : theme.access.rejectedText};

  &::after {
    Content: ${({ $toggled }) => $toggled ? "'Yes'" : "'No'"};
  }
`;

export const NarrowAttendeesCard: FC<AttendeesCardProps> = ({
  attendeesDetails,
  attendeesListState: [attendeesList, setAttendeesList],
  ...props
}) => {

  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return (<>
    <AttendeesInfoBar
      attendeesDetails={attendeesDetails}
      attendeesState={[attendeesList, setAttendeesList]}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
    />
    <StudentInfoContainerDiv onDoubleClick={() => setIsInfoBarOpen((p) => !p)} {...props}>
      <Field label="Full Name" value={attendeesDetails.name} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Gender" value={attendeesDetails.sex} style={{ width: '10%', minWidth: '60px' }} />
      <Field label="Role" 
        value={
          <NarrowStatusDiv>
            <StaffRoles roles={attendeesDetails.roles} />
          </NarrowStatusDiv>
        }
        style={{ width: '20%', minWidth: '125px' }}
      />
      <Field label="University" value={attendeesDetails.universityName} style={{ width: '20%', minWidth: '170px', whiteSpace: 'break-spaces' }} />
      {/* <Field label="Email" value={attendeesDetails.email} style={{ width: '25%', minWidth: '170px' }} /> */}
      <Field label="Shirt Size" value={attendeesDetails.tshirtSize} style={{ width: '20%', minWidth: '170px' }} />
      <Field label="Dietary Needs" style={{ width: '10%', minWidth: '90px' }}
        value={
          <NarrowStatusDiv>
            <BooleanStatus $toggled={!!attendeesDetails.dietaryNeeds}>
              {/* {!!attendeesDetails.dietaryNeeds ? 'Yes' : 'No'} */}
            </BooleanStatus>
          </NarrowStatusDiv>
        }
      />
      
      <Field label="Allergies" style={{ width: '10%', minWidth: '90px' }}
        value={
          <NarrowStatusDiv>
            <BooleanStatus $toggled={!!attendeesDetails.allergies}>
              {/* {!!attendeesDetails.allergies ? 'Yes' : 'No'} */}
            </BooleanStatus>
          </NarrowStatusDiv>
        }
      />

      <Field label="Accessibility" style={{ width: '10%', minWidth: '90px' }}
        value={
          <NarrowStatusDiv>
            <BooleanStatus $toggled={!!attendeesDetails.accessibilityNeeds}>
              {/* {!!attendeesDetails.accessibilityNeeds ? 'Yes' : 'No'} */}
            </BooleanStatus>
          </NarrowStatusDiv>
        }
      />
      
      <div style={{ display: 'flex' }}>
        
      </div>
    </StudentInfoContainerDiv>
  </>)
}

export const WideAttendeesHeader: FC = () => {
  const theme = useTheme();
  return (
    <WideInfoContainerDiv $isHeader style={{
      backgroundColor: theme.colours.userInfoCardHeader,
      fontWeight: 'bold'
    }}>
      <UserNameContainerDiv>
        <UsernameTextSpan>
          Full Name
        </UsernameTextSpan>
      </UserNameContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Gender</StandardSpan>
      </StandardContainerDiv>
      
      <StandardContainerDiv>
        <StandardSpan>Role</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>University</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Shirt Size</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Dietary Needs</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Allergies</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>Accessibility</StandardSpan>
      </StandardContainerDiv>

    </WideInfoContainerDiv>
  )
}

export const WideAttendeesCard: FC<AttendeesCardProps> = ({
  attendeesDetails,
  attendeesListState: [attendeesList, setAttendeesList],
  ...props
}) => {

  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return (<>
    <AttendeesInfoBar
      attendeesState={[attendeesList, setAttendeesList]}
      attendeesDetails={attendeesDetails}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
    />
    <WideInfoContainerDiv onDoubleClick={() => setIsInfoBarOpen((p) => !p)} {...props}>

      <UserNameContainerDiv>
        <UserNameGrid>
          <UserIcon />
          <UsernameTextSpan>
            {attendeesDetails.name}
          </UsernameTextSpan>
        </UserNameGrid>
      </UserNameContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>{attendeesDetails.sex}</StandardSpan>
      </StandardContainerDiv>

      <StaffRoles roles={attendeesDetails.roles} />

      <StandardContainerDiv>
        <StandardSpan>{attendeesDetails.universityName}</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <StandardSpan>{attendeesDetails.tshirtSize}</StandardSpan>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <BooleanStatus $toggled={!!attendeesDetails.dietaryNeeds}>
          {/* {!!attendeesDetails.dietaryNeeds ? 'Yes' : 'No'} */}
        </BooleanStatus>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <BooleanStatus $toggled={!!attendeesDetails.allergies}>
          {/* {!!attendeesDetails.allergies ? 'Yes' : 'No'} */}
        </BooleanStatus>
      </StandardContainerDiv>

      <StandardContainerDiv>
        <BooleanStatus $toggled={!!attendeesDetails.accessibilityNeeds}>
            {/* {!!attendeesDetails.accessibilityNeeds ? 'Yes' : 'No'} */}
        </BooleanStatus>
      </StandardContainerDiv>

    </WideInfoContainerDiv>
  </>)
}

const ATTENDEES_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
]

const ATTENDEES_DISPLAY_FILTER_OPTIONS = {
  
};

export const AttendeesDisplay: FC = () => {
  const { compId } = useParams();
  const { filters, sortOption, searchTerm, removeFilter, setFilters,
    siteOptionState: [siteOption, setSiteOption],
    siteOptionsState: [siteOptions, setSiteOptions],
    dropdownOptionsState: [dropdownOptions, setDropdownOptions],
    setFilterOptions, setSortOptions,
    attendeesListState: [attendeesList, setAttendeesList],
  } = useCompetitionOutletContext('attendees', undefined, 'site');

  useEffect(() => {
    setSortOptions(ATTENDEES_DISPLAY_SORT_OPTIONS);
    setFilterOptions(ATTENDEES_DISPLAY_FILTER_OPTIONS);
  }, []);

  const filteredAttendees = attendeesList.filter((attendeesDetails) => {
    if (siteOption.value) {
      if (parseInt(siteOption.value) === attendeesDetails.siteId) {
        return true;
      }
      return false;
    } 
    return true;
  });

  const sortedAttendees = filteredAttendees.sort((attendeesDetails1, attendeesDetails2) => {

    if (sortOption === 'name') {
      return attendeesDetails1.name.localeCompare(attendeesDetails2.name);
    }

    return 0;
  })

  const fuse = new Fuse(sortedAttendees, {
    keys: ['name', 'roles', 'universityName', 'email'],
    threshold: 0.5
  });
  
  let searchedAttendees: { item: AttendeesDetails }[];
  if (searchTerm) {
    searchedAttendees = fuse.search(searchTerm);
  } else {
    searchedAttendees = sortedAttendees.map((attendees) => { return { item: attendees } });
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
        {searchedAttendees.map(({ item: attendeesDetails }, index) => {
          return (
            <NarrowAttendeesCard
              attendeesListState={[attendeesList, setAttendeesList]}
              key={`${attendeesDetails.email}${index}`}
              attendeesDetails={attendeesDetails}
            />
          );
        })}
      </NarrowDisplayDiv>

      <WideDisplayDiv>
        <WideAttendeesHeader />
        {searchedAttendees.map(({ item: attendeesDetails }, index) => {
          return (
            <WideAttendeesCard
              attendeesListState={[attendeesList, setAttendeesList]}
              key={`${attendeesDetails.email}${index}`}
              attendeesDetails={attendeesDetails}
            />
          );
        })}

      </WideDisplayDiv>
    </FlexBackground>
    </>
  )
};