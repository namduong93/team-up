import { FC, useEffect, useState } from "react";
import styled, { ThemeConsumer, useTheme } from "styled-components";
import { useLocation, useParams } from "react-router-dom";
import { FilterTagButton, RemoveFilterIcon } from "../../dashboard/Dashboard";
import Fuse from "fuse.js";
import { useCompetitionOutletContext } from "../hooks/useCompetitionOutletContext";
import { TeamCard, TeamDetails } from "./components/TeamCard";
import { ThirdStepPopUp } from "../../student/ThirdStepPopUp";

import { LayoutGroup, motion, PanInfo } from "framer-motion";
import { Student } from "../../student/TeamProfile";
import { ResponsiveActionButton } from "../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { FaSave } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { TransparentResponsiveButton } from "../../../components/responsive_fields/ResponsiveButton";
import { fetchTeams } from "../CompetitionPage";
import { addStudentToTeam } from "./utility/addStudentToTeam";

export type DragEndEvent = MouseEvent | TouchEvent | PointerEvent;

const TeamCardGridDisplay = styled(motion.div)`
  flex: 1;
  background-color: ${({ theme }) => theme.background};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(294px, 100%), 1fr));
  margin-top: 32px;
  row-gap: 20px;
  overflow: auto;
`;

const TEAM_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
];

const TEAM_DISPLAY_FILTER_OPTIONS = {
  Status: ['Pending', 'Unregistered', 'Registered'],
  "Team Name Approval": ['Approved', 'Unapproved'], 
};

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`
const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`

