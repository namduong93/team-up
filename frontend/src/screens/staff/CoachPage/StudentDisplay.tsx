import React, { FC, useEffect, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import styled from "styled-components";
import { StudentCardInfo, StudentCardProps, StudentInfoCard } from "./StudentInfoCard";
import { FilterTagButton, RemoveFilterIcon } from "../../Dashboard/Dashboard";
import { useOutletContext, useParams } from "react-router-dom";
import { CompetitionPageContext } from "./TeamDisplay";
import Fuse from "fuse.js";
import { sendRequest } from "../../../utility/request";

export const WideDisplayDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 1000px) {
    display: none;
  }
`;


interface StudentInfo extends StudentCardInfo {
  userId: number;
  universityId: number;
};

interface StudentStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  isMatched: boolean;
}

export const StudentStatus: FC<StudentStatusProps> = ({ children, isMatched = false, style, ...props }) => {

  return (
    <div style={{
      width: '80%',
      height: '50%',
      maxWidth: '130px',
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

export const WideInfoContainerDiv = styled.div`
  width: 100%;
  height: 54px;
  box-sizing: border-box;
  border-bottom: 1px solid #D9D9D9;
  display: flex;
  font-size: 13px;
  gap: 0.5%;
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

const EmailSpan = styled.span<{ isHeader: boolean }>`
  height: 100%;
  background-color: ${({ isHeader }) => isHeader ? 'transparent' : 'white'};
  display: flex;
  align-items: center;
  position: absolute;
`;

export const StudentInfoDiv: FC<StudentCardProps> = ({ style, studentInfo, isHeader = false, ...props }) => {

  return (
    <WideInfoContainerDiv style={style} {...props}>
      
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

      </WideInfoContainerDiv>
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
      setStudents([ ...students,
        {
          userId: 999,
          universityId: 1,
          name: 'Ernest Perkins',
          sex: 'F',
          email: 'lofvo@ajugip.bm',
          studentId: '5717686',
          status: 'Unmatched',
          level: 'A',
          tshirtSize: 'XS',
          siteName: 'eat grown coal ',
          teamName: 'ask diagram slightly',
        },
        {
          userId: 999,
          universityId: 1,
          name: 'Rena Powers',
          sex: 'F',
          email: 'rog@we.bg',
          studentId: '9579323',
          status: 'Unmatched',
          level: 'A',
          tshirtSize: 'M',
          siteName: 'development few way ',
          teamName: 'seeing cowboy easily',
        },
        {
          userId: 999,
          universityId: 1,
          name: 'Brent Johnston',
          sex: 'M',
          email: 'ilusonu@fiwjeka.bh',
          studentId: '7122240',
          status: 'Matched',
          level: 'A',
          tshirtSize: 'M',
          siteName: 'share beauty game ',
          teamName: 'rocky butter nuts',
        },
        {
          userId: 999,
          universityId: 2,
          name: 'Leonard Holmes',
          sex: 'NB',
          email: 'jisufov@wis.vn',
          studentId: '2116157',
          status: 'Matched',
          level: 'A',
          tshirtSize: 'M',
          siteName: 'sure fresh contain ',
          teamName: 'season layers skin',
        },
        {
          userId: 999,
          universityId: 1,
          name: 'Phillip Soto',
          sex: 'F',
          email: 'inosi@ijmajhij.io',
          studentId: '9061298',
          status: 'Matched',
          level: 'B',
          tshirtSize: '5XL',
          siteName: 'percent generally noon ',
          teamName: 'star differ birthday',
        },
        {
          userId: 999,
          universityId: 2,
          name: 'Jordan Allison',
          sex: 'M',
          email: 'ucaip@ote.tc',
          studentId: '2722497',
          status: 'Unmatched',
          level: 'A',
          tshirtSize: 'XS',
          siteName: 'blew language piano ',
          teamName: 'swam fish attention',
        },
        {
          userId: 999,
          universityId: 1,
          name: 'Cody Tran',
          sex: 'F',
          email: 'hewos@ja.wf',
          studentId: '4852517',
          status: 'Unmatched',
          level: 'B',
          tshirtSize: 'XS',
          siteName: 'blue rather cattle ',
          teamName: 'ought telephone rule',
        },
        {
          userId: 999,
          universityId: 2,
          name: 'Jonathan Turner',
          sex: 'F',
          email: 'odjuf@vebar.be',
          studentId: '1046450',
          status: 'Matched',
          level: 'B',
          tshirtSize: 'XS',
          siteName: 'contrast halfway sheet ',
          teamName: 'offer golden just',
        },
        {
          userId: 999,
          universityId: 1,
          name: 'Ada Wolfe',
          sex: 'F',
          email: 'luf@soralogob.nl',
          studentId: '9066512',
          status: 'Matched',
          level: 'A',
          tshirtSize: 'L',
          siteName: 'sort flag final ',
          teamName: 'noon although feet',
        },
        {
          userId: 999,
          universityId: 1,
          name: 'Patrick Glover',
          sex: 'M',
          email: 'jaz@umedufed.ms',
          studentId: '8753821',
          status: 'Unmatched',
          level: 'A',
          tshirtSize: 'L',
          siteName: 'forgot idea muscle ',
          teamName: 'able story melted',
        },
        {
          userId: 999,
          universityId: 2,
          name: 'Jeanette Sharp',
          sex: 'M',
          email: 'ricfu@nudu.mg',
          studentId: '9045028',
          status: 'Unmatched',
          level: 'A',
          tshirtSize: 'XL',
          siteName: 'powder another question ',
          teamName: 'average first disease',
        },
        {
          userId: 999,
          universityId: 2,
          name: 'Danny Fields',
          sex: 'NB',
          email: 'wil@dihij.cz',
          studentId: '4361756',
          status: 'Unmatched',
          level: 'B',
          tshirtSize: 'L',
          siteName: 'became melted thought ',
          teamName: 'does spread job',
        },
        {
          userId: 999,
          universityId: 1,
          name: 'Gary Quinn',
          sex: 'F',
          email: 'towzawco@how.ki',
          studentId: '6143079',
          status: 'Matched',
          level: 'A',
          tshirtSize: 'L',
          siteName: 'walk out baseball ',
          teamName: 'globe read lungs',
        },
        {
          userId: 999,
          universityId: 1,
          name: 'Adam Blake',
          sex: 'NB',
          email: 'damennok@iv.us',
          studentId: '2886120',
          status: 'Unmatched',
          level: 'A',
          tshirtSize: 'XS',
          siteName: 'even basic opportunity ',
          teamName: 'send mice close',
        }
        
       ]);
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
    <NarrowDisplayDiv>
      {searchedStudents.map(({ item: studentInfo }: { item: StudentInfo }, index) => 
        (<StudentInfoCard key={`${studentInfo.email}${index}`} studentInfo={studentInfo} />))}
    </NarrowDisplayDiv>

    <WideDisplayDiv>
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
    </WideDisplayDiv>
  </div>
  </>
  );
}