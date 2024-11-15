import { FC, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useTheme } from "styled-components";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";
import { Student, TeamDetails } from "../../../../../../../shared_types/Competition/team/TeamDetails";
import Fuse from "fuse.js";
import { PanInfo } from "framer-motion";
import { addStudentToTeam } from "./utility/addStudentToTeam";
import { fetchTeams } from "../../utils/fetchTeams";
import { DRAG_ANIMATION_DURATION, TeamCard } from "./subcomponents/TeamCard/TeamCard";
import { sendRequest } from "../../../../../../utility/request";
import { StyledHeading, StyledOverlay, StyledTeamCardGridDisplay } from "./TeamPage.styles";
import { ThirdStepPopUp } from "../../../../../student/subcomponents/popups/ThirdStepPopUp";
import { StyledFilterTagButton, StyledRemoveFilterIcon } from "../../../../../dashboard/Dashboard.styles";
import { ResponsiveActionButton } from "../../../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { FaSave } from "react-icons/fa";
import { TransparentResponsiveButton } from "../../../../../../components/responsive_fields/ResponsiveButton";
import { GiCancel } from "react-icons/gi";

export type DragEndEvent = MouseEvent | TouchEvent | PointerEvent;

const TEAM_DISPLAY_SORT_OPTIONS = [
  { label: "Default", value: "original" },
  { label: "Alphabetical (Name)", value: "name" },
];

const TEAM_DISPLAY_FILTER_OPTIONS = {
  Status: ["Pending", "Unregistered", "Registered"],
  "Team Name Approval": ["Approved", "Unapproved"],
  "Team Level": ["Level A", "Level B"],
};

