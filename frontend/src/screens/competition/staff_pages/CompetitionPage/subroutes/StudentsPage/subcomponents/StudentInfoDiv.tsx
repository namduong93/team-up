import { FC, useState } from "react";
import { StudentCardProps } from "./StudentInfoCard";
import { EmailContainerDiv, EmailSpan, SmallContainerDiv, StatusContainerDiv, StudentIdContainerDiv, TeamNameContainerDiv, UniversityContainerDiv, UserIcon, UserNameContainerDiv, UserNameGrid, UsernameTextSpan, WideInfoContainerDiv } from "../StudentsPage.styles";
import { StudentStatus } from "./StudentStatus";
import { StudentsInfoBar } from "../../../components/InfoBar/StudentsInfoBar/StudentsInfoBar";

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

        <TeamNameContainerDiv>
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