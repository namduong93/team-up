import React, { FC, useEffect, useState } from "react";
import { CiCircleAlert } from "react-icons/ci";
import { FaRegUser } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import { LiaTimesSolid } from "react-icons/lia";
import styled, { useTheme } from "styled-components";
import { motion, PanInfo } from "framer-motion";
import { DragEndEvent } from "../TeamDisplay";
import { InfoBar } from "../../components/InfoBar/InfoBar";
import { TeamInfoBar } from "../../components/InfoBar/TeamInfoBar";
import { TeamStatus } from "../../../../../shared_types/Competition/team/TeamStatus";
import { ButtonConfiguration } from "../../hooks/useCompetitionOutletContext";
import { TeamDetails, Student } from "../../../../../shared_types/Competition/team/TeamDetails";
import { CompetitionRole } from "../../../../../shared_types/Competition/CompetitionRole";

export enum Member {
  name = 0,
  siteId = 1,
  ICPCEligible = 2,
  level = 3,
  boersenEligible = 4,
  isRemote = 5,
}

export const DRAG_ANIMATION_DURATION = 0.2;

interface TeamCardProps extends React.HTMLAttributes<HTMLDivElement> {
  teamDetails: TeamDetails;
  isEditingStatus: boolean;
  teamIdsState: [number[], React.Dispatch<React.SetStateAction<number[]>>];
  rejectedTeamIdsState: [number[], React.Dispatch<React.SetStateAction<number[]>>];
  isEditingNameStatus: boolean;
  isDraggingState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  handleDragDropCard?: (event: DragEndEvent, info: PanInfo, member: Student, currentTeamId: number) => void;
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
  buttonConfigurationState: [ButtonConfiguration, React.Dispatch<React.SetStateAction<ButtonConfiguration>>];
  siteOptionsState: [
    Array<{ value: string, label: string }>,
    React.Dispatch<React.SetStateAction<Array<{ value: string, label: string }>>>
  ];
  roles: Array<CompetitionRole>;
};

const TeamMemberContainerDiv = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 20% 80%;
  user-select: none;
`

const StyledUserIcon = styled(FaRegUser)`
  width: 50%;
  min-width: 18px;
  margin: auto 0 auto 25%;
  pointer-events: none;
  user-select: none;
`

const CenterTextDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const TeamCardMember = ({ memberName }: { memberName: string }) => {

  return (
  <TeamMemberContainerDiv draggable='false'>
    <StyledUserIcon />
    <CenterTextDiv>
      {memberName}
    </CenterTextDiv>
  </TeamMemberContainerDiv>
  );
}

const StyledHoverDiv = styled.div<{$isEditingStatus: boolean, $isEditingNameStatus: boolean, $isDragging: boolean, $numMembers: number}>`
  transition: transform 0.2s ease-in-out !important;
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  height: ${({ $isEditingStatus, $numMembers }) => {
    if ($numMembers > 3) {
      return $isEditingStatus ? '330px' : '310px';
    } else {
      return $isEditingStatus ? '280px' : '260px';
    }
  }};
  max-width: 294px;
  min-width: 140px;
  border-radius: 20px 20px 20px 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  user-select: none;
  &:hover {
    ${({ $isEditingStatus, $isEditingNameStatus, $isDragging }) =>
      (!$isEditingStatus && !$isEditingNameStatus && !$isDragging) && `transform: translate(3px, 3px);`}
    cursor: pointer;
  }

  @media (max-width: 410px ) {
    &:hover {
      ${({ $isEditingStatus, $isEditingNameStatus, $isDragging }) =>
        (!$isEditingStatus && !$isEditingNameStatus && !$isDragging) && `transform: translate(0, 3px);`}
      cursor: pointer;
    }
  }
`;

const CardHeaderDiv = styled.div<{ $statusColor: string }>`
  background-color: ${(props) => props.$statusColor};
  height: 58px;
  width: 100%;
  border-radius: 20px 20px 0px 0px;
  display: flex;
  align-items: center;
  gap: 2.5%;
`;

const TitleSpan = styled.span`
  font-size: 1.5rem;
  margin-left: 5%;
`

const TeamMatesContainerDiv = styled.div`
  background-color: ${({ theme }) => theme.colours.cardBackground};
  flex: 1 1 auto;
  border-radius: 0px 0px 20px 20px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-top: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.fonts.colour};
`


const RedTeamNameAlert = styled(CiCircleAlert)`
  color: red;
  min-height: 32px;
  min-width: 32px;
  margin-right: 5%;
