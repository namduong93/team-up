import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
// import { CompetitionDetails, CompetitionRole } from "../CompetitionPage";
import { CompetitionRole } from "../../../../shared_types/Competition/CompetitionRole";
import { CompetitionDetails } from "../CompetitionPage";
import { TeamDetails } from "../../../../shared_types/Competition/team/TeamDetails";
import { StudentInfo } from "../../../../shared_types/Competition/student/StudentInfo";
import { StaffInfo } from "../../../../shared_types/Competition/staff/StaffInfo";
import { AttendeesDetails } from "../../../../shared_types/Competition/staff/AttendeesDetails";

export interface ButtonConfiguration {
  enableTeamButtons: boolean;
  enableAttendeesButtons: boolean;
  enableStudentButtons: boolean;
  enableStaffButtons: boolean;
  enableTeamsChangedButtons: boolean;
}

export interface CompetitionPageContext {
  filters: Record<string, Array<string>>;
  sortOption: string;
  searchTerm: string;
  removeFilter: (field: string, value: string) => Record<string, string>;
  setFilterOptions: React.Dispatch<
    React.SetStateAction<Record<string, Array<string>>>
  >;
  setSortOptions: React.Dispatch<
    React.SetStateAction<Array<{ label: string; value: string }>>
  >;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [
    Array<number>,
    React.Dispatch<React.SetStateAction<Array<number>>>
  ];
  editingNameStatusState: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ];
  rejectedTeamIdsState: [
    Array<number>,
    React.Dispatch<React.SetStateAction<Array<number>>>
  ];
  universityOption: { value: string; label: string };
  roles: Array<CompetitionRole>;
  teamListState: [
    Array<TeamDetails>,
    React.Dispatch<React.SetStateAction<Array<TeamDetails>>>
  ];
  studentsState: [
    Array<StudentInfo>,
    React.Dispatch<React.SetStateAction<Array<StudentInfo>>>
  ];
  attendeesListState: [
    Array<AttendeesDetails>,
    React.Dispatch<React.SetStateAction<Array<AttendeesDetails>>>
  ];
  staffListState: [
    Array<StaffInfo>,
    React.Dispatch<React.SetStateAction<Array<StaffInfo>>>
  ];
  compDetails: CompetitionDetails;

  buttonConfigurationState: [
    ButtonConfiguration,
    React.Dispatch<React.SetStateAction<ButtonConfiguration>>
  ];
  siteOptionsState: [
    Array<{ value: string; label: string }>,
    React.Dispatch<React.SetStateAction<Array<{ value: string; label: string }>>>
  ];
  universityOptionsState: [
    Array<{ value: string; label: string }>,
    React.Dispatch<React.SetStateAction<Array<{ value: string; label: string }>>>
  ];
  dropdownOptionsState: [
    Array<{ value: string; label: string }>,
    React.Dispatch<React.SetStateAction<Array<{ value: string; label: string }>>>
  ];
}

export const useCompetitionOutletContext = (page: string) => {
  const context = useOutletContext<CompetitionPageContext>();
  const {
    filters,
    sortOption,
    searchTerm,
    removeFilter,
    setFilters,
    editingStatusState: [isEditingStatus, setIsEditingStatus],
    teamIdsState: [approveTeamIds, setApproveTeamIds],
    universityOption,
    roles,
    teamListState: [teamList, setTeamList],
    editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
    rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
    setFilterOptions,
    setSortOptions,
    buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
    studentsState: [students, setStudents],
    attendeesListState: [attendeesList, setAttendeesList],
    universityOptionsState: [universityOptions, setUniversityOptions],
    siteOptionsState: [siteOptions, setSiteOptions],
    dropdownOptionsState: [dropdownOptions, setDropdownOptions],
    compDetails,
  } = context;

  useEffect(() => {
    setIsEditingStatus(false);
    setApproveTeamIds([]);
    setFilters({});
    setIsEditingNameStatus(false);
    setRejectedTeamIds([]);

    if (page === 'attendees') {
      setDropdownOptions(siteOptions);
    } else {
      setDropdownOptions(universityOptions);
    }

    // enable the team buttons on the team page and not on the non-team page
    if (page === 'teams') {
      setButtonConfiguration((p) => ({
        ...p,
        enableTeamButtons: (roles.includes(CompetitionRole.Admin) || roles.includes(CompetitionRole.Coach)),
        enableStudentButtons: false,
        enableStaffButtons: false,
        enableAttendeesButtons: false,
      }));
      return;
    }
    
    if (page === 'students') {
      setButtonConfiguration((p) => ({
        ...p,
        enableTeamButtons: false,
        enableStudentButtons: true,
        enableStaffButtons: false,
        enableAttendeesButtons: false,
      }));
      return;
    }
  
    if (page === 'staff') {
      setButtonConfiguration((p) => ({
        ...p,

        enableTeamButtons: false,
        enableStudentButtons: false,
        enableStaffButtons: true,
        enableAttendeesButtons: false,
      }));
      return;
    }
  
    if (page === 'attendees') {
      setButtonConfiguration((p) => ({
        ...p,

        enableTeamButtons: false,
        enableStudentButtons: false,
        enableStaffButtons: false,
        enableAttendeesButtons: true,
      }));
      return;
    }

    setButtonConfiguration((p) => ({
      ...p,
      enableTeamButtons: false,
      enableStudentButtons: false,
      enableStaffButtons: false,
      enableAttendeesButtons: false,
    }));
    return;
  }, [roles]);

  return context;
};
