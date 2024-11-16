import React, { FC, useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { FaSave } from "react-icons/fa";
import { RxReset } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { TeamDetails } from "../../../../../../../../shared_types/Competition/team/TeamDetails";
import { ButtonConfiguration } from "../../../hooks/useCompetitionOutletContext";
import { sendRequest } from "../../../../../../../utility/request";
import { StyledInfoBarField, StyledMemberContainer, StyledMemberSpan, StyledMemberUl, StyledTeamContainer, StyledTeamDetailsLabelSpan, StyledTeamStatusDiv, StyledTitleDiv, StyledVerticalInfoBarField } from "./TeamInfoBar.styles";
import { StyledEditIcon, StyledEditIconButton } from "../../../../../../Account/Account.styles";
import { StyledEditableInput, TeamStudentInfoCard } from "../components/TeamStudentInfoCard";
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
      <StyledTeamContainer data-test-id="team-info-bar--StyledTeamContainer-0">
        <StyledInfoBarField data-test-id="team-info-bar--StyledInfoBarField-0">
          <StyledTeamDetailsLabelSpan data-test-id="team-info-bar--StyledTeamDetailsLabelSpan-0">Team Id:</StyledTeamDetailsLabelSpan>
          <span>{teamDetails.teamId}</span>
        </StyledInfoBarField>
        {isEditable && <StyledEditIconButton
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => { setIsEditing((p) => !p) }}
          style={{ position: 'absolute', right: 0, top: 0 }}
          data-test-id="team-info-bar--StyledEditIconButton-0">
          <StyledEditIcon data-test-id="team-info-bar--StyledEditIcon-0" />
        </StyledEditIconButton>}
        <StyledTitleDiv
          $isOpen={isOpen || isPopupOpen}
          data-test-id="team-info-bar--StyledTitleDiv-0">
          {isEditing ?
          <StyledEditableInput
            value={teamData.teamName}
            onChange={(e) => setTeamData((p) => ({ ...p, teamName: e.target.value }))}
            style={{ width: '50%', height: '47px', fontSize: theme.fonts.fontSizes.title }}
            data-test-id="team-info-bar--StyledEditableInput-0" /> : <>{teamData.teamName}</>
          }
        </StyledTitleDiv>
        <StyledVerticalInfoBarField data-test-id="team-info-bar--StyledVerticalInfoBarField-0">
          <StyledTeamDetailsLabelSpan data-test-id="team-info-bar--StyledTeamDetailsLabelSpan-1">Coach:</StyledTeamDetailsLabelSpan>
          <span>{teamDetails.coach.name}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="team-info-bar--StyledVerticalInfoBarField-1">
          <StyledTeamDetailsLabelSpan data-test-id="team-info-bar--StyledTeamDetailsLabelSpan-2">Status:</StyledTeamDetailsLabelSpan>
          <StyledTeamStatusDiv
            $status={teamDetails.status}
            data-test-id="team-info-bar--StyledTeamStatusDiv-0">{teamDetails.status}</StyledTeamStatusDiv>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="team-info-bar--StyledVerticalInfoBarField-2">
          <StyledTeamDetailsLabelSpan data-test-id="team-info-bar--StyledTeamDetailsLabelSpan-3">Level:</StyledTeamDetailsLabelSpan>
          <span>{teamData.teamLevel}</span>
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="team-info-bar--StyledVerticalInfoBarField-3">
          <StyledTeamDetailsLabelSpan
            $isEditing={isEditing}
            data-test-id="team-info-bar--StyledTeamDetailsLabelSpan-4">Site:</StyledTeamDetailsLabelSpan>
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
        </StyledVerticalInfoBarField>
        <StyledVerticalInfoBarField data-test-id="team-info-bar--StyledVerticalInfoBarField-4">
          <StyledTeamDetailsLabelSpan
            $isEditing={isEditing}
            data-test-id="team-info-bar--StyledTeamDetailsLabelSpan-5">Seat:</StyledTeamDetailsLabelSpan>
          {isEditing ?
          <StyledEditableInput
            value={teamData.teamSeat}
            onChange={(e) => setTeamData((p) => ({ ...p, teamSeat: e.target.value }))}
            data-test-id="team-info-bar--StyledEditableInput-1" /> :
          <span>{teamData.teamSeat}</span>}
        </StyledVerticalInfoBarField>
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
        <StyledMemberSpan data-test-id="team-info-bar--StyledMemberSpan-0">Members</StyledMemberSpan>
      </StyledTeamContainer>
      
      <StyledMemberContainer data-test-id="team-info-bar--StyledMemberContainer-0">
        <StyledInfoBarField data-test-id="team-info-bar--StyledInfoBarField-1">
          <StyledMemberUl data-test-id="team-info-bar--StyledMemberUl-0">
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
          </StyledMemberUl>
        </StyledInfoBarField>
      </StyledMemberContainer>


    </InfoBar>
  );
}