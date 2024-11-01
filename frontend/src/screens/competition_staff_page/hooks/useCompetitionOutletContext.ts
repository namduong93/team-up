import React, { ReactNode, useEffect } from "react";
import { useOutletContext } from "react-router-dom"
import { TeamDetails } from "../teams_page/components/TeamCard";
import { StudentInfo } from "../students_page/StudentDisplay";
import { AttendeesDetails } from "../attendees_page/AttendeesPage";
import { StaffDetails } from "../staff_page/StaffDisplay";
import { CompetitionDetails, CompetitionRole } from "../CompetitionPage";

export interface ButtonConfiguration {
  enableTeamButtons: boolean;
  enableAttendeesButtons: boolean;
  enableStudentButtons: boolean;
  enableStaffButtons: boolean;
}

export interface CompetitionPageContext {
  filters: Record<string, Array<string>>;
  sortOption: string;
  searchTerm: string;
  removeFilter: (field: string, value: string) => Record<string, string>;
  setFilterOptions: React.Dispatch<React.SetStateAction<Record<string, Array<string>>>>;
  setSortOptions: React.Dispatch<React.SetStateAction<Array<{ label: string, value: string }>>>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  editingNameStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  rejectedTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  universityOption: { value: string, label: string };
  roles: Array<string>;
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
  studentsState: [Array<StudentInfo>, React.Dispatch<React.SetStateAction<Array<StudentInfo>>>];
  attendeesListState: [Array<AttendeesDetails>, React.Dispatch<React.SetStateAction<Array<AttendeesDetails>>>];
  staffListState: [Array<StaffDetails>, React.Dispatch<React.SetStateAction<Array<StaffDetails>>>];
  compDetails: CompetitionDetails;

  buttonConfigurationState: [ButtonConfiguration, React.Dispatch<React.SetStateAction<ButtonConfiguration>>];
}

export const useCompetitionOutletContext = (page: string) => {
  const context = useOutletContext<CompetitionPageContext>();
  const { filters, sortOption, searchTerm, removeFilter, setFilters,
    editingStatusState: [isEditingStatus, setIsEditingStatus],
    teamIdsState: [approveTeamIds, setApproveTeamIds],
    universityOption, roles,
    teamListState: [teamList, setTeamList],
    editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
    rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
    setFilterOptions, setSortOptions, buttonConfigurationState: [buttonConfiguration, setButtonConfiguration],
    studentsState: [students, setStudents],
    attendeesListState: [attendeesList, setAttendeesList],
    compDetails,
  } = context;

  useEffect(() => {
    setIsEditingStatus(false);
    setApproveTeamIds([]);
    setFilters({});
    setIsEditingNameStatus(false);
    setRejectedTeamIds([]);
    
    // enable the team buttons on the team page and not on the non-team page
    if (page === 'teams') {
      setButtonConfiguration({
        enableTeamButtons: (roles.includes(CompetitionRole.Admin) || roles.includes(CompetitionRole.Coach)),
        enableStudentButtons: false,
        enableStaffButtons: false,
        enableAttendeesButtons: false,
      });
      return;
    }
  
    if (page === 'students') {
      setButtonConfiguration({
        enableTeamButtons: false,
        enableStudentButtons: true,
        enableStaffButtons: false,
        enableAttendeesButtons: false,
      });
      return;
    }
  
    if (page === 'staff') {
      setButtonConfiguration({
        enableTeamButtons: false,
        enableStudentButtons: false,
        enableStaffButtons: true,
        enableAttendeesButtons: false,
      });
      return;
    }
  
    if (page === 'attendees') {
      setButtonConfiguration({
        enableTeamButtons: false,
        enableStudentButtons: false,
        enableStaffButtons: false,
        enableAttendeesButtons: true,
      });
      return;
    }

    setButtonConfiguration({
      enableTeamButtons: false,
      enableStudentButtons: false,
      enableStaffButtons: false,
      enableAttendeesButtons: false,
    });
    return;
    

  }, [roles]);

  return context;
}