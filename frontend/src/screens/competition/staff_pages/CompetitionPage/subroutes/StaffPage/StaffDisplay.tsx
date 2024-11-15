import { useParams } from "react-router-dom";
import { CompetitionRole } from "../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../shared_types/Competition/staff/StaffInfo";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";
import { FC, useEffect } from "react";
import Fuse from "fuse.js";
import { FilterTagButton, RemoveFilterIcon } from "../../../../../dashboard/Dashboard.styles";
import { FlexBackground } from "../../../../../../components/general_utility/Background";
import { NarrowDisplayDiv, WideDisplayDiv } from "../StudentsPage/StudentsPage.styles";
import { NarrowStaffCard } from "./subcomponents/NarrowStaffCard";
import { WideStaffHeader } from "./subcomponents/WideStaffHeader";
import { WideStaffCard } from "./subcomponents/WideStaffCard";


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
  const { filters, sortOption, searchTerm, removeFilter, setFilters,
    universityOptionState: [universityOption, setUniversityOption],
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
      if (!staffDetails.roles || !filters.Roles.some((role) => staffDetails.roles!.includes(role as CompetitionRole))) {
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
            <NarrowStaffCard key={`${staffDetails.email}${index}`} staffDetails={staffDetails} staffListState={[staffList, setStaffList]} />
          );
        })}
      </NarrowDisplayDiv>

      <WideDisplayDiv>
        <WideStaffHeader />
        {searchedStaff.map(({ item: staffDetails }, index) => {
          return (
            <WideStaffCard key={`${staffDetails.email}${index}`} staffDetails={staffDetails} staffListState={[staffList, setStaffList]} />
          );
        })}

      </WideDisplayDiv>
    </FlexBackground>
    </>
  )
};