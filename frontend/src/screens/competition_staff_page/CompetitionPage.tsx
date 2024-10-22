import { FC, useEffect, useState } from "react";
import { MainPageDiv, OverflowFlexBackground, PageOptionsContainerDiv, ToggleOptionDiv } from "./components/PageUtils";
import { PageHeader } from "../../components/page_header/PageHeader";
import { CustomToggleSwitch } from "../../components/toggle_switch/ToggleSwitch";
import styled from "styled-components";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { sendRequest } from "../../utility/request";
import { SortOption } from "../../components/page_header/components/SortSelect";
import { TeamPageButtons } from "./teams_page/components/TeamPageButtons";

const ToggleOptionTextSpan = styled.span`
  
`;

const AdminToggleOptionDiv = styled(ToggleOptionDiv)`
  box-sizing: border-box;
`;

export enum CompetitionRole {
  Participant = 'Participant',
  Coach = 'Coach',
  Admin = 'Admin',
  SiteCoordinator = 'Site-Coordinator'
}

export const CompetitionPage: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [sortOptions, setSortOptions] = useState<Array<SortOption>>([]);

  const [filters, setFilters] = useState<Record<string, Array<string>>>({});
  const [filterOptions, setFilterOptions] = useState<Record<string, Array<string>>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  const [roles, setRoles] = useState<Array<CompetitionRole>>([]);

  ////
  const [enableTeamButtons, setEnableTeamButtons] = useState<boolean>(false);
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [approveTeamIds, setApproveTeamIds] = useState<Array<number>>([]);
  
  const [rejectedTeamIds, setRejectedTeamIds] = useState<Array<number>>([]);
  const [isEditingNameStatus, setIsEditingNameStatus] = useState<boolean>(false);
  ////

  useEffect(() => {
    const fetchRoles = async () => {
      
      const roleResponse = await sendRequest.get<{ roles: Array<CompetitionRole> }>('/competition/roles', { compId });

      const { roles } = roleResponse.data;
      setRoles(roles);

    }

    fetchRoles();

  }, [])

  const removeFilter = (field: string, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      updatedFilters[field] = updatedFilters[field].filter((v) => v !== value);
      if (updatedFilters[field].length === 0) {
        delete updatedFilters[field];
      }
      return updatedFilters; // trigger render to update filter dropdown
    });
  };


  return (
    <OverflowFlexBackground>

      <MainPageDiv>
        <PageHeader
          pageTitle="Admin Page"
          pageDescription="Manage Teams and students for your competition"
          sortOptions={sortOptions}
          sortOptionState={{ sortOption, setSortOption }}
          filterOptions={filterOptions}
          filtersState={{ filters, setFilters }}
          searchTermState={{ searchTerm, setSearchTerm }}
          >
            {enableTeamButtons && <TeamPageButtons
              filtersState={[filters, setFilters]}
              editingStatusState={[isEditingStatus, setIsEditingStatus]}
              teamIdsState={[approveTeamIds, setApproveTeamIds]}
              editingNameStatusState={[isEditingNameStatus, setIsEditingNameStatus]}
              rejectedTeamIdsState={[rejectedTeamIds, setRejectedTeamIds]}
              />}
          </PageHeader>
        <PageOptionsContainerDiv>
          <CustomToggleSwitch style={{ width: '100%', height: '100%' }} defaultBorderIndex={0}>
            
            {(roles.includes(CompetitionRole.Admin) || roles.includes(CompetitionRole.Coach) || roles.includes(CompetitionRole.SiteCoordinator)) &&
            <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/teams/${compId}`) }}>
              <ToggleOptionTextSpan>Teams</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}

            {(roles.includes(CompetitionRole.Admin) || roles.includes(CompetitionRole.Coach)) &&
              <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/students/${compId}`) }}>
              <ToggleOptionTextSpan>Students</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}

            {(roles.includes(CompetitionRole.Admin)) &&
            <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/staff/${compId}`) }}>
              <ToggleOptionTextSpan>Staff</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}
            
            {roles.includes(CompetitionRole.Admin) &&
            <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/site/${compId}`) }}>
              <ToggleOptionTextSpan>Site</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}

            {roles.includes(CompetitionRole.SiteCoordinator) &&
            <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/site/${compId}`) }}>
              <ToggleOptionTextSpan>Attendees</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}

          </CustomToggleSwitch>
        </PageOptionsContainerDiv>

        <Outlet context={{ filters, sortOption, searchTerm, removeFilter, setFilters,
          filtersState: [filters, setFilters], editingStatusState: [isEditingStatus, setIsEditingStatus],
          teamIdsState: [approveTeamIds, setApproveTeamIds],
          editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
          rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],

          setFilterOptions, setSortOptions, setEnableTeamButtons }}/>

      </MainPageDiv>
    </OverflowFlexBackground>
  )
}