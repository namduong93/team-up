import React, { FC, useEffect, useRef, useState } from "react";
import styled, { useTheme } from "styled-components";
import { RxReset } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { StudentInfo } from "../../../../../../../../shared_types/Competition/student/StudentInfo";
import { sendRequest } from "../../../../../../../utility/request";
import { StyledEditIcon, StyledEditIconButton, StyledProfilePic } from "../../../../../../Account/Account.styles";
import { backendURL } from "../../../../../../../../config/backendURLConfig";
import { CompRoles } from "../../../subroutes/StaffPage/subcomponents/CompRoles";
import { StyledEditableInput, StyledEditableTextArea, StyledToggleSelect } from "../components/TeamStudentInfoCard";
import { StyledBooleanStatus } from "../../../subroutes/AttendeesPage/subcomponents/BooleanStatus";
import { CompetitionLevel } from "../../../../../../../../shared_types/Competition/CompetitionLevel";
import { StudentStatus } from "../../../subroutes/StudentsPage/subcomponents/StudentStatus";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";
import { StyledInfoBarField, StyledLabelSpan, StyledNoWrapLabelSpan, StyledSelect, StyledVerticalInfoBarField } from "../TeamInfoBar/TeamInfoBar.styles";

interface StudentsInfoProps extends InfoBarProps {
  studentInfo: StudentInfo;
  studentsState: [Array<StudentInfo>, React.Dispatch<React.SetStateAction<Array<StudentInfo>>>];
}

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

