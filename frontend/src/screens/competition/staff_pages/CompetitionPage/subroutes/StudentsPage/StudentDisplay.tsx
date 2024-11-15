

const STUDENT_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
  { label: "Alphabetical (Team Name)", value: "teamName" },
]

const STUDENT_DISPLAY_FILTER_OPTIONS = {
  Status: ['Matched', 'Unmatched'],
};

export const StudentDisplay = () => {
  const { filters, sortOption, searchTerm, removeFilter, setFilters,
    universityOptionState: [universityOption, setUniversityOption],
    setFilterOptions, setSortOptions, studentsState: [students, setStudents] } = useCompetitionOutletContext('students');
  
  const { compId } = useParams();
  const theme = useTheme();

  useEffect(() => {
    setSortOptions(STUDENT_DISPLAY_SORT_OPTIONS);
    setFilterOptions(STUDENT_DISPLAY_FILTER_OPTIONS);
    if (!compId) {
      return;
    }
  }, []);

  const filteredStudents = students.filter((studentInfo) =>{
    if (filters.Status) {
      if (!filters.Status.some((status) => status === studentInfo.status)) {
        return false;
      }
    }

    if (!(universityOption.value === '') && !(studentInfo.universityId === parseInt(universityOption.value))) {
      return false;
    }

    return true;
  });

  const sortedStudents = filteredStudents.sort((student1, student2) => {
    if (!sortOption) {
      return 0;
    }

    if (sortOption === 'name') {
      return student1.name.localeCompare(student2.name);
    }

    if (sortOption === 'teamName') {
      if (student1.teamName) {
        if (!student2.teamName) {
          return 1;
        }

        if (student2.teamName) {
          return student1.teamName?.localeCompare(student2.teamName as string);
        }
      } else {
        if (student2.teamName) {
          return -1;
        }
      }
    }
    return 0;

  });

  const fuse = new Fuse(sortedStudents, {
    keys: ['name', 'sex', 'email', 'studentId', 'status', 'teamName', 'level', 'tshirtSize', 'siteName'],
    threshold: 0.5
  });
  
  let searchedStudents;
  if (searchTerm) {
    searchedStudents = fuse.search(searchTerm);
  } else {
    searchedStudents = sortedStudents.map((student) => { return { item: student } });
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
      {searchedStudents.map(({ item: studentInfo }: { item: StudentInfo }, index) => 
        (<StudentInfoCard
          studentsState={[students, setStudents]}
          key={`${studentInfo.email}${index}`}
          studentInfo={studentInfo}
        />))}
    </NarrowDisplayDiv>

    <WideDisplayDiv>
      <StudentInfoDiv studentsState={[students, setStudents]} style={{
        backgroundColor: theme.colours.userInfoCardHeader,
        fontWeight: 'bold'
      }}></StudentInfoDiv>
      {searchedStudents.map(({ item: studentInfo }: { item: StudentInfo }, index) => 
        (<StudentInfoDiv
          studentsState={[students, setStudents]}
          key={`${studentInfo.email}${index + students.length}`}
          studentInfo={studentInfo}
        />))}
    </WideDisplayDiv>
  </FlexBackground>
  </>
  );
}