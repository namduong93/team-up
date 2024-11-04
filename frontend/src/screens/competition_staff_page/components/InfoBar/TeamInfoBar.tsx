import React, { FC, ReactNode, useState } from "react";
import { InfoBar, InfoBarProps } from "./InfoBar";
import { TeamDetails } from "../../teams_page/components/TeamCard";
import { TeamStatus } from "../../../../../shared_types/Competition/team/TeamStatus";
import styled, { useTheme } from "styled-components";
import { BooleanStatus } from "../../attendees_page/AttendeesPage";
import { CopyButton } from "../../../../components/general_utility/CopyButton";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { FaArrowRight } from "react-icons/fa";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { AdvancedDropdown } from "../../../../components/AdvancedDropdown/AdvancedDropdown";
import { Student } from "../../../student/TeamProfile";
import { addStudentToTeam } from "../../teams_page/utility/addStudentToTeam";
import { ButtonConfiguration } from "../../hooks/useCompetitionOutletContext";

interface TeamInfoBarProps extends InfoBarProps {
  teamDetails: TeamDetails;
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
  buttonConfigurationState: [ButtonConfiguration, React.Dispatch<React.SetStateAction<ButtonConfiguration>>];
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

const MemberFieldDiv = styled.div`
  display: flex;
  column-gap: 4px;
  align-items: center;
`;

const MemberUl = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  padding-left: 0;
`;
const MemberListItem = styled.li`
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  border-radius: 10px;
  padding: 2px;
`;


export const TeamInfoBar: FC<TeamInfoBarProps> = ({
  teamDetails, isOpenState: [isOpen, setIsOpen],
  teamListState: [teamList, setTeamList],
  buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
  children, ...props }) => {
  
  const [isPopupOpen, setPopupOpen] = useState(false);
  
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

  return (
    <InfoBar isOpenState={[isOpen || isPopupOpen, setIsOpen]} {...props}>
      <InfoBarField style={{ left: 0, top: 0, position: 'absolute' }}>
        <LabelSpan>Team Id:</LabelSpan>
        <span>{teamDetails.teamId}</span>
      </InfoBarField>

      <TitleDiv $isOpen={isOpen || isPopupOpen}>
        {teamDetails.teamName}
      </TitleDiv>

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
        <span>{teamDetails.teamLevel}</span>
      </InfoBarField>
      
      <InfoBarField>
        <LabelSpan>Site:</LabelSpan>
        <span>{teamDetails.teamSite}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Seat:</LabelSpan>
        <span>{teamDetails.teamSeat}</span>
      </InfoBarField>
      <br/>
      
      <div style={{ width: '100%' }}>
        <LabelSpan>Members:</LabelSpan>
      </div>
      <InfoBarField>
        <MemberUl>
          {teamDetails.students.map((student) => {
            return (
              <MemberListItem key={student.userId}>

                <MemberFieldDiv>
                  <LabelSpan>Name:</LabelSpan>
                  <span>{student.name}</span>
                </MemberFieldDiv>

                <MemberFieldDiv>
                  <LabelSpan>Email:</LabelSpan>
                  <span>{student.email}</span>
                  <CopyButton textToCopy={student.email} />
                </MemberFieldDiv>
                
                <MemberFieldDiv>
                  <LabelSpan>Bio:</LabelSpan>
                  <span>{student.bio}</span>
                </MemberFieldDiv>
                
                <MemberFieldDiv>
                  <LabelSpan>ICPC Eligibile:</LabelSpan>
                  <BooleanStatus style={{ height: '25px' }} $toggled={student.ICPCEligible} />
                </MemberFieldDiv>
                
                <MemberFieldDiv>
                  <LabelSpan>Boersen Eligibile:</LabelSpan>
                  <BooleanStatus style={{ height: '25px' }} $toggled={student.boersenEligible} />
                </MemberFieldDiv>

                <MemberFieldDiv>
                  <LabelSpan>User Id:</LabelSpan>
                  <span>{student.userId}</span>
                </MemberFieldDiv>

                <ResponsiveActionButton style={{ height: '30px' }}
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
                </ResponsiveActionButton>
              </MemberListItem>
            )
          })}
        </MemberUl>
      
      </InfoBarField>


    </InfoBar>
  )
}