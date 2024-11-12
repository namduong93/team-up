import React, { FC, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import styled from "styled-components";
import { FilterTagButton, RemoveFilterIcon } from "../../dashboard/Dashboard";
import { useParams } from "react-router-dom";
import Fuse from "fuse.js";
import { StudentCardProps, StudentInfoCard } from "./components/StudentInfoCard";
import { useCompetitionOutletContext } from "../hooks/useCompetitionOutletContext";
import { FlexBackground } from "../../../components/general_utility/Background";
import { StudentsInfoBar } from "../components/InfoBar/StudentsInfoBar";
import { StudentInfo } from "../../../../shared_types/Competition/student/StudentInfo";
import { CompetitionLevel } from "../../../../shared_types/Competition/CompetitionLevel";

export const WideDisplayDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 1000px) {
    display: none;
  }
`;


interface StudentStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  isMatched: boolean;
}

export const StudentStatus: FC<StudentStatusProps> = ({ children, isMatched = false, style, ...props }) => {

  return (
    <div style={{
      width: '80%',
      height: '50%',
      minHeight: '25px',
      maxWidth: '160px',
      lineHeight: '1',
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

export const WideInfoContainerDiv = styled.div<{ $isHeader?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  border-bottom: 1px solid #D9D9D9;
  display: flex;
  font-size: 13px;
  gap: 0.5%;
  min-height: 54px;

  ${({ theme, $isHeader }) => !$isHeader && `&:hover {
    background-color: ${theme.colours.sidebarBackground};
  }

  & span {
    background-color: transparent;
  }`}
`;

export const UserNameContainerDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
`;

export const UserNameGrid = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 20% 80%;
`;

export const UserIcon = styled(FaRegUser)`
  margin: auto 0 auto 25%;
`;

export const UsernameTextSpan = styled.span`
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

const EmailSpan = styled.span<{ $isHeader: boolean }>`
  height: 100%;
  background-color: ${({ $isHeader: isHeader }) => isHeader ? 'transparent' : 'white'};
  display: flex;
  align-items: center;
  position: absolute;
  transition: background-color 0s;

  &:hover {
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
  }
`;

export const StudentInfoDiv: FC<StudentCardProps> = (
  {
    style,
    studentInfo,
    studentsState: [students, setStudents],
    ...props
  }) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  const { name, sex, email, status, studentId, teamName, level, tshirtSize, siteName }
    = studentInfo ?? {
      name: 'Full Name',
      sex: 'Gender',
      email: 'Email',
      status: 'Status',
      studentId: 'Identifier',
      teamName: 'Team Name',
      level: 'Level',
      tshirtSize: 'Shirt Size',
      siteName: 'Site'
    };

  return (
    <>
    {studentInfo && 
    <StudentsInfoBar
      studentsState={[students, setStudents]}
      studentInfo={studentInfo}
      isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
    />}
    <WideInfoContainerDiv
      $isHeader={!studentInfo}
      onDoubleClick={() => studentInfo && setIsInfoBarOpen((p) => !p)} style={style} {...props}>
       <UserNameContainerDiv>
       {!studentInfo ? <UsernameTextSpan>{name}</UsernameTextSpan> :
      <UserNameGrid >
        <UserIcon />
        <UsernameTextSpan>{name}</UsernameTextSpan>
      </UserNameGrid>}
      </UserNameContainerDiv>
        
        <SmallContainerDiv style={{ width: '10%' }}>
            {sex}
        </SmallContainerDiv>
        <EmailContainerDiv $isHeader={!studentInfo}>
          <EmailSpan $isHeader={!studentInfo}>
          {email}
          </EmailSpan>
        </EmailContainerDiv>

        <StudentIdContainerDiv>
          {studentId}
        </StudentIdContainerDiv>

        <StatusContainerDiv>
          {studentInfo ? <StudentStatus isMatched={status === 'Matched'} >{status}</StudentStatus>
          : status}
        </StatusContainerDiv>

        <TeamNameContainerDiv >
          {teamName}
        </TeamNameContainerDiv>

        <SmallContainerDiv>{level}</SmallContainerDiv>

        <SmallContainerDiv>
          {tshirtSize}
        </SmallContainerDiv>

        <UniversityContainerDiv>
          {siteName}
        </UniversityContainerDiv>

        <SmallContainerDiv></SmallContainerDiv>

      </WideInfoContainerDiv>
    </>
  )
}

export const NarrowDisplayDiv = styled.div`
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
  const { filters, sortOption, searchTerm, removeFilter, setFilters,
    universityOptionState: [universityOption, setUniversityOption],
    setFilterOptions, setSortOptions, studentsState: [students, setStudents] } = useCompetitionOutletContext('students');
  
  const { compId } = useParams();


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
        backgroundColor: '#D6D6D6',
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