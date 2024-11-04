import React, { FC, ReactNode, useEffect, useState } from "react";
import { InfoBar, InfoBarProps } from "./InfoBar";
import { TeamStatus } from "../../../../../shared_types/Competition/team/TeamStatus";
import styled, { useTheme } from "styled-components";
import { addStudentToTeam } from "../../teams_page/utility/addStudentToTeam";
import { ButtonConfiguration } from "../../hooks/useCompetitionOutletContext";
import { EditableInput, TeamStudentInfoCard } from "./components/TeamStudentInfoCard";
import { EditIcon, EditIconButton } from "../../../account/Account";
import { AdvancedDropdown } from "../../../../components/AdvancedDropdown/AdvancedDropdown";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { FaSave } from "react-icons/fa";
import { TeamDetails } from "../../../../../shared_types/Competition/team/TeamDetails";

interface TeamInfoBarProps extends InfoBarProps {
  teamDetails: TeamDetails;
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
  buttonConfigurationState: [ButtonConfiguration, React.Dispatch<React.SetStateAction<ButtonConfiguration>>];
  siteOptionsState: [
    Array<{ value: string, label: string }>,
    React.Dispatch<React.SetStateAction<Array<{ value: string, label: string }>>>
  ];
}

export const InfoBarField = styled.div`
  width: 100%;
  display: flex;
  min-height: 25px;
  align-items: center;
  column-gap: 4px;
`;

export const LabelSpan = styled.span`
  font-weight: bold;
`;

export const TitleDiv = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme, $isOpen }) => $isOpen ? theme.fonts.fontSizes.title : '0'};
  margin-bottom: 10px;
`;

const TeamStatusDiv = styled.div<{ $status: TeamStatus }>`
  position: relative;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  max-width: 175px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  line-height: 1;
  justify-content: center;

  background-color: ${({ theme, $status }) => (
    $status === TeamStatus.Registered ?
    theme.access.acceptedBackground :
    $status === TeamStatus.Unregistered ?
    theme.access.pendingBackground :
    theme.access.rejectedBackground
  )};

  border: 1px solid ${({ theme, $status }) => (
    $status === TeamStatus.Registered ?
    theme.access.acceptedText :
    $status === TeamStatus.Unregistered ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};

  color: ${({ theme, $status }) => (
    $status === TeamStatus.Registered ?
    theme.access.acceptedText :
    $status === TeamStatus.Unregistered ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};
`;

const MemberUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding-left: 0;
`;

const Select = styled.select`
  border-radius: 5px;
`;

export const TeamInfoBar: FC<TeamInfoBarProps> = ({
  teamDetails, isOpenState: [isOpen, setIsOpen],
  teamListState: [teamList, setTeamList],
  buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
  siteOptionsState: [siteOptions, setSiteOptions],
  children, ...props }) => {
  const theme = useTheme();

  const [isPopupOpen, setPopupOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [teamData, setTeamData] = useState(teamDetails);

  const [currentSiteOption, setCurrentSiteOption] = useState({ value: '', label: '' });

  const [isEdited, setIsEdited] = useState(false);
  useEffect(() => {
    if (!currentSiteOption.label || !currentSiteOption.value) {
      return;
    }
    setTeamData((p) => ({ ...p, teamSite: currentSiteOption.label }));

  }, [currentSiteOption]);


  useEffect(() => {
    if (Object.keys(teamData).every((key) => (teamData as Record<string, any>)[key] === (teamDetails as Record<string, any>)[key])) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [teamData])


  const handleSaveEdit = () => {
    // send to the backend route here.

    const currentTeamIndex = teamList.findIndex((team) => team.teamId === teamDetails.teamId);
    setTeamList([
      ...teamList.slice(0, currentTeamIndex),
      teamData,
      ...teamList.slice(currentTeamIndex + 1)
    ]);
    setIsEdited(false);
  }

  return (
    <InfoBar isOpenState={[isOpen || isPopupOpen, setIsOpen]} {...props}>
      <InfoBarField>
        <LabelSpan>Team Id:</LabelSpan>
        <span>{teamDetails.teamId}</span>
      </InfoBarField>

      <EditIconButton
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => { setIsEditing((p) => !p) }}
        style={{ position: 'absolute', right: 0, top: 0 }}
      >
        <EditIcon />
      </EditIconButton>

      {isEditing ?
      <EditableInput
        defaultValue={teamData.teamName}
        onChange={(e) => setTeamData((p) => ({ ...p, teamName: e.target.value }))}
        style={{ width: '50%', height: '47px', fontSize: theme.fonts.fontSizes.title }}
      /> :
      <TitleDiv $isOpen={isOpen || isPopupOpen}>
        {teamData.teamName}
      </TitleDiv>}

      <InfoBarField>
        <LabelSpan>Coach:</LabelSpan>
        <span>{teamDetails.coach.name}</span>
      </InfoBarField>
      
      <InfoBarField>
        <LabelSpan>Status:</LabelSpan>
        <TeamStatusDiv $status={teamDetails.status}>{teamDetails.status}</TeamStatusDiv>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Level:</LabelSpan>
        {isEditing ?
        <Select onChange={(e) => setTeamData((p) => ({ ...p, teamLevel: e.target.value }))}>
          <option selected={teamData.teamLevel === 'Level A'} value={'Level A'}>Level A</option>
          <option selected={!(teamData.teamLevel === 'Level A')} value={'Level B'}>Level B</option>
        </Select> :
        <span>{teamData.teamLevel}</span>}
      </InfoBarField>
      
      <InfoBarField>
        <LabelSpan>Site:</LabelSpan>
        {isEditing ? 
        <AdvancedDropdown
          style={{ height: '30px', borderRadius: '5px', width: '100%', marginBottom: '2px' }}
          defaultSearchTerm={teamData.teamSite}
          setCurrentSelected={setCurrentSiteOption}
          optionsState={[siteOptions, setSiteOptions]}
        /> :
        <span>{teamData.teamSite}</span>}
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Seat:</LabelSpan>
        {isEditing ?
        <EditableInput
          defaultValue={teamData.teamSeat}
          onChange={(e) => setTeamData((p) => ({ ...p, teamSeat: e.target.value }))}
        /> :
        <span>{teamData.teamSeat}</span>}
      </InfoBarField>
      <br/>

      {isEdited && <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
       <TransparentResponsiveButton actionType="confirm" label="Save Changes" isOpen={false} onClick={handleSaveEdit}
             icon={<FaSave />}
             style={{
               backgroundColor: theme.colours.confirm,
             }} />
      </div>}
      
      <div style={{ width: '100%' }}>
        <LabelSpan>Members:</LabelSpan>
      </div>
      <InfoBarField>
        <MemberUl>
          {teamDetails.students.map((student) => {
            return (
              <TeamStudentInfoCard
              key={`${student.userId}`}
              student={student}
              teamDetails={teamDetails}
              buttonConfigurationState={[buttonConfiguration, setButtonConfiguration]}
              teamListState={[teamList, setTeamList]}
              popupOpenState={[isPopupOpen, setPopupOpen]}
              />
            )
          })}
        </MemberUl>
      
      </InfoBarField>


    </InfoBar>
  )
}