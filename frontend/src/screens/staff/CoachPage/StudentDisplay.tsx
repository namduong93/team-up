import React, { FC } from "react";
import { FaRegUser } from "react-icons/fa";
import styled from "styled-components";

const StudentDisplayDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

interface StudentInfo extends React.HTMLAttributes<HTMLDivElement> {
  studentInfo: {
    name: string,
    sex: string,
    email: string,
    studentId: string,
    status: string,
    level: string,
    tshirtShize: string,
    siteName: string,
    teamName?: string,
  };
  isHeader?: boolean;
}

interface StudentStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  isMatched: boolean;
}

const StudentStatus: FC<StudentStatusProps> = ({ children, isMatched = false, ...props }) => {

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
  font-size: 14px;
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

const EmailContainerDiv = styled.div`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
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

export const StudentInfoDiv: FC<StudentInfo> = ({ style, studentInfo, isHeader = false, ...props }) => {

  return (
    <StudentInfoContainerDiv style={style}>
      
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
        <EmailContainerDiv>
          {studentInfo.email}
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
          {studentInfo.tshirtShize}
        </SmallContainerDiv>

        <UniversityContainerDiv>
          {studentInfo.siteName}
        </UniversityContainerDiv>

        <SmallContainerDiv></SmallContainerDiv>

      </StudentInfoContainerDiv>
  )
}

export const StudentDisplay = () => {
  return (
    <div style={ { flex: '1' } }>
  <StudentDisplayDiv>
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
      tshirtShize: 'Shirt-Size',
      siteName: 'Site'
    }}></StudentInfoDiv>
    <StudentInfoDiv studentInfo={{
      name: 'Leticia James',
      sex: 'F',
      email: 'thisisemailepic@gmail.com',
      studentId: 'z0000000',
      status: 'Unmatched',
      teamName: 'The Goofy Goobers',
      level: 'A',
      tshirtShize: 'XS',
      siteName: 'The University of Sydney'
      }} ></StudentInfoDiv>
    <StudentInfoDiv studentInfo={{
      name: 'Michael Chonk',
      sex: 'NB',
      email: 'reallyaverylongemailthatcanpossiblyexistinthesystem@gmail.com',
      studentId: 'z0000000',
      teamName: 'GoogleGURLies ✨',
      status: 'Matched',
      level: 'B',
      tshirtShize: '10XL',
      siteName: 'UNSW Sydney'
      }} ></StudentInfoDiv>
  </StudentDisplayDiv>
  </div>
  );
}