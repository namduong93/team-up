/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { RxReset } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { StudentInfo } from "../../../../../../../../shared_types/Competition/student/StudentInfo";
import { sendRequest } from "../../../../../../../utility/request";
import {
  StyledEditIcon,
  StyledEditIconButton,
  StyledProfilePic,
} from "../../../../../../Account/Account.styles";
import { backendURL } from "../../../../../../../../config/backendURLConfig";
import { CompRoles } from "../../../subroutes/StaffPage/subcomponents/CompRoles";
import {
  StyledEditableInput,
  StyledEditableTextArea,
  StyledToggleSelect,
} from "../components/TeamStudentInfoCard";
import { StyledBooleanStatus } from "../../../subroutes/AttendeesPage/subcomponents/BooleanStatus";
import { CompetitionLevel } from "../../../../../../../../shared_types/Competition/CompetitionLevel";
import { StudentStatus } from "../../../subroutes/StudentsPage/subcomponents/StudentStatus";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";
import {
  StyledInfoBarField,
  StyledLabelSpan,
  StyledNoWrapLabelSpan,
  StyledSelect,
  StyledVerticalInfoBarField,
} from "../TeamInfoBar/TeamInfoBar.styles";

export const StyledCompetitionInfoContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  padding: 5px;
  position: relative;
  box-sizing: border-box;
  box-shadow: 0px 0.5px 1px 1px rgba(0, 0, 0, 0.15);
`;

const StyledContainer = styled.div`
  width: 100%;