export const TeamDisplay: FC = () => {
  const { compId } = useParams();
  const theme = useTheme();
  const { filters, sortOption, searchTerm, removeFilter, setFilters,
          editingStatusState: [isEditingStatus, setIsEditingStatus],
          teamIdsState: [approveTeamIds, setApproveTeamIds],
          rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],

          teamListState: [teamList, setTeamList],
          universityOption, roles,
          editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
          buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
          siteOptionsState: [siteOptions, setSiteOptions],
          setFilterOptions, setSortOptions } = useCompetitionOutletContext('teams');

          useEffect(() => {
    setFilterOptions(TEAM_DISPLAY_FILTER_OPTIONS);
    setSortOptions(TEAM_DISPLAY_SORT_OPTIONS);
  }, []);
  
  const filteredTeamList = teamList.filter((team: TeamDetails) => {
    if (filters.Status) {
      if (!filters.Status.some((status) => status.toLocaleLowerCase() === team.status.toLocaleLowerCase())) {
        return false;
      }
    }

    if (filters["Team Name Approval"]) {

      if (!filters["Team Name Approval"].some((approvalString) => 
        (approvalString === 'Approved') === team.teamNameApproved
      )) {
        return false;
      }
    }
    
    if (!(universityOption.value === '') && !(team.universityId === parseInt(universityOption.value))) {
      return false;
    }
    
    return true;
  });


  const sortedTeamList = filteredTeamList.sort((team1, team2) => {
    if (!sortOption) {
      return 0;
    }

    if (sortOption === 'name') {
      return team1.teamName.localeCompare(team2.teamName);
    }

    return 0;
  });

  const fuse = new Fuse(sortedTeamList, {
    keys: ['teamName', 'memberName1', 'memberName2', 'memberName3'],
    threshold: 0.5
  });

  

  let searchedCompetitions;
  if (searchTerm) {
    searchedCompetitions = fuse.search(searchTerm);
  } else {
    searchedCompetitions = sortedTeamList.map((team) => { return { item: team } });
  }

  // handler based on teamList (all the teams) for moving members around (DOUBLE CLICK)
  // oldTeam.members = []
  // newTeam.memebrs = []

  // fitler team list remove those 2 teams, add them, setTeamList

  // and setTeamList

  const location = useLocation();
  const [isCreationSuccessPopUpOpen, setIsCreationSuccessPopUpOpen] = useState(false);

   const handleClosePopUp = () => {
    setIsCreationSuccessPopUpOpen(false);
  }

  useEffect(() => {
    console.log("hello")
    console.log(location.state)
    if (location.state?.isSuccessPopUpOpen) {
      setIsCreationSuccessPopUpOpen(true);
    }
  }, [location.state]);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragDropCard = (event: DragEndEvent, info: PanInfo, student: Student, currentTeamId: number) => {
    const mouseX = info.point.x;
    const mouseY = info.point.y;

    const elem = (event.target as HTMLElement);
    const draggedElem = elem.closest('.team-member-cell') as HTMLElement;
    if (!draggedElem) {
      return;
    }
    draggedElem.style.pointerEvents = 'none';

    const hoveredElement = document.elementFromPoint(mouseX, mouseY);
    const cell = hoveredElement?.closest('.team-card-cell');
    draggedElem.style.pointerEvents = 'auto';
    if (!cell) {
      return;
    }
    const postSearchIndex = cell.getAttribute('data-index');
    if (postSearchIndex) {
      const newTeamIndex = teamList.findIndex((team) => team.teamId === searchedCompetitions[parseInt(postSearchIndex)].item.teamId);
      const currentTeamIndex = teamList.findIndex((team) => team.teamId === currentTeamId);

      if (!addStudentToTeam(student, currentTeamIndex, newTeamIndex, [teamList, setTeamList])) {
        return;
      }

      setButtonConfiguration((p) => ({
        ...p,
        enableTeamsChangedButtons: true
      }));
      
      }

  }

  const handleClose = async () => {
    await fetchTeams(compId, setTeamList);
    setIsDragging(false);
    setButtonConfiguration((p) => ({
      ...p,
      enableTeamsChangedButtons: false
    }));
  }

  const handleSaveChanges = async () => {
    // send backend request here

    await handleClose();
    return true;
  }


  return (
    <>
    {isCreationSuccessPopUpOpen && (
      <>
      <Overlay $isOpen={true} />
      <ThirdStepPopUp
        heading={<Heading>The competition has successfully {"\nbeen created"} </Heading>}
        onClose={handleClosePopUp}
      />
    </>
    )}
    <div>
      {Object.entries(filters).map(([field, values]) =>
        values.map((value) => (
        <FilterTagButton key={`${field}-${value}`}>
          {value} 
          <RemoveFilterIcon 
            onClick={(e) => {
            e.stopPropagation();
            removeFilter(field, value);
            }} 
          />
        </FilterTagButton>
        ))
      )}
      {buttonConfiguration.enableTeamsChangedButtons &&
      <div style={{ display: 'flex', marginTop: '5px', marginBottom: '-25px', width: '100%' }}>
      <ResponsiveActionButton
        icon={<FaSave />}
        label="Save"
        question="Do you want to save your changes"
        actionType="confirm"
        handleSubmit={handleSaveChanges}
      />
      <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
        <TransparentResponsiveButton style={{ backgroundColor: theme.colours.cancel }}
        isOpen={false}
        icon={<GiCancel />}
        label="Cancel"
        actionType="error"
        onClick={handleClose}
        />
      </div>
      </div>
      }
    </div>
      <TeamCardGridDisplay>
        {searchedCompetitions.map(({item: teamDetails}, index) => {
          return (
          <TeamCard
          // handler to take in memberId and newTeamID (updates list of teams)
            data-index={index}
            siteOptionsState={[siteOptions, setSiteOptions]}
            handleDragDropCard={handleDragDropCard}
            isDraggingState={[isDragging, setIsDragging]}
            teamIdsState={[approveTeamIds, setApproveTeamIds]}
            rejectedTeamIdsState={[rejectedTeamIds, setRejectedTeamIds]}
            isEditingStatus={isEditingStatus}
            isEditingNameStatus={isEditingNameStatus}
            teamListState={[teamList, setTeamList]}
            buttonConfigurationState={[buttonConfiguration, setButtonConfiguration]}
            key={`${teamDetails.teamName}${teamDetails.status}${index}`}
            teamDetails={teamDetails} />)
        })}
      </TeamCardGridDisplay>
    </>
  )
}