import React, { FC } from "react";
import { FaRegUser } from "react-icons/fa";
import styled from "styled-components";
import { StudentInfoCard } from "./StudentInfoCard";

const WideStudentDisplayDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  @media (max-width: 1000px) {
    display: none;
  }
`;

export interface StudentInfo extends React.HTMLAttributes<HTMLDivElement> {
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

const EmailContainerDiv = styled.div<{ isHeader: boolean }>`
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  ${({ isHeader }) => !isHeader &&
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

export const StudentInfoDiv: FC<StudentInfo> = ({ style, studentInfo, isHeader = false, ...props }) => {

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
        <EmailContainerDiv isHeader={isHeader}>
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
          {studentInfo.tshirtShize}
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
  width: 100%;

  @media (min-width: 1001px) {
    display: none;
  }
`;


export const StudentDisplay = () => {
  return (
  <div style={ { flex: '1' } }>
    <NarrowStudentDisplaydiv>
    <StudentInfoCard studentInfo={{
        name: 'Leticia James',
        sex: 'F',
        email: 'thisisemailepic@gmail.com',
        studentId: 'z0000000',
        status: 'Unmatched',
        teamName: 'The Goofy Goobers',
        level: 'A',
        tshirtShize: 'XS',
        siteName: 'The University of Sydney'
        }} />

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
    </WideStudentDisplayDiv>
  </div>
  );
}