import { FC, useEffect, useState } from "react";
import { MainPageDiv, OverflowFlexBackground, PageOptionsContainerDiv, ToggleOptionDiv } from "../CoachPage/CoachPage";
import { PageHeader } from "../../../components/sort_filter_search/PageHeader";
import { CustomToggleSwitch } from "../../../components/general_utility/ToggleSwitch";
import styled from "styled-components";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { TEAM_DISPLAY_FILTER_OPTIONS, TEAM_DISPLAY_SORT_OPTIONS } from "../CoachPage/TeamDisplay";
import { sendRequest } from "../../../utility/request";

const ToggleOptionTextSpan = styled.span`
  
`;

const AdminToggleOptionDiv = styled(ToggleOptionDiv)`
  box-sizing: border-box;
`;

export type CompetitionRole = 'participant' | 'coach' | 'admin' | 'site-coordinator';

export const CompetitionPage: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const [sortOption, setSortOption] = useState<string | null>(null);
  const sortOptions = TEAM_DISPLAY_SORT_OPTIONS;

  const [filters, setFilters] = useState<Record<string, Array<string>>>({});
  const filterOptions = TEAM_DISPLAY_FILTER_OPTIONS;
  const [searchTerm, setSearchTerm] = useState('');
  
  const [roles, setRoles] = useState<Array<CompetitionRole>>([]);

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
          />
        <PageOptionsContainerDiv>
          <CustomToggleSwitch style={{ width: '100%', height: '100%' }} defaultBorderIndex={0}>
            
            {(roles.includes('admin') || roles.includes('coach')) &&
            <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/teams/${compId}`) }}>
              <ToggleOptionTextSpan>Teams</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}

            {(roles.includes('admin') || roles.includes('coach')) &&
              <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/students/${compId}`) }}>
              <ToggleOptionTextSpan>Students</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}

            {(roles.includes('admin')) &&
            <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/staff/${compId}`) }}>
              <ToggleOptionTextSpan>Staff</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}
            
            {(roles.includes('site-coordinator') || roles.includes('admin')) &&
            <AdminToggleOptionDiv onClick={() => { navigate(`/competition/page/site/${compId}`) }}>
              <ToggleOptionTextSpan>Site</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>}

          </CustomToggleSwitch>
        </PageOptionsContainerDiv>

        <Outlet context={{ filters, sortOption, searchTerm, removeFilter }}/>

      </MainPageDiv>
    </OverflowFlexBackground>
  )
}