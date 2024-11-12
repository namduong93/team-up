import React, { FC, useEffect, useRef, useState } from "react";
import { InfoBar, InfoBarProps } from "./InfoBar";
import { StudentStatus } from "../../students_page/StudentDisplay";
import { EditIcon, EditIconButton, ProfilePic } from "../../../account/Account";
import { backendURL } from "../../../../../config/backendURLConfig";
import { InfoBarField, LabelSpan, NoWrapLabelSpan, Select, VerticalInfoBarField } from "./TeamInfoBar";
import { StudentInfo } from "../../../../../shared_types/Competition/student/StudentInfo";
import { CompetitionLevel } from "../../../../../shared_types/Competition/CompetitionLevel";
import { StaffRoles } from "../../staff_page/components/StaffRole";
import { EditableInput, EditableTextArea, ToggleSelect } from "./components/TeamStudentInfoCard";
import { BooleanStatus } from "../../attendees_page/AttendeesPage";
import styled, { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { RxReset } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { sendRequest } from "../../../../utility/request";
import { useParams } from "react-router-dom";

interface StudentsInfoProps extends InfoBarProps {
  studentInfo: StudentInfo;
  studentsState: [Array<StudentInfo>, React.Dispatch<React.SetStateAction<Array<StudentInfo>>>];
}

export const CompetitionInfoContainerDiv = styled.div`
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

const Container = styled.div`
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
      <Container>
        <InfoBarField>
          <LabelSpan>User Id:</LabelSpan>
          <span>{studentInfo.userId}</span>
        </InfoBarField>

        <ProfilePic
          style={{ marginBottom: '15px' }}
          $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
        />

        <VerticalInfoBarField>
          <LabelSpan>Name:</LabelSpan>
          <span>{studentInfo.name}</span>
        </VerticalInfoBarField>

        <VerticalInfoBarField>
          <LabelSpan>Perferred Name:</LabelSpan>
          <span>{studentInfo.preferredName}</span>
        </VerticalInfoBarField>

        <VerticalInfoBarField>
          <LabelSpan>Email:</LabelSpan>
          <span>{studentInfo.email}</span>
        </VerticalInfoBarField>

        <InfoBarField>
          <LabelSpan>Gender:</LabelSpan>
          <span>{studentInfo.sex}</span>
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Pronouns:</LabelSpan>
          <span>{studentInfo.pronouns}</span>
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Shirt Size:</LabelSpan>
          <span>{studentInfo.tshirtSize}</span>
        </InfoBarField>

        <VerticalInfoBarField>
          <LabelSpan>Allergies:</LabelSpan>
          <span>{studentInfo.allergies}</span>
        </VerticalInfoBarField>

        <VerticalInfoBarField>
          <LabelSpan>Dietary Requirements:</LabelSpan>
          <span>{studentInfo.dietaryReqs}</span>
        </VerticalInfoBarField>

        <VerticalInfoBarField>
          <LabelSpan>Accessibility Info:</LabelSpan>
          <span>{studentInfo.accessibilityReqs}</span>
        </VerticalInfoBarField>

        <VerticalInfoBarField>
          <LabelSpan>Student Id:</LabelSpan>
          <span>{studentInfo.studentId}</span>
        </VerticalInfoBarField>

        {/* Team info */}
        <VerticalInfoBarField>
          <LabelSpan>Team:</LabelSpan>
          <span>{studentInfo.teamName}</span>
        </VerticalInfoBarField>

        <VerticalInfoBarField>
          <LabelSpan>Site:</LabelSpan>
          <span>{studentInfo.siteName}</span>
        </VerticalInfoBarField>
      </Container>

        {/* Competition user info */}
        <CompetitionInfoContainerDiv ref={cardRef}>

          <InfoBarField>
            <LabelSpan>Roles:</LabelSpan>
            <StaffRoles roles={studentData.roles} />
            <EditIconButton onClick={() => setIsEditing((p) => !p)}>
              <EditIcon />
            </EditIconButton>
          </InfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>Bio:</LabelSpan>
            {isEditing ? <EditableTextArea
              onChange={(e) => setStudentData((p) => ({ ...p, bio: e.target.value }))}
              value={studentData.bio}
            />
            : <span>{studentData.bio}</span>}
          </VerticalInfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>ICPC Eligibile:</LabelSpan>
            {isEditing ?
              <ToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, ICPCEligible: e.target.value === 'yes' }))} $toggled={studentData.ICPCEligible}
              >
                <option selected={studentData.ICPCEligible} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
                <option selected={!studentData.ICPCEligible} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
              </ToggleSelect> :
            <BooleanStatus style={{ height: '25px' }} $toggled={studentData.ICPCEligible} />}
          </VerticalInfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>boersen Eligibile:</LabelSpan>
            {isEditing ?
              <ToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, boersenEligible: e.target.value === 'yes' }))} $toggled={studentData.boersenEligible}
              >
                <option selected={studentData.boersenEligible} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
                <option selected={!studentData.boersenEligible} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
              </ToggleSelect> :
            <BooleanStatus style={{ height: '25px' }} $toggled={studentData.boersenEligible} />}
          </VerticalInfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>Level:</LabelSpan>
            {isEditing ?
            <Select onChange={(e) => setStudentData((p) => ({ ...p, level: (e.target.value as CompetitionLevel) }))}>
              <option selected={studentData.level === 'Level A'} value={CompetitionLevel.LevelA}>Level A</option>
              <option selected={!(studentData.level === 'Level A')} value={CompetitionLevel.LevelB}>Level B</option>
            </Select> :
            <span>{studentData.level}</span>}
          </VerticalInfoBarField>

          <InfoBarField style={{ width: '75%' }}>
            <NoWrapLabelSpan>Degree Year:</NoWrapLabelSpan>
            {isEditing ?
            <EditableInput type="number"
              value={studentData.degreeYear}
              onChange={(e) => setStudentData((p) => ({ ...p, degreeYear: parseInt(e.target.value) }))}
            /> :
            <span>{studentData.degreeYear}</span>}
          </InfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>Degree:</LabelSpan>
            {isEditing ?
            <EditableInput
              value={studentData.degree}
              onChange={(e) => setStudentData((p) => ({ ...p, degree: e.target.value }))}
            /> :
            <span>{studentData.degree}</span>}
          </VerticalInfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>Is Remote:</LabelSpan>
            {isEditing ?
              <ToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, isRemote: e.target.value === 'yes' }))} $toggled={studentData.isRemote}
              >
                <option selected={studentData.isRemote} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
                <option selected={!studentData.isRemote} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
              </ToggleSelect> :
            <BooleanStatus style={{ height: '25px' }} $toggled={studentData.isRemote} />}
          </VerticalInfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>Is Official:</LabelSpan>
            {isEditing ?
              <ToggleSelect
                onChange={(e) => setStudentData((p) => ({ ...p, isOfficial: e.target.value === 'yes' }))} $toggled={studentData.isOfficial}
              >
                <option selected={studentData.isOfficial} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
                <option selected={!studentData.isOfficial} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
              </ToggleSelect> :
            <BooleanStatus style={{ height: '25px' }} $toggled={studentData.isOfficial} />}
          </VerticalInfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>Preferred Contact:</LabelSpan>
            {isEditing ?
            <EditableInput
              value={studentData.preferredContact}
              onChange={(e) => setStudentData((p) => ({ ...p, preferredContact: e.target.value }))}
            /> :
            <span>{studentData.preferredContact}</span>}
          </VerticalInfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>National Prizes:</LabelSpan>
            {isEditing ?
            <EditableInput
              value={studentData.nationalPrizes}
              onChange={(e) => setStudentData((p) => ({ ...p, nationalPrizes: e.target.value }))}
            /> :
            <span>{studentData.nationalPrizes}</span>}
          </VerticalInfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>International Prizes:</LabelSpan>
            {isEditing ?
            <EditableInput
              value={studentData.internationalPrizes}
              onChange={(e) => setStudentData((p) => ({ ...p, internationalPrizes: e.target.value }))}
            /> :
            <span>{studentData.internationalPrizes}</span>}
          </VerticalInfoBarField>

          <InfoBarField style={{ width: '75%' }}>
            <NoWrapLabelSpan>Codeforces Rating:</NoWrapLabelSpan>
            {isEditing ?
            <EditableInput type="number"
              value={studentData.codeforcesRating}
              onChange={(e) => setStudentData((p) => ({ ...p, codeforcesRating: parseInt(e.target.value) }))}
            /> :
            <span>{studentData.codeforcesRating}</span>}
          </InfoBarField>

          <VerticalInfoBarField>
            <LabelSpan>Status:</LabelSpan>
            <StudentStatus style={{ height: '25px' }}
              isMatched={studentInfo.status === 'Matched'}
            >
              {studentInfo.status}
            </StudentStatus>
          </VerticalInfoBarField>

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
      </CompetitionInfoContainerDiv>
    </InfoBar>
  );
}
