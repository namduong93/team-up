import React, { FC, useEffect, useRef, useState } from "react"
import { FaArrowRight, FaSave } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { Student, TeamDetails } from "../../../../../../../../shared_types/Competition/team/TeamDetails";
import { ButtonConfiguration } from "../../../hooks/useCompetitionOutletContext";
import styled, { useTheme } from "styled-components";
import { TextArea } from "../../../../../../student/subcomponents/EditCompUserDetails/EditCompUserDetails.styles";
import { useParams } from "react-router-dom";
import { addStudentToTeam } from "../../../subroutes/TeamPage/utility/addStudentToTeam";
import { sendRequest } from "../../../../../../../utility/request";
import { EditIcon, EditIconButton } from "../../../../../../Account/Account.styles";
import { LabelSpan } from "../TeamInfoBar/TeamInfoBar.styles";
import { CopyButton } from "../../../../../../../components/general_utility/CopyButton";
import { BooleanStatus } from "../../../subroutes/AttendeesPage/subcomponents/BooleanStatus";
import { ResponsiveActionButton } from "../../../../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { AdvancedDropdown } from "../../../../../../../components/AdvancedDropdown/AdvancedDropdown";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";

interface TeamStudentInfoProps extends React.HTMLAttributes<HTMLDivElement> {
  student: Student;
  teamDetails: TeamDetails;
  popupOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
  buttonConfigurationState: [ButtonConfiguration, React.Dispatch<React.SetStateAction<ButtonConfiguration>>];
  isEditable: boolean;
}

const MemberFieldDiv = styled.div`
  display: flex;
  /* flex-direction: column; */
  column-gap: 4px;
  align-items: center;
`;

const VerticalMemberFieldDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MemberListItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 5px;
  position: relative;
  box-shadow: 0 2px 2px 0px rgba(0, 0, 0, 0.1);
`;

export const EditableInput = styled.input`
  margin-bottom: 0;
  border-radius: 5px;
  height: 30px;
  width: 75%;
  line-height: 0;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  padding: auto 0 0 0;
  box-sizing: border-box;
`;

export const EditableTextArea = styled(TextArea)`
  margin-bottom: 0;
  border-radius: 5px;
  height: 30px;
  width: 75%;
  box-sizing: border-box;
  resize: both;
  padding: 2px 0 0 3px;
  font: inherit;
  
`;

export const ToggleSelect = styled.select<{ $toggled: boolean }>`
  border-radius: 5px;
  width: 75%;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  background-color: ${({ $toggled, theme }) => $toggled ? theme.colours.confirm : theme.colours.cancel};
