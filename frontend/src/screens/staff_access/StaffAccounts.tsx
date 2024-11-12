import React, { FC, useEffect, useState } from "react";
import Fuse from "fuse.js";
import { FlexBackground } from "../../components/general_utility/Background";
import { StaffInfo } from "../../../shared_types/Competition/staff/StaffInfo";
import {  NarrowDisplayDiv, WideDisplayDiv } from "../competition_staff_page/students_page/StudentDisplay";
// import { StaffAccessLevel, NarrowStatusDiv } from "../competition_staff_page/staff_page/StaffDisplay";

import { WideStaffAccessCard, WideStaffAccessHeader } from "./WideStaffAccessCard";
// import { NarrowStaffAccessCard } from "./NarrowStaffAccessCard";
import { Background } from "../account/Account";
import { PageHeader } from "../../components/page_header/PageHeader";
import { styled } from "styled-components";
import { FilterTagButton, RemoveFilterIcon } from "../dashboard/Dashboard";
import { NarrowStaffAccessCard } from "./NarrowStaffAccessCard";
import { StaffAccessButtons } from "./StaffAccessButtons";
import { sendRequest } from "../../utility/request";
import { UserAccess } from "../../../shared_types/User/User";
import { fetchStaffRequests } from "./util/fetchStaffRequests";

export interface StaffAccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  staffDetails: StaffInfo;
  staffListState: [StaffInfo[], React.Dispatch<React.SetStateAction<StaffInfo[]>>];
}

const STAFF_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
];

const STAFF_DISPLAY_FILTER_OPTIONS: Record<string, Array<string>> = {
  Access: [UserAccess.Accepted, UserAccess.Pending, UserAccess.Rejected],
};

const PageBackground = styled(Background)`
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const StaffContainer = styled(FlexBackground)`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  box-sizing: border-box;
`;

const StaffRecords = styled.div`
  display: flex;
  flex-direction: column;

`;

const FilterTagContainer = styled.div`
  width: 100%;
  height: 40px;
`;

export const StaffAccounts: FC = () => {
  const [staffList, setStaffList] = useState<Array<StaffInfo>>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, Array<string>>>({});
  const [filterOptions, setFilterOptions] = useState<
    Record<string, Array<string>>
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  // Check if filters contain only "Pending"
  const isPendingOnly = filters["Access"]?.length === 1 && filters["Access"].includes(UserAccess.Pending);

  useEffect(() => {
    setSortOption(STAFF_DISPLAY_SORT_OPTIONS[0].value);
    setFilterOptions(STAFF_DISPLAY_FILTER_OPTIONS);
    fetchStaffRequests(setStaffList);
  }, []);

  const filteredStaff = staffList.filter((staffDetails) => {
    if (filters["Access"] && filters["Access"].length > 0 && !filters["Access"].includes(staffDetails.userAccess)) {
      return false;
    }
    return true;
  });

  const sortedStaff = filteredStaff.sort((staffDetails1, staffDetails2) => {
    if (sortOption === "name") {
      return staffDetails1.name.localeCompare(staffDetails2.name);
    }
    return 0;
  });

  const fuse = new Fuse(sortedStaff, {
    keys: ["name", "universityName", "access", "email"],
    threshold: 0.5,
  });

  let searchedStaff;
  if (searchTerm) {
    searchedStaff = fuse.search(searchTerm);
  } else {
    searchedStaff = sortedStaff.map((staff) => { return { item: staff } });
    console.log(searchedStaff);
  }

  const removeFilter = (field: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[field] = updatedFilters[field].filter((v) => v !== value);
      if (updatedFilters[field].length === 0) {
        delete updatedFilters[field];
      }
      return updatedFilters; // trigger render to update filter dropdown
    });
  };

  const handleApproveAll = async (): Promise<boolean> => {
    // Filter by pending
    const pendingStaffListIds = staffList.filter((staffDetails) => staffDetails.userAccess === UserAccess.Pending).map((staffDetails) => staffDetails.userId);
  
    try {
      await sendRequest.post("/user/staff_requests", { staffRequests: pendingStaffListIds.map((userId) => ({ userId, access: UserAccess.Accepted })) });
    }
    catch (error) {
      console.error("Error updating staff access: ", error);
    }
  
    // replace with the put hook
    return new Promise((resolve) => {
      setFilters({});
      // await fetch updated staff list here

      resolve(true);
    });
  };

  const handleRejectAll = async (): Promise<boolean> => {
    // Filter by pending
    const pendingStaffListIds = staffList.filter((staffDetails) => staffDetails.userAccess === UserAccess.Pending).map((staffDetails) => staffDetails.userId);
  
    try {
      await sendRequest.post("/user/staff_requests", { staffRequests: pendingStaffListIds.map((userId) => ({ userId, access: UserAccess.Rejected })) });
    }
    catch (error) {
      console.error("Error updating staff access: ", error);
    }
  
    // replace with the put hook
    return new Promise((resolve) => {
      setFilters({});
      // await fetch updated staff list here

      resolve(true);
    });
  };

  return (
    <PageBackground>
      <PageHeader
        pageTitle="Staff Account Management"
        pageDescription="Review pending staff account requests"
        sortOptions={STAFF_DISPLAY_SORT_OPTIONS}
        sortOptionState={{ sortOption, setSortOption }}
        filterOptions={filterOptions}
        filtersState={{ filters, setFilters }}
        searchTermState={{ searchTerm, setSearchTerm }}
      >
        <StaffAccessButtons onApproveAll={handleApproveAll} onRejectAll={handleRejectAll} editingForAll={isPendingOnly}/>
      </PageHeader>


      <FilterTagContainer>
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
      </FilterTagContainer>

      <StaffContainer>
        <NarrowDisplayDiv>
          <StaffRecords>
            {searchedStaff.length > 0 ? (
              searchedStaff.map(({ item: staffDetails }, index) => (
                <NarrowStaffAccessCard 
                  key={`staff-wide-${staffDetails.userId}`}  
                  staffDetails={staffDetails} 
                  staffListState={[staffList, setStaffList]}
                />
              ))
            ) : (
              <p>No staff members found.</p>
            )}
          </StaffRecords>
        </NarrowDisplayDiv>
        <WideDisplayDiv>
          <WideStaffAccessHeader />
          <StaffRecords>
            {searchedStaff.length > 0 ? (
              searchedStaff.map(({ item: staffDetails }, index) => (
                <WideStaffAccessCard 
                  key={`staff-wide-${staffDetails.userId}`}  
                  staffDetails={staffDetails} 
                  staffListState={[staffList, setStaffList]}
                />
              ))
            ) : (
              <p>No staff members found.</p>
            )}
          </StaffRecords>
        </WideDisplayDiv>
      </StaffContainer>
    </PageBackground>
  );
};