`;

const ApproveDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  column-gap: 4px;
  color: ${({ theme }) => theme.colours.confirm};
`;

const RadioCircleDiv = styled.div<{ $selected: boolean }>`
  transition: background-color 0.2s ease-in-out !important;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colours.confirm};
  box-sizing: border-box;
  background-color: ${({ theme, $selected }) => (
      $selected ? theme.colours.confirm : theme.background
    )};
`;

const ApproveRadio: FC<React.HTMLAttributes<HTMLDivElement>> = ({ onClick = () => {}, children, ...props }) => {
  const [selected, setSelected] = useState<boolean>(false);
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setSelected((prev) => !prev);
    onClick(e);
  }
  return (
    <ApproveDiv onClick={handleClick} {...props}>
      <RadioCircleDiv $selected={selected} />
      {children}
    </ApproveDiv>
  );
}

interface ApprovalNameRadiosProps extends React.HTMLAttributes<HTMLDivElement> {
  setTeamIds: React.Dispatch<React.SetStateAction<Array<number>>>;
  setRejectedTeamIds: React.Dispatch<React.SetStateAction<Array<number>>>;
  teamId: number;
}

const ApprovalNameDiv = styled.div`
  width: 100%;
  height: 33px;
  display: flex;
  justify-content: center;
`;

const RadioCheckIcon = styled(IoMdCheckmark)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.colours.confirm};
`;

const RadioCrossIcon = styled(LiaTimesSolid)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.colours.cancel};
`;

const RadioIconDiv = styled.div`
  width: 33px;
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-sizing: border-box;
`;

const enum RadioOption {
  Neither = 'Neither',
  Check = 'Check',
  Cross = 'Cross',
}

const ApproveNameRadios: FC<ApprovalNameRadiosProps> = ({ setTeamIds, setRejectedTeamIds, teamId, ...props }) => {
  const theme = useTheme();
  
  const [selectedOption, setSelectedOption] = useState<RadioOption>(RadioOption.Neither);

  const handleCheckClick = () => {
    setSelectedOption((prev) => prev === RadioOption.Check ? RadioOption.Neither : RadioOption.Check);
  }

  const handleCrossClick = () => {
    setSelectedOption((prev) => prev === RadioOption.Cross ? RadioOption.Neither : RadioOption.Cross);
  }

  const addTeam = () => {
    setTeamIds((prev) => prev.includes(teamId) ? prev : [...prev, teamId]);
  }
  const removeTeam = () => {
    setTeamIds((prev) => {
      const index = prev.indexOf(teamId);
      if (index < 0) {
        return prev;
      }

      return [
        ...prev.slice(0, index),
        ...prev.slice(index + 1)
      ];
    })
  }
  const rejectTeam = () => {
    setRejectedTeamIds((prev) => prev.includes(teamId) ? prev : [...prev, teamId]);
  }
  const unRejectTeam = () => {
    setRejectedTeamIds((prev) => {
      const index = prev.indexOf(teamId);
      if (index < 0) {
        return prev;
      }

      return [
        ...prev.slice(0, index),
        ...prev.slice(index + 1)
      ];
    })
  }

  useEffect(() => {
    if (selectedOption === RadioOption.Check) {
      addTeam();
      unRejectTeam();
    } else {
      removeTeam();
    }

    if (selectedOption === RadioOption.Cross) {
      rejectTeam();
    }

  }, [selectedOption]);

  return (
    <ApprovalNameDiv {...props}>
      
      <RadioIconDiv onClick={handleCheckClick} style={{
        border: `1px solid ${theme.colours.confirm}`,
        backgroundColor: selectedOption === RadioOption.Check ? theme.colours.confirm : theme.background
      }}>
        <RadioCheckIcon style={{
          color: selectedOption === RadioOption.Check ? theme.background : theme.colours.confirm
        }} />
      </RadioIconDiv>

      <div style={{ flex: '0 2 20px' }} />
      
      <RadioIconDiv onClick={handleCrossClick} style={{
        border: `1px solid ${theme.colours.cancel}`,
        backgroundColor: selectedOption === RadioOption.Cross ? theme.colours.cancel : theme.background,
        color: selectedOption === RadioOption.Cross ? theme.background : theme.colours.cancel
      }}>
        <RadioCrossIcon style={{
          color: selectedOption === RadioOption.Cross ? theme.background : theme.colours.cancel
        }} />
      </RadioIconDiv>
    
    </ApprovalNameDiv>
  )
}

