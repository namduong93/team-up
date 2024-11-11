import React, { FC, useEffect, useState } from "react";
import Fuse from "fuse.js";
import { FlexBackground } from "../../components/general_utility/Background";
import { StaffAccess, StaffAccessInfo } from "../../../shared_types/Competition/staff/StaffInfo";
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

const mockStaffData: StaffAccessInfo[] = [
  {
    userId: 1,
    universityId: 102,
    universityName: "Institute of Learning",
    name: "Bob Smith",
    email: "bob.smith@learning.edu",
    access: StaffAccess.Pending,
  },
  {
    userId: 2,
    universityId: 101,
    universityName: "University of Example",
    name: "Alice Johnson",
    email: "alice.johnson@example.edu",
    access: StaffAccess.Accepted,
  },
  {
    userId: 3,
    universityId: 103,
    universityName: "Global Tech University",
    name: "Charlie Brown",
    email: "charlie.brown@globaltech.edu",
    access: StaffAccess.Rejected,
  },
];

export interface StaffAccessCardProps extends React.HTMLAttributes<HTMLDivElement> {
  staffDetails: StaffAccessInfo;
}

const STAFF_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
];

const STAFF_DISPLAY_FILTER_OPTIONS: Record<string, Array<string>> = {
  Access: [StaffAccess.Accepted, StaffAccess.Pending, StaffAccess.Rejected].map(String),
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
  const [staffList, setStaffList] = useState<Array<StaffAccessInfo>>([]);
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, Array<string>>>({});
  const [filterOptions, setFilterOptions] = useState<
    Record<string, Array<string>>
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  // Check if filters contain only "Pending"
  const isPendingOnly = filters["Access"]?.length === 1 && filters["Access"].includes(StaffAccess.Pending);

  useEffect(() => {
    setSortOption(STAFF_DISPLAY_SORT_OPTIONS[0].value);
    setFilterOptions(STAFF_DISPLAY_FILTER_OPTIONS);
    
    // TODO: Backend, get the staffList from backend
    const fetchStaffRequestsList = async () => {
      const staffRequestsResponse = await sendRequest.get<{
        staff: Array<StaffInfo>;
      }>("/user/staff_list", {});
      const { staff } = staffResponse.data;
      setStaffList(staff);
    };

    setStaffList(mockStaffData);
  }, []);

  const filteredStaff = staffList.filter((staffDetails) => {

    if (filters["Access"] && filters["Access"].length > 0 && !filters["Access"].includes(String(staffDetails.access))) {
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
    const pendingStaffListIds = staffList.filter((staffDetails) => staffDetails.access === StaffAccess.Pending).map((staffDetails) => staffDetails.userId);
  
    // Perform backend hook to update status to 'approved'
    console.log("all pending staff accounts approved: ", pendingStaffListIds);
  
    // replace with the put hook
    return new Promise((resolve) => {
      setFilters({});
      // await fetch updated staff list here

      resolve(true);
    });
  };

  const handleRejectAll = async (): Promise<boolean> => {
    // Filter by pending
    const pendingStaffListIds = staffList.filter((staffDetails) => staffDetails.access === StaffAccess.Pending).map((staffDetails) => staffDetails.userId);
  
    // Perform backend hook to update status to 'rejected'
    console.log("all pending staff accounts rejected: ", pendingStaffListIds);
  
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
                searchedStaff.map(({ item: staffDetails }) => (
                    <NarrowStaffAccessCard staffDetails={staffDetails} />
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
              searchedStaff.map(({ item: staffDetails }) => (
                  <WideStaffAccessCard staffDetails={staffDetails} />
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