export const TeamDisplay: FC = () => {
  const { compId } = useParams();
  const theme = useTheme();
  const {
    filters,
    sortOption,
    searchTerm,
    removeFilter,
    setFilters,
    editingStatusState: [isEditingStatus, setIsEditingStatus],
    teamIdsState: [approveTeamIds, setApproveTeamIds],
    rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],

    teamListState: [teamList, setTeamList],
    universityOptionState: [universityOption, setUniversityOption],
    roles,
    editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
    buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
    siteOptionsState: [siteOptions, setSiteOptions],
    setFilterOptions,
    setSortOptions,
  } = useCompetitionOutletContext("teams");

  useEffect(() => {
    setFilterOptions(TEAM_DISPLAY_FILTER_OPTIONS);
    setSortOptions(TEAM_DISPLAY_SORT_OPTIONS);
  }, []);

  const filteredTeamList = teamList.filter((team: TeamDetails) => {
    if (filters.Status) {
      if (
        !filters.Status.some(
          (status) =>
            status.toLocaleLowerCase() === team.status.toLocaleLowerCase()
        )
      ) {
        return false;
      }
    }

    if (filters["Team Name Approval"]) {
      if (
        !filters["Team Name Approval"].some(
          (approvalString) =>
            (approvalString === "Approved") === team.teamNameApproved
        )
      ) {
        return false;
      }
    }

    if (filters["Team Level"]) {
      if (!filters["Team Level"].some(
        (filterLevel) =>
          filterLevel === team.teamLevel
      )) {
        return false;
      }
    }

    // if admin, check filter by chosen uni
    if (universityOption.value && !(team.universityId === parseInt(universityOption.value))) return false;

    return true;
  });

  const sortedTeamList = filteredTeamList.sort((team1, team2) => {
    if (!sortOption) {
      return 0;
    }

    if (sortOption === "name") {
      return team1.teamName.localeCompare(team2.teamName);
    }

    return 0;
  });

  const fuse = new Fuse(sortedTeamList, {
    keys: ["teamName", "memberName1", "memberName2", "memberName3", "teamLevel"],
    threshold: 0.5,
  });

  let searchedCompetitions;
  if (searchTerm) {
    searchedCompetitions = fuse.search(searchTerm);
  } else {
    searchedCompetitions = sortedTeamList.map((team) => {
      return { item: team };
    });
  }

  const location = useLocation();
  const [isCreationSuccessPopUpOpen, setIsCreationSuccessPopUpOpen] =
    useState(false);

  const handleClosePopUp = () => {
    setIsCreationSuccessPopUpOpen(false);
  };

  useEffect(() => {
    console.log("hello");
    console.log(location.state);
    if (location.state?.isSuccessPopUpOpen) {
      setIsCreationSuccessPopUpOpen(true);
    }
  }, [location.state]);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragDropCard = (
    event: DragEndEvent,
    info: PanInfo,
    student: Student,
    currentTeamId: number
  ) => {
    const mouseX = info.point.x;
    const mouseY = info.point.y;

    const elem = event.target as HTMLElement;
    const draggedElem = elem.closest(".team-member-cell") as HTMLElement;
    if (!draggedElem) {
      return;
    }
    draggedElem.style.pointerEvents = "none";

    const hoveredElement = document.elementFromPoint(mouseX, mouseY);
    const cell = hoveredElement?.closest(".team-card-cell");
    draggedElem.style.pointerEvents = "auto";
    if (!cell) {
      return;
    }
    const postSearchIndex = cell.getAttribute("data-index");
    if (postSearchIndex) {
      const newTeamIndex = teamList.findIndex(
        (team) =>
          team.teamId ===
          searchedCompetitions[parseInt(postSearchIndex)].item.teamId
      );
      const currentTeamIndex = teamList.findIndex(
        (team) => team.teamId === currentTeamId
      );

      if (
        !addStudentToTeam(student, currentTeamIndex, newTeamIndex, [
          teamList,
          setTeamList,
        ])
      ) {
        return;
      }

      setButtonConfiguration((p) => ({
        ...p,
        enableTeamsChangedButtons: true,
      }));

      setTimeout(() => setIsDragging(false), DRAG_ANIMATION_DURATION * 1000);
    }
  };

  const handleClose = async () => {
    setIsDragging(true);
    await fetchTeams(compId, setTeamList);
    setTimeout(() => setIsDragging(false), DRAG_ANIMATION_DURATION * 1000);
    setButtonConfiguration((p) => ({
      ...p,
      enableTeamsChangedButtons: false,
    }));
  };

  const handleSaveChanges = async () => {
    await sendRequest.post("/competition/teams/update", { teamList, compId });

    await handleClose();
    return true;
  };

  return (
    <>
      {isCreationSuccessPopUpOpen && (
        <>
          <StyledOverlay $isOpen={true} />
          <ThirdStepPopUp
            heading={
              <StyledHeading>
                The competition has successfully {"\nbeen created"}{" "}
              </StyledHeading>
            }
            onClose={handleClosePopUp}
          />
        </>
      )}
      <div>
        {Object.entries(filters).map(([field, values]) =>
          values.map((value) => (
            <StyledFilterTagButton key={`${field}-${value}`}>
              {value}
              <StyledRemoveFilterIcon
                onClick={(e) => {
                  e.stopPropagation();
                  removeFilter(field, value);
                }}
              />
            </StyledFilterTagButton>
          ))
        )}
        {
          <div
            style={{
              display: "flex",
              marginTop: "5px",
              marginBottom: "-25px",
              width: "100%",
              height: buttonConfiguration.enableTeamsChangedButtons
                ? "35px"
                : "0",
              transition: "height 0.25s ease",
            }}
          >
            <ResponsiveActionButton
              style={{ height: "100%" }}
              icon={<FaSave />}
              label="Save"
              question="Do you want to save your changes"
              actionType="confirm"
              handleSubmit={handleSaveChanges}
            />
            <div style={{ maxWidth: "150px", width: "100%", height: "100%" }}>
              <TransparentResponsiveButton
                style={{ backgroundColor: theme.colours.cancel }}
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
      <StyledTeamCardGridDisplay>
        {searchedCompetitions.map(({ item: teamDetails }, index) => {
          return (
            <TeamCard
              // handler to take in memberId and newTeamID (updates list of teams)
              data-index={index}
              roles={roles}
              siteOptionsState={[siteOptions, setSiteOptions]}
              handleDragDropCard={handleDragDropCard}
              isDraggingState={[isDragging, setIsDragging]}
              teamIdsState={[approveTeamIds, setApproveTeamIds]}
              rejectedTeamIdsState={[rejectedTeamIds, setRejectedTeamIds]}
              isEditingStatus={isEditingStatus}
              isEditingNameStatus={isEditingNameStatus}
              teamListState={[teamList, setTeamList]}
              buttonConfigurationState={[
                buttonConfiguration,
                setButtonConfiguration,
              ]}
              key={`${teamDetails.teamName}${teamDetails.status}${index}`}
              teamDetails={teamDetails}
            />
          );
        })}
      </StyledTeamCardGridDisplay>
    </>
  );
};