`;

interface StudentsInfoProps extends InfoBarProps {
  studentInfo: StudentInfo;
  studentsState: [
    Array<StudentInfo>,
    React.Dispatch<React.SetStateAction<Array<StudentInfo>>>
  ];
};

/**
 * A React component for displaying and editing student information within an info bar.
 *
 * The `StudentsInfoBar` component includes fields like user ID, name, email, and other student-related details,
 * with options to edit certain fields.
 *
 * @param {StudentsInfoProps} props - React StudentInfoProps as specified above, where studentInfo is the student data
 * to display and edit, studentsState contains functions to manage the list of students and isOpenState manages the
 * info bar's open/close status.
 * @returns {JSX.Element} - A UI component that displays a student's information and provides editing options.
 */
export const StudentsInfoBar: FC<StudentsInfoProps> = ({
  studentInfo,
  studentsState: [students, setStudents],
  isOpenState: [isOpen, setIsOpen],
  ...props
}) => {
  const { compId } = useParams();
  const theme = useTheme();
  const cardRef = useRef(null);
  const [studentData, setStudentData] = useState(studentInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isEdited, setIsEdited] = useState(false);

  // Detects if the student data has been edited
  useEffect(() => {
    if (
      Object.keys(studentData).every(
        (key) =>
          (studentData as Record<string, any>)[key] ===
          (studentInfo as Record<string, any>)[key]
      )
    ) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [studentData]);

  // Triggered when the Editing state changes, it auto scrolls the info bar when the user
  // starts editing
  useEffect(() => {
    if (cardRef.current && isEditing) {
      (cardRef.current as HTMLElement).scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    };
  }, [isEditing, isEdited]);

  const handleSaveEdit = async () => {
    const currentStudentIndex = students.findIndex(
      (stud) => stud.userId === studentData.userId
    );
    if (currentStudentIndex < 0) {
      return;
    }

    const newStudents = [
      ...students.slice(0, currentStudentIndex),
      studentData,
      ...students.slice(currentStudentIndex + 1),
    ];

    setStudents(newStudents);
    await sendRequest.post("/competition/students/update", {
      studentList: [studentData],
      compId,
    });

    setIsEdited(false);
  };

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]} {...props}>
      <StyledContainer>
        <StyledInfoBarField>
          <StyledLabelSpan>User Id:</StyledLabelSpan>
          <span>{studentInfo.userId}</span>
        </StyledInfoBarField>

        <StyledProfilePic
          style={{ margin: "auto", marginBottom: "15px" }}
          $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
        />

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Name:</StyledLabelSpan>
          <span>{studentInfo.name}</span>
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Perferred Name:</StyledLabelSpan>
          <span>{studentInfo.preferredName}</span>
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Email:</StyledLabelSpan>
          <span>{studentInfo.email}</span>
        </StyledVerticalInfoBarField>

        <StyledInfoBarField>
          <StyledLabelSpan>Gender:</StyledLabelSpan>
          <span>{studentInfo.sex}</span>
        </StyledInfoBarField>

        <StyledInfoBarField>
          <StyledLabelSpan>Pronouns:</StyledLabelSpan>
          <span>{studentInfo.pronouns}</span>
        </StyledInfoBarField>

        <StyledInfoBarField>
          <StyledLabelSpan>Shirt Size:</StyledLabelSpan>
          <span>{studentInfo.tshirtSize}</span>
        </StyledInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Allergies:</StyledLabelSpan>
          <span>{studentInfo.allergies}</span>
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Dietary Requirements:</StyledLabelSpan>
          <span>{studentInfo.dietaryReqs}</span>
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Accessibility Info:</StyledLabelSpan>
          <span>{studentInfo.accessibilityReqs}</span>
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Student Id:</StyledLabelSpan>
          <span>{studentInfo.studentId}</span>
        </StyledVerticalInfoBarField>

        {/* Team info */}
        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Team:</StyledLabelSpan>
          <span>{studentInfo.teamName}</span>
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Site:</StyledLabelSpan>
          <span>{studentInfo.siteName}</span>
        </StyledVerticalInfoBarField>
      </StyledContainer>

      {/* Competition user info */}
      <StyledCompetitionInfoContainerDiv ref={cardRef}>
        <StyledInfoBarField>
          <StyledLabelSpan>Roles:</StyledLabelSpan>
          <CompRoles roles={studentData.roles} />
          <StyledEditIconButton onClick={() => setIsEditing((p) => !p)}>
            <StyledEditIcon />
          </StyledEditIconButton>
        </StyledInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Bio:</StyledLabelSpan>
          {isEditing ? (
            <StyledEditableTextArea
              onChange={(e) =>
                setStudentData((p) => ({ ...p, bio: e.target.value }))
              }
              value={studentData.bio}
            />
          ) : (
            <span>{studentData.bio}</span>
          )}
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>ICPC Eligibile:</StyledLabelSpan>
          {isEditing ? (
            <StyledToggleSelect
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  ICPCEligible: e.target.value === "yes",
                }))
              }
              $toggled={studentData.ICPCEligible}
            >
              <option
                selected={studentData.ICPCEligible}
                style={{ backgroundColor: theme.colours.confirm }}
                value="yes"
              >
                Yes
              </option>
              <option
                selected={!studentData.ICPCEligible}
                style={{ backgroundColor: theme.colours.cancel }}
                value="no"
              >
                No
              </option>
            </StyledToggleSelect>
          ) : (
            <StyledBooleanStatus
              style={{ height: "25px" }}
              $toggled={studentData.ICPCEligible}
            />
          )}
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>boersen Eligibile:</StyledLabelSpan>
          {isEditing ? (
            <StyledToggleSelect
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  boersenEligible: e.target.value === "yes",
                }))
              }
              $toggled={studentData.boersenEligible}
            >
              <option
                selected={studentData.boersenEligible}
                style={{ backgroundColor: theme.colours.confirm }}
                value="yes"
              >
                Yes
              </option>
              <option
                selected={!studentData.boersenEligible}
                style={{ backgroundColor: theme.colours.cancel }}
                value="no"
              >
                No
              </option>
            </StyledToggleSelect>
          ) : (
            <StyledBooleanStatus
              style={{ height: "25px" }}
              $toggled={studentData.boersenEligible}
            />
          )}
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Level:</StyledLabelSpan>
          {isEditing ? (
            <StyledSelect
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  level: e.target.value as CompetitionLevel,
                }))
              }
            >
              <option
                selected={studentData.level === "Level A"}
                value={CompetitionLevel.LevelA}
              >
                Level A
              </option>
              <option
                selected={!(studentData.level === "Level A")}
                value={CompetitionLevel.LevelB}
              >
                Level B
              </option>
            </StyledSelect>
          ) : (
            <span>{studentData.level}</span>
          )}
        </StyledVerticalInfoBarField>

        <StyledInfoBarField style={{ width: "75%" }}>
          <StyledNoWrapLabelSpan>Degree Year:</StyledNoWrapLabelSpan>
          {isEditing ? (
            <StyledEditableInput
              type="number"
              value={studentData.degreeYear}
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  degreeYear: parseInt(e.target.value),
                }))
              }
            />
          ) : (
            <span>{studentData.degreeYear}</span>
          )}
        </StyledInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Degree:</StyledLabelSpan>
          {isEditing ? (
            <StyledEditableInput
              value={studentData.degree}
              onChange={(e) =>
                setStudentData((p) => ({ ...p, degree: e.target.value }))
              }
            />
          ) : (
            <span>{studentData.degree}</span>
          )}
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Is Remote:</StyledLabelSpan>
          {isEditing ? (
            <StyledToggleSelect
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  isRemote: e.target.value === "yes",
                }))
              }
              $toggled={studentData.isRemote}
            >
              <option
                selected={studentData.isRemote}
                style={{ backgroundColor: theme.colours.confirm }}
                value="yes"
              >
                Yes
              </option>
              <option
                selected={!studentData.isRemote}
                style={{ backgroundColor: theme.colours.cancel }}
                value="no"
              >
                No
              </option>
            </StyledToggleSelect>
          ) : (
            <StyledBooleanStatus
              style={{ height: "25px" }}
              $toggled={studentData.isRemote}
            />
          )}
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Is Official:</StyledLabelSpan>
          {isEditing ? (
            <StyledToggleSelect
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  isOfficial: e.target.value === "yes",
                }))
              }
              $toggled={studentData.isOfficial}
            >
              <option
                selected={studentData.isOfficial}
                style={{ backgroundColor: theme.colours.confirm }}
                value="yes"
              >
                Yes
              </option>
              <option
                selected={!studentData.isOfficial}
                style={{ backgroundColor: theme.colours.cancel }}
                value="no"
              >
                No
              </option>
            </StyledToggleSelect>
          ) : (
            <StyledBooleanStatus
              style={{ height: "25px" }}
              $toggled={studentData.isOfficial}
            />
          )}
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Preferred Contact:</StyledLabelSpan>
          {isEditing ? (
            <StyledEditableInput
              value={studentData.preferredContact}
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  preferredContact: e.target.value,
                }))
              }
            />
          ) : (
            <span>{studentData.preferredContact}</span>
          )}
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>National Prizes:</StyledLabelSpan>
          {isEditing ? (
            <StyledEditableInput
              value={studentData.nationalPrizes}
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  nationalPrizes: e.target.value,
                }))
              }
            />
          ) : (
            <span>{studentData.nationalPrizes}</span>
          )}
        </StyledVerticalInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>International Prizes:</StyledLabelSpan>
          {isEditing ? (
            <StyledEditableInput
              value={studentData.internationalPrizes}
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  internationalPrizes: e.target.value,
                }))
              }
            />
          ) : (
            <span>{studentData.internationalPrizes}</span>
          )}
        </StyledVerticalInfoBarField>

        <StyledInfoBarField style={{ width: "75%" }}>
          <StyledNoWrapLabelSpan>Codeforces Rating:</StyledNoWrapLabelSpan>
          {isEditing ? (
            <StyledEditableInput
              type="number"
              value={studentData.codeforcesRating}
              onChange={(e) =>
                setStudentData((p) => ({
                  ...p,
                  codeforcesRating: parseInt(e.target.value),
                }))
              }
            />
          ) : (
            <span>{studentData.codeforcesRating}</span>
          )}
        </StyledInfoBarField>

        <StyledVerticalInfoBarField>
          <StyledLabelSpan>Status:</StyledLabelSpan>
          <StudentStatus
            style={{ height: "25px" }}
            isMatched={studentInfo.status === "Matched"}
          >
            {studentInfo.status}
          </StudentStatus>
        </StyledVerticalInfoBarField>

        {isEdited && (
          <div style={{ display: "flex" }}>
            <div style={{ maxWidth: "150px", width: "100%", height: "30px" }}>
              <TransparentResponsiveButton
                actionType="error"
                label="Reset"
                isOpen={false}
                onClick={() => setStudentData(studentInfo)}
                icon={<RxReset />}
                style={{
                  backgroundColor: theme.colours.cancel,
                }}
              />
            </div>

            <div style={{ maxWidth: "150px", width: "100%", height: "30px" }}>
              <TransparentResponsiveButton
                actionType="confirm"
                label="Save Changes"
                isOpen={false}
                onClick={handleSaveEdit}
                icon={<FaSave />}
                style={{
                  backgroundColor: theme.colours.confirm,
                }}
              />
            </div>
          </div>
        )}
      </StyledCompetitionInfoContainerDiv>
    </InfoBar>
  );
};
