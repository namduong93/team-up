import React, { FC, useEffect, useState } from "react";
import { InfoBar, InfoBarProps } from "./InfoBar";
import { StudentStatus } from "../../students_page/StudentDisplay";
import { EditIcon, EditIconButton, ProfilePic } from "../../../account/Account";
import { backendURL } from "../../../../../config/backendURLConfig";
import { InfoBarField, LabelSpan, Select } from "./TeamInfoBar";
import { StudentInfo } from "../../../../../shared_types/Competition/student/StudentInfo";
import { CompetitionLevel } from "../../../../../shared_types/Competition/CompetitionLevel";
import { StaffRoles } from "../../staff_page/components/StaffRole";
import { EditableInput, EditableTextArea, ToggleSelect } from "./components/TeamStudentInfoCard";
import { BooleanStatus } from "../../attendees_page/AttendeesPage";
import styled, { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { RxReset } from "react-icons/rx";
import { FaSave } from "react-icons/fa";

interface StudentsInfoProps extends InfoBarProps {
  studentInfo: StudentInfo;
  studentsState: [Array<StudentInfo>, React.Dispatch<React.SetStateAction<Array<StudentInfo>>>];
}

export const CompetitionInfoContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  /* gap: 2px; */
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  border-radius: 10px;
  padding: 2px;
  position: relative;
  box-sizing: border-box;
`;

export const StudentsInfoBar: FC<StudentsInfoProps> = (
  { studentInfo,
    studentsState: [students, setStudents],
    isOpenState: [isOpen, setIsOpen],
    children,
    ...props
  }) => {
  
  const theme = useTheme();

  
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

  const handleSaveEdit = () => {
    // send request to backend to edit this student

    // const currentTeamIndex = teamList.findIndex((team) => team.teamId === teamDetails.teamId);
    // const studentIndex = teamDetails.students.findIndex((stud) => stud.userId === student.userId);
    // setTeamList([
    //   ...teamList.slice(0, currentTeamIndex),
    //   { ...teamDetails, students: [
    //     ...teamDetails.students.slice(0, studentIndex),
    //     studentData,
    //     ...teamDetails.students.slice(studentIndex + 1) ] },
    //   ...teamList.slice(currentTeamIndex + 1)
    // ]);

    const currentStudentIndex = students.findIndex((stud) => stud.userId === studentInfo.userId);
    if (currentStudentIndex < 0) {
      return;
    }
    setStudents([
      ...students.slice(0, currentStudentIndex),
      studentInfo,
      ...students.slice(currentStudentIndex + 1),
    ]);
    setIsEdited(false);
  }

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]} {...props}>

      <InfoBarField>
        <LabelSpan>User Id:</LabelSpan>
        <span>{studentInfo.userId}</span>
      </InfoBarField>

      <ProfilePic
        style={{ marginBottom: '15px' }}
        $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
      />

      <InfoBarField>
        <LabelSpan>Name:</LabelSpan>
        <span>{studentInfo.name}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Perferred Name:</LabelSpan>
        <span>{studentInfo.preferredName}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Email:</LabelSpan>
        <span>{studentInfo.email}</span>
      </InfoBarField>

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

      <InfoBarField>
        <LabelSpan>Allergies:</LabelSpan>
        <span>{studentInfo.allergies}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Dietary Requirements:</LabelSpan>
        <span>{studentInfo.dietaryReqs}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Accessibility Info:</LabelSpan>
        <span>{studentInfo.accessibilityReqs}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Student Id:</LabelSpan>
        <span>{studentInfo.studentId}</span>
      </InfoBarField>

      {/* Team info */}
      <InfoBarField>
        <LabelSpan>Team:</LabelSpan>
        <span>{studentInfo.teamName}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Site:</LabelSpan>
        <span>{studentInfo.siteName}</span>
      </InfoBarField>


      {/* Competition user info */}

      <CompetitionInfoContainerDiv>

        <InfoBarField>
          <LabelSpan>Roles:</LabelSpan>
          <StaffRoles roles={studentData.roles} />
          <EditIconButton onClick={() => setIsEditing((p) => !p)}>
            <EditIcon />
          </EditIconButton>
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Bio:</LabelSpan>
          {isEditing ? <EditableTextArea
            onChange={(e) => setStudentData((p) => ({ ...p, bio: e.target.value }))}
            value={studentData.bio}
          />
          : <span>{studentData.bio}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>ICPC Eligibile:</LabelSpan>
          {isEditing ?
            <ToggleSelect
              onChange={(e) => setStudentData((p) => ({ ...p, ICPCEligible: e.target.value === 'yes' }))} $toggled={studentData.ICPCEligible}
            >
              <option selected={studentData.ICPCEligible} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
              <option selected={!studentData.ICPCEligible} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
            </ToggleSelect> :
          <BooleanStatus style={{ height: '25px' }} $toggled={studentData.ICPCEligible} />}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>boersen Eligibile:</LabelSpan>
          {isEditing ?
            <ToggleSelect
              onChange={(e) => setStudentData((p) => ({ ...p, boersenEligible: e.target.value === 'yes' }))} $toggled={studentData.boersenEligible}
            >
              <option selected={studentData.boersenEligible} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
              <option selected={!studentData.boersenEligible} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
            </ToggleSelect> :
          <BooleanStatus style={{ height: '25px' }} $toggled={studentData.boersenEligible} />}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Level:</LabelSpan>
          {isEditing ?
          <Select onChange={(e) => setStudentData((p) => ({ ...p, level: (e.target.value as CompetitionLevel) }))}>
            <option selected={studentData.level === 'Level A'} value={CompetitionLevel.LevelA}>Level A</option>
            <option selected={!(studentData.level === 'Level A')} value={CompetitionLevel.LevelB}>Level B</option>
          </Select> :
          <span>{studentData.level}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Degree Year:</LabelSpan>
          {isEditing ?
          <EditableInput type="number"
            value={studentData.degreeYear}
            onChange={(e) => setStudentData((p) => ({ ...p, degreeYear: parseInt(e.target.value) }))}
          /> :
          <span>{studentData.degreeYear}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Degree:</LabelSpan>
          {isEditing ?
          <EditableInput
            value={studentData.degree}
            onChange={(e) => setStudentData((p) => ({ ...p, degree: e.target.value }))}
          /> :
          <span>{studentData.degree}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Is Remote:</LabelSpan>
          {isEditing ?
            <ToggleSelect
              onChange={(e) => setStudentData((p) => ({ ...p, isRemote: e.target.value === 'yes' }))} $toggled={studentData.isRemote}
            >
              <option selected={studentData.isRemote} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
              <option selected={!studentData.isRemote} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
            </ToggleSelect> :
          <BooleanStatus style={{ height: '25px' }} $toggled={studentData.isRemote} />}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Is Official:</LabelSpan>
          {isEditing ?
            <ToggleSelect
              onChange={(e) => setStudentData((p) => ({ ...p, isOfficial: e.target.value === 'yes' }))} $toggled={studentData.isOfficial}
            >
              <option selected={studentData.isOfficial} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
              <option selected={!studentData.isOfficial} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
            </ToggleSelect> :
          <BooleanStatus style={{ height: '25px' }} $toggled={studentData.isOfficial} />}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Preferred Contact:</LabelSpan>
          {isEditing ?
          <EditableInput
            value={studentData.preferredContact}
            onChange={(e) => setStudentData((p) => ({ ...p, preferredContact: e.target.value }))}
          /> :
          <span>{studentData.preferredContact}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>National Prizes:</LabelSpan>
          {isEditing ?
          <EditableInput
            value={studentData.nationalPrizes}
            onChange={(e) => setStudentData((p) => ({ ...p, nationalPrizes: e.target.value }))}
          /> :
          <span>{studentData.nationalPrizes}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>International Prizes:</LabelSpan>
          {isEditing ?
          <EditableInput
            value={studentData.internationalPrizes}
            onChange={(e) => setStudentData((p) => ({ ...p, internationalPrizes: e.target.value }))}
          /> :
          <span>{studentData.internationalPrizes}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Codeforces Rating:</LabelSpan>
          {isEditing ?
          <EditableInput type="number"
            value={studentData.codeforcesRating}
            onChange={(e) => setStudentData((p) => ({ ...p, codeforcesRating: parseInt(e.target.value) }))}
          /> :
          <span>{studentData.codeforcesRating}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Status:</LabelSpan>
          <StudentStatus style={{ height: '25px' }}
            isMatched={studentInfo.status === 'Matched'}
          >
            {studentInfo.status}
          </StudentStatus>
        </InfoBarField>

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
      </div>}

    </CompetitionInfoContainerDiv>

    </InfoBar>
  );
}
