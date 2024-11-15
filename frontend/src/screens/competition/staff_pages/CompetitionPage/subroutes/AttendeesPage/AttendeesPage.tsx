import { FC, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";
import Fuse from "fuse.js";
import { AttendeesDetails } from "../../../../../../../shared_types/Competition/staff/AttendeesDetails";
import { FilterTagButton, RemoveFilterIcon } from "../../../../../dashboard/Dashboard.styles";
import { FlexBackground } from "../../../../../../components/general_utility/Background";
import { NarrowDisplayDiv, WideDisplayDiv } from "../StudentsPage/StudentsPage.styles";
import { NarrowAttendeesCard } from "./subcomponents/NarrowAttendeesCard";
import { WideAttendeesHeader } from "./subcomponents/WideAttendeesHeader";
import { WideAttendeesCard } from "./subcomponents/WideAttendeesCard";

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