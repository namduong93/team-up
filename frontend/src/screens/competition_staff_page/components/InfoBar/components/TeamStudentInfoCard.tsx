import React, { FC, useEffect, useState } from "react"
import { LabelSpan } from "../TeamInfoBar";
import { CopyButton } from "../../../../../components/general_utility/CopyButton";
import { BooleanStatus } from "../../../attendees_page/AttendeesPage";
import { ResponsiveActionButton } from "../../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { FaArrowRight, FaSave } from "react-icons/fa";
import { AdvancedDropdown } from "../../../../../components/AdvancedDropdown/AdvancedDropdown";
import styled, { useTheme } from "styled-components";
import { addStudentToTeam } from "../../../teams_page/utility/addStudentToTeam";
import { ButtonConfiguration } from "../../../hooks/useCompetitionOutletContext";
import { EditIcon, EditIconButton } from "../../../../account/Account";
import { Input } from "../../../../../components/general_utility/TextInputLight";
import { TransparentResponsiveButton } from "../../../../../components/responsive_fields/ResponsiveButton";
import { GiCancel } from "react-icons/gi";
import { RxReset } from "react-icons/rx";
import { TeamDetails, Student } from "../../../../../../shared_types/Competition/team/TeamDetails";


interface TeamStudentInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  student: Student;
  teamDetails: TeamDetails;
  popupOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
  buttonConfigurationState: [ButtonConfiguration, React.Dispatch<React.SetStateAction<ButtonConfiguration>>];
}

const MemberFieldDiv = styled.div`
  display: flex;
  column-gap: 4px;
  align-items: center;
`;

const MemberListItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  border-radius: 10px;
  padding: 2px;
  position: relative;
`;

export const EditableInput = styled(Input)`
  margin-bottom: 0;
  border-radius: 5px;
  height: 25px;
  width: 75%;
  line-height: 0;
  padding: 0;
`;

const ToggleSelect = styled.select<{ $toggled: boolean }>`
  border-radius: 5px;
  width: 50%;
  background-color: ${({ $toggled, theme }) => $toggled ? theme.colours.confirm : theme.colours.cancel};
`

export const TeamStudentInfoCard: FC<TeamStudentInfoProps> = ({
  student,
  teamDetails,
  buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
  teamListState: [teamList, setTeamList],
  popupOpenState: [isPopupOpen, setPopupOpen],
}) => {
  const theme = useTheme();
  
  const [teamOptions, setTeamOptions] 
  = useState(teamList.map((team) => ({ value: String(team.teamId), label: team.teamName })));
  const [currentTeamOption, setCurrentTeamOption] = useState({ value: '', label: '' });

  const handleSubmitTeamChange = async (student: Student) => {

    const newTeamId = parseInt(currentTeamOption.value);
    const currentTeamId = teamDetails.teamId;
    
    const newTeamIndex = teamList.findIndex((team) => team.teamId === newTeamId);
    const currentTeamIndex = teamList.findIndex((team) => team.teamId === currentTeamId);

    if (addStudentToTeam(student, currentTeamIndex, newTeamIndex, [teamList, setTeamList])) {
      setButtonConfiguration((p) => ({
        ...p,
        enableTeamsChangedButtons: true
      }));
    };
    setPopupOpen(false);
    return true;
  }

  const [isEditingCard, setIsEditingCard] = useState(false);

  const [studentData, setStudentData] = useState(student);

  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (Object.keys(studentData).every((key) => (studentData as Record<string, any>)[key] === (student as Record<string, any>)[key])) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);

  }, [studentData]);

  const handleSaveEdit = () => {
    // send request to backend to edit this student
  }

  return (
    <MemberListItem key={student.userId}>

      <EditIconButton
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => { setIsEditingCard((p) => !p) }}
        style={{ position: 'absolute', right: 0, top: 0 }}
        >
        <EditIcon />
      </EditIconButton>

        <MemberFieldDiv>
          <LabelSpan>User Id:</LabelSpan>
          <span>{student.userId}</span>
        </MemberFieldDiv>

      <MemberFieldDiv>
        <LabelSpan>Name:</LabelSpan>
        {/* {isEditingCard ? 
        <EditableInput
          onChange={(e) => setStudentData((p) => ({ ...p, name: e.target.value }))}
          defaultValue={studentData.name}
        /> : */}
        <span>{studentData.name}</span>
        {/* } */}
      </MemberFieldDiv>

      <MemberFieldDiv>
        <LabelSpan>Email:</LabelSpan>
        {/* {isEditingCard ? <EditableInput
          onChange={(e) => setStudentData((p) => ({ ...p, email: e.target.value }))}
          defaultValue={studentData.email}
        /> : */}
        <span>{studentData.email}</span>
        {/* } */}
        <CopyButton textToCopy={studentData.email} />
      </MemberFieldDiv>

      <MemberFieldDiv>
        <LabelSpan>Bio:</LabelSpan>
        {isEditingCard ? <EditableInput
          onChange={(e) => setStudentData((p) => ({ ...p, bio: e.target.value }))}
          defaultValue={studentData.bio}
        />
        : <span>{studentData.bio}</span>}
      </MemberFieldDiv>

      <MemberFieldDiv>
        <LabelSpan>ICPC Eligibile:</LabelSpan>
        {isEditingCard ?
          <ToggleSelect
            onChange={(e) => setStudentData((p) => ({ ...p, ICPCEligible: e.target.value === 'yes' }))} $toggled={studentData.ICPCEligible}
          >
            <option selected={studentData.ICPCEligible} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
            <option selected={!studentData.ICPCEligible} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
          </ToggleSelect> :
        <BooleanStatus style={{ height: '25px' }} $toggled={studentData.ICPCEligible} />}
      </MemberFieldDiv>

      <MemberFieldDiv>
        <LabelSpan>Boersen Eligibile:</LabelSpan>
        {isEditingCard ?
          <ToggleSelect
            onChange={(e) => setStudentData((p) => ({ ...p, boersenEligible: e.target.value === 'yes' }))} $toggled={studentData.boersenEligible}
          >
            <option selected={studentData.boersenEligible} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
            <option selected={!studentData.boersenEligible} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
          </ToggleSelect> :
        <BooleanStatus style={{ height: '25px' }} $toggled={studentData.boersenEligible} />}
      </MemberFieldDiv>


      <div style={{ display: 'flex' }}>
      {!isEditingCard && <ResponsiveActionButton style={{ height: '30px' }}
        onMouseDown={(e) => e.preventDefault()}
        handleClick={() => setPopupOpen(true)}
        handleClose={() => setPopupOpen(false)}
        handleSubmit={async () => handleSubmitTeamChange(student)}
        icon={<FaArrowRight />}
        label="Change Team"
        question={`What team should ${student.name} be in?`}
        actionType="primary"
      >
        <AdvancedDropdown
          optionsState={[teamOptions, setTeamOptions]}
          isExtendable={false}
          setCurrentSelected={setCurrentTeamOption}
        />
      </ResponsiveActionButton>}
     
      {isEditingCard && <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
        <TransparentResponsiveButton actionType="error" label="Reset" isOpen={false} onClick={() => setStudentData(student)}
              icon={<RxReset />}
              style={{
                backgroundColor: theme.colours.cancel,
              }} />
       </div>}
      
      {isEdited && <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
       <TransparentResponsiveButton actionType="confirm" label="Save Changes" isOpen={false} onClick={handleSaveEdit}
             icon={<FaSave />}
             style={{
               backgroundColor: theme.colours.confirm,
             }} />
      </div>}
      </div>
    </MemberListItem>
  )
}