import { FC, useState } from "react";
import { StudentCardProps } from "./StudentInfoCard";
import {
  StyledEmailContainerDiv,
  StyledEmailSpan,
  StyledSmallContainerDiv,
  StyledStatusContainerDiv,
  StyledStudentIdContainerDiv,
  StyledTeamNameContainerDiv,
  StyledUniversityContainerDiv,
  StyledUserIcon,
  StyledUserNameContainerDiv,
  StyledUserNameGrid,
  StyledUsernameTextSpan,
  StyledWideInfoContainerDiv,
} from "../StudentsPage.styles";
import { StudentStatus } from "./StudentStatus";
import { StudentsInfoBar } from "../../../components/InfoBar/StudentsInfoBar/StudentsInfoBar";

/**
 * A React component for displaying student information in a wide container format.
 *
 * The `StudentInfoDiv` component shows key details of a student's profile such as name, sex, email, status, student ID,
 * team name, level, shirt size, and university/site. It includes a `StudentsInfoBar` component that can be toggled open
 * by double-clicking on the student's information.
 *
 * @param {StudentCardProps} props - React StudentCardProps as specified above, including:
 * 'studentInfo', which is the student's details to be displayed in the card.
 * 'studentsState' which managing the list of students in the competition.
 * @returns {JSX.Element} - A JSX element representing a student info container with an optional expandable info bar.
 */
export const StudentInfoDiv: FC<StudentCardProps> = ({
  style,
  studentInfo,
  studentsState: [students, setStudents],
  ...props
}) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  const {
    name,
    sex,
    email,
    status,
    studentId,
    teamName,
    level,
    tshirtSize,
    siteName,
  } = studentInfo ?? {
    name: "Full Name",
    sex: "Gender",
    email: "Email",
    status: "Status",
    studentId: "Identifier",
    teamName: "Team Name",
    level: "Level",
    tshirtSize: "Shirt Size",
    siteName: "Site",
  };

  return (
    <>
      {studentInfo && (
        <StudentsInfoBar
          studentsState={[students, setStudents]}
          studentInfo={studentInfo}
          isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
        />
      )}
      <StyledWideInfoContainerDiv
        $isHeader={!studentInfo}
        onDoubleClick={() => studentInfo && setIsInfoBarOpen((p) => !p)}
        style={style}
        {...props}
      >
        <StyledUserNameContainerDiv>
          {!studentInfo ? (
            <StyledUsernameTextSpan>{name}</StyledUsernameTextSpan>
          ) : (
            <StyledUserNameGrid>
              <StyledUserIcon />
              <StyledUsernameTextSpan>{name}</StyledUsernameTextSpan>
            </StyledUserNameGrid>
          )}
        </StyledUserNameContainerDiv>

        <StyledSmallContainerDiv style={{ width: "10%" }}>
          {sex}
        </StyledSmallContainerDiv>
        <StyledEmailContainerDiv $isHeader={!studentInfo}>
          <StyledEmailSpan $isHeader={!studentInfo}>{email}</StyledEmailSpan>
        </StyledEmailContainerDiv>

        <StyledStudentIdContainerDiv>{studentId}</StyledStudentIdContainerDiv>

        <StyledStatusContainerDiv>
          {studentInfo ? (
            <StudentStatus isMatched={status === "Matched"}>
              {status}
            </StudentStatus>
          ) : (
            status
          )}
        </StyledStatusContainerDiv>

        <StyledTeamNameContainerDiv>{teamName}</StyledTeamNameContainerDiv>

        <StyledSmallContainerDiv>{level}</StyledSmallContainerDiv>

        <StyledSmallContainerDiv>{tshirtSize}</StyledSmallContainerDiv>

        <StyledUniversityContainerDiv>{siteName}</StyledUniversityContainerDiv>

        <StyledSmallContainerDiv></StyledSmallContainerDiv>
      </StyledWideInfoContainerDiv>
    </>
  );
};