export const StudentsInfoBar: FC<StudentsInfoProps> = (
  { studentInfo,
    studentsState: [students, setStudents],
    isOpenState: [isOpen, setIsOpen],
    children,
    ...props
  }) => {
  
  const { compId } = useParams();
  
  const theme = useTheme();
  const cardRef = useRef(null);

  const [studentData, setStudentData] = useState(studentInfo);
  
  const [isEditing, setIsEditing] = useState(false);

  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (Object.keys(studentData).every((key) => (studentData as Record<string, any>)[key] === (studentInfo as Record<string, any>)[key])) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [studentData]);

  useEffect(() => {
    cardRef.current 
    && isEditing
    && (cardRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [isEditing, isEdited]);

  const handleSaveEdit = async () => {
    

    const currentStudentIndex = students.findIndex((stud) => stud.userId === studentData.userId);
    if (currentStudentIndex < 0) {
      return;
    }

    const newStudents = [
      ...students.slice(0, currentStudentIndex),
      studentData,
      ...students.slice(currentStudentIndex + 1),
    ];

    setStudents(newStudents);
    await sendRequest.post('/competition/students/update', { studentList: [studentData], compId });

    setIsEdited(false);
  }

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]} {...props}>
      <StyledContainer data-test-id="students-info-bar--StyledContainer-0">
        <StyledInfoBarField data-test-id="students-info-bar--StyledInfoBarField-0">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-0">User Id:</StyledLabelSpan>
          <span>{studentInfo.userId}</span>
        </StyledInfoBarField>
        <StyledProfilePic
          style={{ margin: 'auto', marginBottom: '15px' }}
          $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
          data-test-id="students-info-bar--StyledProfilePic-0" />
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-0">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-1">Name:</StyledLabelSpan>
          <span>{studentInfo.name}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-1">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-2">Perferred Name:</StyledLabelSpan>
          <span>{studentInfo.preferredName}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-2">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-3">Email:</StyledLabelSpan>
          <span>{studentInfo.email}</span>
        </StyledVerticalInfoBarField>
        <StyledInfoBarField data-test-id="students-info-bar--StyledInfoBarField-1">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-4">Gender:</StyledLabelSpan>
          <span>{studentInfo.sex}</span>
        </StyledInfoBarField>
        <StyledInfoBarField data-test-id="students-info-bar--StyledInfoBarField-2">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-5">Pronouns:</StyledLabelSpan>
          <span>{studentInfo.pronouns}</span>
        </StyledInfoBarField>
        <StyledInfoBarField data-test-id="students-info-bar--StyledInfoBarField-3">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-6">Shirt Size:</StyledLabelSpan>
          <span>{studentInfo.tshirtSize}</span>
        </StyledInfoBarField>
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-3">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-7">Allergies:</StyledLabelSpan>
          <span>{studentInfo.allergies}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-4">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-8">Dietary Requirements:</StyledLabelSpan>
          <span>{studentInfo.dietaryReqs}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-5">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-9">Accessibility Info:</StyledLabelSpan>
          <span>{studentInfo.accessibilityReqs}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-6">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-10">Student Id:</StyledLabelSpan>
          <span>{studentInfo.studentId}</span>
        </StyledVerticalInfoBarField>
        {/* Team info */}
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-7">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-11">Team:</StyledLabelSpan>
          <span>{studentInfo.teamName}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-8">
          <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-12">Site:</StyledLabelSpan>
          <span>{studentInfo.siteName}</span>
        </StyledVerticalInfoBarField>
      </StyledContainer>

        {/* Competition user info */}
        <StyledCompetitionInfoContainerDiv
          ref={cardRef}
          data-test-id="students-info-bar--StyledCompetitionInfoContainerDiv-0">
          <StyledInfoBarField data-test-id="students-info-bar--StyledInfoBarField-4">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-13">Roles:</StyledLabelSpan>
            <CompRoles roles={studentData.roles} />
            <StyledEditIconButton
              onClick={() => setIsEditing((p) => !p)}
              data-test-id="students-info-bar--StyledEditIconButton-0">
              <StyledEditIcon data-test-id="students-info-bar--StyledEditIcon-0" />
            </StyledEditIconButton>
          </StyledInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-9">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-14">Bio:</StyledLabelSpan>
            {isEditing ? <StyledEditableTextArea
              onChange={(e) => setStudentData((p) => ({ ...p, bio: e.target.value }))}
              value={studentData.bio}
              data-test-id="students-info-bar--StyledEditableTextArea-0" />
            : <span>{studentData.bio}</span>}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-10">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-15">ICPC Eligibile:</StyledLabelSpan>
            {isEditing ?
              <StyledToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, ICPCEligible: e.target.value === 'yes' }))}
                $toggled={studentData.ICPCEligible}
                data-test-id="students-info-bar--StyledToggleSelect-0">
                <option
                  selected={studentData.ICPCEligible}
                  style={{ backgroundColor: theme.colours.confirm }}
                  value='yes'
                  data-test-id="students-info-bar--option-0">Yes</option>
                <option
                  selected={!studentData.ICPCEligible}
                  style={{ backgroundColor: theme.colours.cancel }}
                  value='no'
                  data-test-id="students-info-bar--option-1">No</option>
              </StyledToggleSelect> :
            <StyledBooleanStatus
              style={{ height: '25px' }}
              $toggled={studentData.ICPCEligible}
              data-test-id="students-info-bar--StyledBooleanStatus-0" />}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-11">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-16">boersen Eligibile:</StyledLabelSpan>
            {isEditing ?
              <StyledToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, boersenEligible: e.target.value === 'yes' }))}
                $toggled={studentData.boersenEligible}
                data-test-id="students-info-bar--StyledToggleSelect-1">
                <option
                  selected={studentData.boersenEligible}
                  style={{ backgroundColor: theme.colours.confirm }}
                  value='yes'
                  data-test-id="students-info-bar--option-2">Yes</option>
                <option
                  selected={!studentData.boersenEligible}
                  style={{ backgroundColor: theme.colours.cancel }}
                  value='no'
                  data-test-id="students-info-bar--option-3">No</option>
              </StyledToggleSelect> :
            <StyledBooleanStatus
              style={{ height: '25px' }}
              $toggled={studentData.boersenEligible}
              data-test-id="students-info-bar--StyledBooleanStatus-1" />}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-12">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-17">Level:</StyledLabelSpan>
            {isEditing ?
            <StyledSelect
              onChange={(e) => setStudentData((p) => ({ ...p, level: (e.target.value as CompetitionLevel) }))}
              data-test-id="students-info-bar--StyledSelect-0">
              <option
                selected={studentData.level === 'Level A'}
                value={CompetitionLevel.LevelA}
                data-test-id="students-info-bar--option-4">Level A</option>
              <option
                selected={!(studentData.level === 'Level A')}
                value={CompetitionLevel.LevelB}
                data-test-id="students-info-bar--option-5">Level B</option>
            </StyledSelect> :
            <span>{studentData.level}</span>}
          </StyledVerticalInfoBarField>
          <StyledInfoBarField
            style={{ width: '75%' }}
            data-test-id="students-info-bar--StyledInfoBarField-5">
            <StyledNoWrapLabelSpan data-test-id="students-info-bar--StyledNoWrapLabelSpan-0">Degree Year:</StyledNoWrapLabelSpan>
            {isEditing ?
            <StyledEditableInput
              type="number"
              value={studentData.degreeYear}
              onChange={(e) => setStudentData((p) => ({ ...p, degreeYear: parseInt(e.target.value) }))}
              data-test-id="students-info-bar--StyledEditableInput-0" /> :
            <span>{studentData.degreeYear}</span>}
          </StyledInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-13">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-18">Degree:</StyledLabelSpan>
            {isEditing ?
            <StyledEditableInput
              value={studentData.degree}
              onChange={(e) => setStudentData((p) => ({ ...p, degree: e.target.value }))}
              data-test-id="students-info-bar--StyledEditableInput-1" /> :
            <span>{studentData.degree}</span>}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-14">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-19">Is Remote:</StyledLabelSpan>
            {isEditing ?
              <StyledToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, isRemote: e.target.value === 'yes' }))}
                $toggled={studentData.isRemote}
                data-test-id="students-info-bar--StyledToggleSelect-2">
                <option
                  selected={studentData.isRemote}
                  style={{ backgroundColor: theme.colours.confirm }}
                  value='yes'
                  data-test-id="students-info-bar--option-6">Yes</option>
                <option
                  selected={!studentData.isRemote}
                  style={{ backgroundColor: theme.colours.cancel }}
                  value='no'
                  data-test-id="students-info-bar--option-7">No</option>
              </StyledToggleSelect> :
            <StyledBooleanStatus
              style={{ height: '25px' }}
              $toggled={studentData.isRemote}
              data-test-id="students-info-bar--StyledBooleanStatus-2" />}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-15">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-20">Is Official:</StyledLabelSpan>
            {isEditing ?
              <StyledToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, isOfficial: e.target.value === 'yes' }))}
                $toggled={studentData.isOfficial}
                data-test-id="students-info-bar--StyledToggleSelect-3">
                <option
                  selected={studentData.isOfficial}
                  style={{ backgroundColor: theme.colours.confirm }}
                  value='yes'
                  data-test-id="students-info-bar--option-8">Yes</option>
                <option
                  selected={!studentData.isOfficial}
                  style={{ backgroundColor: theme.colours.cancel }}
                  value='no'
                  data-test-id="students-info-bar--option-9">No</option>
              </StyledToggleSelect> :
            <StyledBooleanStatus
              style={{ height: '25px' }}
              $toggled={studentData.isOfficial}
              data-test-id="students-info-bar--StyledBooleanStatus-3" />}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-16">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-21">Preferred Contact:</StyledLabelSpan>
            {isEditing ?
            <StyledEditableInput
              value={studentData.preferredContact}
              onChange={(e) => setStudentData((p) => ({ ...p, preferredContact: e.target.value }))}
              data-test-id="students-info-bar--StyledEditableInput-2" /> :
            <span>{studentData.preferredContact}</span>}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-17">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-22">National Prizes:</StyledLabelSpan>
            {isEditing ?
            <StyledEditableInput
              value={studentData.nationalPrizes}
              onChange={(e) => setStudentData((p) => ({ ...p, nationalPrizes: e.target.value }))}
              data-test-id="students-info-bar--StyledEditableInput-3" /> :
            <span>{studentData.nationalPrizes}</span>}
          </StyledVerticalInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-18">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-23">International Prizes:</StyledLabelSpan>
            {isEditing ?
            <StyledEditableInput
              value={studentData.internationalPrizes}
              onChange={(e) => setStudentData((p) => ({ ...p, internationalPrizes: e.target.value }))}
              data-test-id="students-info-bar--StyledEditableInput-4" /> :
            <span>{studentData.internationalPrizes}</span>}
          </StyledVerticalInfoBarField>
          <StyledInfoBarField
            style={{ width: '75%' }}
            data-test-id="students-info-bar--StyledInfoBarField-6">
            <StyledNoWrapLabelSpan data-test-id="students-info-bar--StyledNoWrapLabelSpan-1">Codeforces Rating:</StyledNoWrapLabelSpan>
            {isEditing ?
            <StyledEditableInput
              type="number"
              value={studentData.codeforcesRating}
              onChange={(e) => setStudentData((p) => ({ ...p, codeforcesRating: parseInt(e.target.value) }))}
              data-test-id="students-info-bar--StyledEditableInput-5" /> :
            <span>{studentData.codeforcesRating}</span>}
          </StyledInfoBarField>
          <StyledVerticalInfoBarField data-test-id="students-info-bar--StyledVerticalInfoBarField-19">
            <StyledLabelSpan data-test-id="students-info-bar--StyledLabelSpan-24">Status:</StyledLabelSpan>
            <StudentStatus style={{ height: '25px' }}
              isMatched={studentInfo.status === 'Matched'}
            >
              {studentInfo.status}
            </StudentStatus>
          </StyledVerticalInfoBarField>
          {isEdited && 
            <div style={{ display: 'flex' }}>
              <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
                <TransparentResponsiveButton
                  actionType="error"
                  label="Reset"
                  isOpen={false}
                  onClick={() => setStudentData(studentInfo)}
                  icon={<RxReset />}
                  style={{
                    backgroundColor: theme.colours.cancel,
                }} />
              </div>
            
             <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
                <TransparentResponsiveButton
                  actionType="confirm"
                  label="Save Changes"
                  isOpen={false}
                  onClick={handleSaveEdit}
                  icon={<FaSave />}
                  style={{
                    backgroundColor: theme.colours.confirm,
                }} />
              </div>
            </div>
          }
        </StyledCompetitionInfoContainerDiv>
    </InfoBar>
  );
}