const TeamNameApprovalDiv = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: green; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TeamMemberMotionDiv = styled(motion.div)<{ $isDraggable: boolean }>`
  border-radius: 10px;
  border: 1px solid rgb(200, 200, 200);
  width: 85.37%;
  min-height: 40px;
  background-color: ${({ theme }) => theme.background};
  /* height: 20.79%; */

  &:hover {
    ${({ $isDraggable }) => $isDraggable && `cursor: grabbing`};
  }
`;

export const TeamCard: FC<TeamCardProps> = ({ teamDetails, isEditingStatus = false,
  teamListState: [teamList, setTeamlist],
  teamIdsState: [teamIds, setTeamIds],
  rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
  buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
  isEditingNameStatus = false, isDraggingState: [isDragging, setIsDragging],
  handleDragDropCard = () => {}, 
  siteOptionsState: [siteOptions, setSiteOptions],
  roles,
  ...props
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [status, _ ] = useState(teamDetails.status);
  const colorMap = {
    'Pending': '#F48385',
    'Unregistered': '#FDD386',
    'Registered': '#8BDFA5',
  };

  const toggleCurrentId = () => {
    setTeamIds((pTeamIds) => {
      const index = pTeamIds.indexOf(teamDetails.teamId);
      if (index < 0) {
        // if the team isn't in the list yet then add it
        return [...pTeamIds, teamDetails.teamId];
      }
      
      // otherwise remove it
      return [
        ...(pTeamIds.slice(0, index)),
        ...(pTeamIds.slice(index + 1))
      ];
    });

  }

  const isEditThisCard = isEditingStatus && (teamDetails.status === 'Pending');
  const isEditNameThisCard = isEditingNameStatus && (teamDetails.teamNameApproved === false);

  const [infoBarOpen, setInfoBarOpen] = useState(false);

  const isEditable = !(roles.includes(CompetitionRole.SiteCoordinator) && !roles.includes(CompetitionRole.Coach) && !roles.includes(CompetitionRole.Admin));
  return (
    <>
    <TeamInfoBar
      buttonConfigurationState={[buttonConfiguration, setButtonConfiguration]}
      teamListState={[teamList, setTeamlist]}
      isOpenState={[infoBarOpen, setInfoBarOpen]}
      teamDetails={teamDetails}
      siteOptionsState={[siteOptions, setSiteOptions]}
      isEditable={isEditable}
    />
    <StyledHoverDiv
      className="team-card-cell"
      $isDragging={isDragging}
      $isEditingStatus={isEditThisCard}
      $isEditingNameStatus={isEditNameThisCard}
      $numMembers={teamDetails.students.length}
      onDoubleClick={() => setInfoBarOpen((p) => !p)}
      {...props} 
    >
      {!isEditNameThisCard &&
      <>
        <CardHeaderDiv $statusColor={colorMap[status]}>
          <TitleSpan>{teamDetails.teamName}</TitleSpan>
          {!teamDetails.teamNameApproved && <RedTeamNameAlert />}
        </CardHeaderDiv>
    
          <TeamMatesContainerDiv>
            {teamDetails.students.map((member, index) => (
              <TeamMemberMotionDiv
                key={`${member.userId}`}
                layoutId={`${member.userId}`}
                layout
                transition={{
                  type: isDragging ? 'spring' : false,
                  duration: DRAG_ANIMATION_DURATION
                }}
                // animate={{ opacity: isDragging ? 0.8 : 1 }}
                className="team-member-cell"
                drag={isEditable}
                $isDraggable={isEditable}


                dragElastic={1}
                dragConstraints={{left: 0, top: 0, right: 0, bottom: 0}}
                onDragStart={() => setIsDragging(true)}
                onDragTransitionEnd={() => setIsDragging(false)}
                onDragEnd={(event, info) => handleDragDropCard(event, info, member, teamDetails.teamId)}
              >
                <TeamCardMember memberName={member.name} />
              </TeamMemberMotionDiv>
            ))}
          
            {isEditThisCard &&
              <ApproveRadio onClick={toggleCurrentId}>
                Approve
              </ApproveRadio>
            }
  
        </TeamMatesContainerDiv>
    </>}

    {isEditNameThisCard &&
      <TeamNameApprovalDiv>
        <TitleSpan style={{ margin: '0', marginBottom: '20px' }}>{teamDetails.teamName}</TitleSpan>
        <ApproveNameRadios
          setTeamIds={setTeamIds}
          setRejectedTeamIds={setRejectedTeamIds}
          teamId={teamDetails.teamId}
        />
      </TeamNameApprovalDiv>
    }
    </StyledHoverDiv>
    </>
  )
}