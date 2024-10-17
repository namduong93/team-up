import React, { FC, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import styled from "styled-components";
import { StudentInfoCard } from "./StudentInfoCard";
import { FilterTagButton, RemoveFilterIcon } from "../../Dashboard/Dashboard";
import { useOutletContext, useParams } from "react-router-dom";
import { CompetitionPageContext } from "./TeamDisplay";
import Fuse from "fuse.js";
import { sendRequest } from "../../../utility/request";

const WideStudentDisplayDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 1000px) {
    display: none;
  }
`;


interface StudentInfo {
  name: string;
  sex: string;
  email: string;
  studentId: string;
  status: string;
  level: string;
  tshirtSize: string;
  siteName: string;
  teamName?: string;
};

export interface StudentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  studentInfo: StudentInfo;
  isHeader?: boolean;
}

interface StudentStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  isMatched: boolean;
}

export const StudentStatus: FC<StudentStatusProps> = ({ children, isMatched = false, style, ...props }) => {

  return (
    <div style={{
      width: '80%',
      height: '50%',
      maxWidth: '130px',
      backgroundColor: isMatched ? 'rgba(139, 223, 165, 54%)' : 'rgba(255, 29, 32, 28%)',
      color: isMatched ? '#63A577' : '#ED1E21',
      border: `1px solid ${isMatched ? '#63A577' :'#FF1D20'}`,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      ...style,
    }} {...props}>
      {children}
    </div>
  )
}

const StudentInfoContainerDiv = styled.div`
  width: 100%;
  height: 54px;
  box-sizing: border-box;
  border-bottom: 1px solid #D9D9D9;
  display: flex;
  font-size: 13px;
  gap: 0.5%;
`;

const UserNameContainerDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const UserNameGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 20% 80%;
`;

const UserIcon = styled(FaRegUser)`
  margin: auto 0 auto 25%;
`;

const UsernameTextSpan = styled.span`
  margin: auto 0 auto 5%;
`;

const SmallContainerDiv = styled.div`
  width: 5%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: normal;
`;

const EmailContainerDiv = styled.div<{ $isHeader: boolean }>`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  ${({ $isHeader: isHeader }) => !isHeader &&
  `&:hover {
    overflow: visible;
    justify-content: center;
  }
  &:hover span {
    border: 1px solid black;
    border-radius: 10px;
    padding: 0 5px 0 5px;
  }`
  }
`;

const StudentIdContainerDiv = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const StatusContainerDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const TeamNameContainerDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: normal;
`;

const UniversityContainerDiv = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  align-items: center;
  white-space: normal;
`;

const EmailSpan = styled.span<{ isHeader: boolean }>`
  height: 100%;
  background-color: ${({ isHeader }) => isHeader ? 'transparent' : 'white'};
  display: flex;
  align-items: center;
  position: absolute;
`;

export const StudentInfoDiv: FC<StudentCardProps> = ({ style, studentInfo, isHeader = false, ...props }) => {

  return (
    <StudentInfoContainerDiv style={style} {...props}>
      
       <UserNameContainerDiv>
       {isHeader ? <UsernameTextSpan>{studentInfo.name}</UsernameTextSpan> :
      <UserNameGrid >
        <UserIcon />
        <UsernameTextSpan>{studentInfo.name}</UsernameTextSpan>
      </UserNameGrid>}
      </UserNameContainerDiv>
        
        <SmallContainerDiv>
            {studentInfo.sex}
        </SmallContainerDiv>
        <EmailContainerDiv $isHeader={isHeader}>
          <EmailSpan isHeader={isHeader}>
          {studentInfo.email}
          </EmailSpan>
        </EmailContainerDiv>

        <StudentIdContainerDiv>
          {studentInfo.studentId}
        </StudentIdContainerDiv>

        <StatusContainerDiv>
          {!isHeader ? <StudentStatus isMatched={studentInfo.status === 'Matched'} >{studentInfo.status}</StudentStatus>
          : studentInfo.status}
        </StatusContainerDiv>

        <TeamNameContainerDiv >
          {studentInfo.teamName}
        </TeamNameContainerDiv>

        <SmallContainerDiv>{studentInfo.level}</SmallContainerDiv>

        <SmallContainerDiv>
          {studentInfo.tshirtSize}
        </SmallContainerDiv>

        <UniversityContainerDiv>
          {studentInfo.siteName}
        </UniversityContainerDiv>

        <SmallContainerDiv></SmallContainerDiv>

      </StudentInfoContainerDiv>
  )
}

const NarrowStudentDisplaydiv = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  row-gap: 20px;

  @media (min-width: 1001px) {
    display: none;
  }
`;

const STUDENT_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
  { label: "Alphabetical (Team Name)", value: "teamName" },
]

const STUDENT_DISPLAY_FILTER_OPTIONS = {
  Status: ['Matched', 'Unmatched'],
};

export const StudentDisplay = () => {
  const { filters, sortOption, searchTerm, removeFilter,
    setFilterOptions, setSortOptions
  } = useOutletContext<CompetitionPageContext>();
  
  const { compId } = useParams();

  setSortOptions(STUDENT_DISPLAY_SORT_OPTIONS);
  setFilterOptions(STUDENT_DISPLAY_FILTER_OPTIONS);

  const [students, setStudents] = useState<Array<StudentInfo>>([]);

  useEffect(() => {
    if (!compId) {
      return;
    }

    const fetchStudents = async () => {
    const studentsResponse = await sendRequest.get<{ students: Array<StudentInfo>}>('/competition/students', { compId: parseInt(compId as string) });
      const { students } = studentsResponse.data;
      setStudents(students);
    }
    fetchStudents();

  }, []);

  const filteredStudents = students.filter((studentInfo) =>{
    if (filters.Status) {
      if (!filters.Status.some((status) => status === studentInfo.status)) {
        return false;
      }
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
  <div style={ { flex: '1', width: '100%', height: '100%' } }>
    <NarrowStudentDisplaydiv>
      {searchedStudents.map(({ item: studentInfo }: { item: StudentInfo }, index) => 
        (<StudentInfoCard key={`${studentInfo.email}${index}`} studentInfo={studentInfo} />))}

    </NarrowStudentDisplaydiv>
    <WideStudentDisplayDiv>
      <StudentInfoDiv isHeader style={{
        backgroundColor: '#D6D6D6',
        fontWeight: 'bold'
      }} studentInfo={{
        name: 'Full Name',
        sex: 'Sex',
        email: 'Email',
        studentId: 'Identifier',
        status: 'Status',
        teamName: 'Team Name',
        level: 'Level',
        tshirtSize: 'Shirt Size',
        siteName: 'Site'
      }}></StudentInfoDiv>
      {searchedStudents.map(({ item: studentInfo }: { item: StudentInfo }, index) => 
        (<StudentInfoDiv key={`${studentInfo.email}${index + students.length}`} studentInfo={studentInfo} />))}
    </WideStudentDisplayDiv>
  </div>
  </>
  );
}