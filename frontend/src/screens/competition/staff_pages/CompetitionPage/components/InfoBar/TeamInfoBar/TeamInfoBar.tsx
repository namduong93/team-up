import React, { FC, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { FaSave } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { TeamDetails } from "../../../../../../../../shared_types/Competition/team/TeamDetails";
import { ButtonConfiguration } from "../../../hooks/useCompetitionOutletContext";
import { sendRequest } from "../../../../../../../utility/request";
import { InfoBarField, MemberContainer, MemberSpan, MemberUl, TeamContainer, TeamDetailsLabelSpan, TeamStatusDiv, TitleDiv, VerticalInfoBarField } from "./TeamInfoBar.styles";
import { EditIcon, EditIconButton } from "../../../../../../Account/Account.styles";
import { EditableInput, TeamStudentInfoCard } from "../components/TeamStudentInfoCard";
import { AdvancedDropdown } from "../../../../../../../components/AdvancedDropdown/AdvancedDropdown";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";

interface TeamInfoBarProps extends InfoBarProps {
  teamDetails: TeamDetails;
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
  buttonConfigurationState: [ButtonConfiguration, React.Dispatch<React.SetStateAction<ButtonConfiguration>>];
  siteOptionsState: [
    Array<{ value: string, label: string }>,
    React.Dispatch<React.SetStateAction<Array<{ value: string, label: string }>>>
  ];
  isEditable: boolean;
}

export const TeamInfoBar: FC<TeamInfoBarProps> = ({
  teamDetails, isOpenState: [isOpen, setIsOpen],
  teamListState: [teamList, setTeamList],
  buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
  siteOptionsState: [siteOptions, setSiteOptions],
  isEditable,
  children, ...props }) => {
  
  const { compId } = useParams();
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
    setTeamData((p) => ({ ...p, teamSite: currentSiteOption.label, siteId: parseInt(currentSiteOption.value) }));

  }, [currentSiteOption]);


  useEffect(() => {
    if (Object.keys(teamData).every((key) => (teamData as Record<string, any>)[key] === (teamDetails as Record<string, any>)[key])) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [teamData]);

  useEffect(() => {
    setTeamData(teamDetails);
  }, [teamDetails])


  const handleSaveEdit = async () => {
    // send to the backend route here.

    const currentTeamIndex = teamList.findIndex((team) => team.teamId === teamDetails.teamId);
    setTeamList([
      ...teamList.slice(0, currentTeamIndex),
      teamData,
      ...teamList.slice(currentTeamIndex + 1)
    ]);

    await sendRequest.post('/competition/teams/update', { teamList: [teamData], compId });
    setIsEdited(false);
  }

  return (
    <InfoBar isOpenState={[isOpen || isPopupOpen, setIsOpen]} {...props}>
      <TeamContainer>
        <InfoBarField>
          <TeamDetailsLabelSpan>Team Id:</TeamDetailsLabelSpan>
          <span>{teamDetails.teamId}</span>
        </InfoBarField>

        {isEditable && <EditIconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setIsEditing((p) => !p) }}
          style={{ position: 'absolute', right: 0, top: 0 }}
        >
          <EditIcon />
        </EditIconButton>}

        <TitleDiv $isOpen={isOpen || isPopupOpen}>
          {isEditing ?
          <EditableInput
            value={teamData.teamName}
            onChange={(e) => setTeamData((p) => ({ ...p, teamName: e.target.value }))}
            style={{ width: '50%', height: '47px', fontSize: theme.fonts.fontSizes.title }}
          /> : <>{teamData.teamName}</>
          }
        </TitleDiv>

        <VerticalInfoBarField>
          <TeamDetailsLabelSpan>Coach:</TeamDetailsLabelSpan>
          <span>{teamDetails.coach.name}</span>
        </VerticalInfoBarField>
        
        <VerticalInfoBarField>
          <TeamDetailsLabelSpan>Status:</TeamDetailsLabelSpan>
          <TeamStatusDiv $status={teamDetails.status}>{teamDetails.status}</TeamStatusDiv>
        </VerticalInfoBarField>

        <VerticalInfoBarField>
          <TeamDetailsLabelSpan>Level:</TeamDetailsLabelSpan>
          <span>{teamData.teamLevel}</span>
        </VerticalInfoBarField>
        
        <VerticalInfoBarField>
          <TeamDetailsLabelSpan $isEditing={isEditing}>Site:</TeamDetailsLabelSpan>
          {isEditing ? 
          <div style={{ width: '100%' }}>
          <AdvancedDropdown
            isExtendable={false}
            style={{ height: '30px', borderRadius: '5px', width: '100%', marginBottom: '2px' }}
            defaultSearchTerm={teamData.teamSite}
            setCurrentSelected={setCurrentSiteOption}
            optionsState={[siteOptions, setSiteOptions]}
          /></div> :
          <span>{teamData.teamSite}</span>}
        </VerticalInfoBarField>

        <VerticalInfoBarField>
          <TeamDetailsLabelSpan $isEditing={isEditing}>Seat:</TeamDetailsLabelSpan>
          {isEditing ?
          <EditableInput
            value={teamData.teamSeat}
            onChange={(e) => setTeamData((p) => ({ ...p, teamSeat: e.target.value }))}
          /> :
          <span>{teamData.teamSeat}</span>}
        </VerticalInfoBarField>
        <br/>

        {isEdited && <div style={{ width: '100%', height: '30px', display: 'flex', maxWidth: '300px' }}>
          <TransparentResponsiveButton actionType="error" label="Reset" isOpen={false} onClick={() => setTeamData(teamDetails)}
              icon={<RxReset />}
              style={{
                backgroundColor: theme.colours.cancel,
              }} />
        <TransparentResponsiveButton actionType="confirm" label="Save Changes" isOpen={false} onClick={handleSaveEdit}
              icon={<FaSave />}
              style={{
                backgroundColor: theme.colours.confirm,
              }} />

        </div>}
        <MemberSpan>Members</MemberSpan>
      </TeamContainer>
      
      <MemberContainer>
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
                isEditable={isEditable}
                />
              )
            })}
          </MemberUl>
        
        </InfoBarField>
      </MemberContainer>


    </InfoBar>
  )
}