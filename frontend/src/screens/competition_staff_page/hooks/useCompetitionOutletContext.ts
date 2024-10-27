import React, { ReactNode, useEffect } from "react";
import { useOutletContext } from "react-router-dom"
import { TeamDetails } from "../teams_page/components/TeamCard";

export interface CompetitionPageContext {
  filters: Record<string, Array<string>>;
  sortOption: string;
  searchTerm: string;
  removeFilter: (field: string, value: string) => Record<string, string>;
  setFilterOptions: React.Dispatch<React.SetStateAction<Record<string, Array<string>>>>;
  setSortOptions: React.Dispatch<React.SetStateAction<Array<{ label: string, value: string }>>>;
  setEnableTeamButtons: React.Dispatch<React.SetStateAction<ReactNode>>;
  setFilters: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  editingNameStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  rejectedTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  universityOption: { value: string, label: string };
  roles: Array<string>;
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
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
    setFilterOptions, setSortOptions, setEnableTeamButtons } = context;

  useEffect(() => {
    setIsEditingStatus(false);
    setApproveTeamIds([]);
    setFilters({});
    setIsEditingNameStatus(false);
    setRejectedTeamIds([]);
    
    // enable the team buttons on the team page and not on the non-team page
    if (page !== 'teams') {
      setEnableTeamButtons(false);
    } else {
      setEnableTeamButtons(true);
    }
  
    if (page !== 'students') {
  
    } else {
  
    }
  
    if (page !== 'staff') {
  
    } else {
  
    }
  
    if (page === 'site') {
  
    } else {
      
    }

  }, []);

  return context;
}