`

export const TeamStudentInfoCard: FC<TeamStudentInfoProps> = ({
  student,
  teamDetails,
  buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
  teamListState: [teamList, setTeamList],
  popupOpenState: [isPopupOpen, setPopupOpen],
  isEditable
}) => {
  const theme = useTheme();
  const { compId } = useParams();
  const cardRef = useRef(null);
  
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

  const handleSaveEdit = async () => {

    const currentTeamIndex = teamList.findIndex((team) => team.teamId === teamDetails.teamId);
    const studentIndex = teamDetails.students.findIndex((stud) => stud.userId === student.userId);
    const newStudentsArray =  [
      ...teamDetails.students.slice(0, studentIndex),
      studentData,
      ...teamDetails.students.slice(studentIndex + 1) ];
      
    setTeamList([
      ...teamList.slice(0, currentTeamIndex),
      { ...teamDetails, students: newStudentsArray },
      ...teamList.slice(currentTeamIndex + 1)
    ]);

    await sendRequest.post('/competition/teams/update', { teamList: [{ ...teamDetails, students: newStudentsArray }], compId });
    setIsEdited(false);
  }

  const handleClickEdit = () => {
    setIsEditingCard((p) => !p);
  }

  useEffect(() => {
    cardRef.current 
    && isEditingCard 
    && (cardRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'end' });

  }, [isEditingCard, isEdited]);

  return (
    <MemberListItem ref={cardRef} key={student.userId}>

      {isEditable && <EditIconButton
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleClickEdit}
        style={{ position: 'absolute', right: 0, top: 0 }}
        >
        <EditIcon />
      </EditIconButton>}

        <MemberFieldDiv>
          <LabelSpan>User Id:</LabelSpan>
          <span>{student.userId}</span>
        </MemberFieldDiv>

      <VerticalMemberFieldDiv>
        <LabelSpan>Name:</LabelSpan>
        <span>{studentData.name}</span>
      </VerticalMemberFieldDiv>

      <VerticalMemberFieldDiv>
        <LabelSpan>Email:</LabelSpan>
        <div>
          <span>{studentData.email}</span>
          <CopyButton textToCopy={studentData.email} />
        </div>
      </VerticalMemberFieldDiv>

      <VerticalMemberFieldDiv>
        <LabelSpan $isEditing={isEditingCard}>Bio:</LabelSpan>
        {isEditingCard ? <EditableTextArea
          onChange={(e) => setStudentData((p) => ({ ...p, bio: e.target.value }))}
          value={studentData.bio}
        />
        : <span>{studentData.bio}</span>}
      </VerticalMemberFieldDiv>

      <VerticalMemberFieldDiv>
        <LabelSpan $isEditing={isEditingCard}>ICPC Eligibile:</LabelSpan>
        {isEditingCard ?
          <ToggleSelect
            onChange={(e) => setStudentData((p) => ({ ...p, ICPCEligible: e.target.value === 'yes' }))} $toggled={studentData.ICPCEligible}
          >
            <option selected={studentData.ICPCEligible} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
            <option selected={!studentData.ICPCEligible} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
          </ToggleSelect> :
        <BooleanStatus style={{ height: '25px' }} $toggled={studentData.ICPCEligible} />}
      </VerticalMemberFieldDiv>

      <VerticalMemberFieldDiv>
        <LabelSpan $isEditing={isEditingCard}>Boersen Eligibile:</LabelSpan>
        {isEditingCard ?
          <ToggleSelect
            onChange={(e) => setStudentData((p) => ({ ...p, boersenEligible: e.target.value === 'yes' }))} $toggled={studentData.boersenEligible}
          >
            <option selected={studentData.boersenEligible} style={{ backgroundColor: theme.colours.confirm }} value='yes'>Yes</option>
            <option selected={!studentData.boersenEligible} style={{ backgroundColor: theme.colours.cancel }} value='no'>No</option>
          </ToggleSelect> :
        <BooleanStatus style={{ height: '25px' }} $toggled={studentData.boersenEligible} />}
      </VerticalMemberFieldDiv>

      <VerticalMemberFieldDiv>
        <LabelSpan $isEditing={isEditingCard}>National Prizes:</LabelSpan>

        {isEditingCard ?
          <EditableTextArea
            onChange={(e) => setStudentData((p) => ({ ...p, nationalPrizes: e.target.value }))}
            value={studentData.nationalPrizes}
          />
          : <span>{studentData.nationalPrizes ? studentData.nationalPrizes : 'None'}</span>
        }
      </VerticalMemberFieldDiv>

      <VerticalMemberFieldDiv>
        <LabelSpan $isEditing={isEditingCard}>International Prizes:</LabelSpan>

        {isEditingCard ?
          <EditableTextArea
            onChange={(e) => setStudentData((p) => ({ ...p, internationalPrizes: e.target.value }))}
            value={studentData.internationalPrizes}
          />
          : <span>{studentData.internationalPrizes ? studentData.internationalPrizes : 'None'}</span>
        }
      </VerticalMemberFieldDiv>

      <MemberFieldDiv style={{ width: '75%' }}>
        <LabelSpan $isEditing={isEditingCard}>Codeforces Rating:</LabelSpan>

        {isEditingCard ?
          <EditableInput style={{ flex: 1 }} type="number"
            onChange={(e) => setStudentData((p) => ({ ...p, codeforcesRating: parseInt(e.target.value) }))}
            value={studentData.codeforcesRating}
          />
          : <span>{studentData.codeforcesRating}</span>
        }
      </MemberFieldDiv>

      <VerticalMemberFieldDiv>
        <LabelSpan $isEditing={isEditingCard}>Past Regional:</LabelSpan>

        {isEditingCard ?
          <ToggleSelect
            onChange={(e) => setStudentData((p) => ({ ...p, pastRegional: e.target.value === 'true' }))}
            $toggled={studentData.pastRegional}
          >
            <option selected={studentData.pastRegional} style={{ backgroundColor: theme.colours.confirm }} value="true">Yes</option>
            <option selected={!studentData.pastRegional} style={{ backgroundColor: theme.colours.cancel }} value="false">No</option>
          </ToggleSelect> :
        <BooleanStatus style={{ height: '25px' }} $toggled={studentData.pastRegional} />}
      </VerticalMemberFieldDiv>


      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '5px' }}>
        {!isEditingCard && isEditable && <ResponsiveActionButton style={{ height: '30px' }}
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
      
        {isEdited && isEditingCard && <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
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