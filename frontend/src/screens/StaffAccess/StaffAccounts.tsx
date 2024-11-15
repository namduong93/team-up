
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
    const pendingStaffListIds = searchedStaff.filter((staffDetails) => staffDetails.item.userAccess === UserAccess.Pending).map((staffDetails) => staffDetails.item.userId);
  
    try {
      await sendRequest.post("/user/staff_requests", { staffRequests: pendingStaffListIds.map((userId) => ({ userId, access: UserAccess.Accepted })) });
    }
    catch (error) {
      console.error("Error updating staff access: ", error);
      return false;
    }
    return true;
  };

  const handleRejectAll = async (): Promise<boolean> => {
    // Filter by pending
    const pendingStaffListIds = searchedStaff.filter((staffDetails) => staffDetails.item.userAccess === UserAccess.Pending).map((staffDetails) => staffDetails.item.userId);
  
    try {
      await sendRequest.post("/user/staff_requests", { staffRequests: pendingStaffListIds.map((userId) => ({ userId, access: UserAccess.Rejected })) });
    }
    catch (error) {
      console.error("Error updating staff access: ", error);
      return false;
    }
    return true;
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
              searchedStaff.map(({ item: staffDetails }) => (
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