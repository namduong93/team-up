import { FC, useState } from "react";
import { MainPageDiv, OverflowFlexBackground, PageOptionsContainerDiv, ToggleOptionDiv } from "../CoachPage/CoachPage";
import { useDashInfo } from "../../Dashboard/useDashInfo";
import { DashboardSidebar } from "../../../components/general_utility/DashboardSidebar";
import { PageHeader } from "../../../components/sort_filter_search/PageHeader";
import { CustomToggleSwitch } from "../../../components/general_utility/ToggleSwitch";
import styled from "styled-components";
import { Outlet, useNavigate, useParams } from "react-router-dom";

const ToggleOptionTextSpan = styled.span`
  font-size: clamp(0.9em, 3.5vw, 2em);
`;

const AdminToggleOptionDiv = styled(ToggleOptionDiv)`
  box-sizing: border-box;
`;


export const AdminPage: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const [dashInfo, _] = useDashInfo();
  const [sortOption, setSortOption] = useState<string | null>(null);
  const sortOptions = [
    { label: "Default", value: "original" },
    { label: "Alphabetical (Name)", value: "name" },
    { label: "Competition Date", value: "date" },
    { label: "Alphabetical (Location)", value: "location" },
    { label: "Time Remaining", value: "timeRemaining" },
  ];

  const [filters, setFilters] = useState<Record<string, Array<string>>>({});
  const filterOptions = {
    Location: ['USA', 'UK'],
    Role: ['Admin', 'Site-Coordinator', 'Coach'],
    Status: ["Completed", "Upcoming"],
    Year: ['2020', '2021', '2022', '2024'],
  };

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

  const [searchTerm, setSearchTerm] = useState('');

  return (
    <OverflowFlexBackground>
      <DashboardSidebar sidebarInfo={dashInfo} cropState={false} />

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
          <CustomToggleSwitch style={{ width: '100%', height: '100%', maxWidth: '600px' }} defaultBorderIndex={0}>
            
            <AdminToggleOptionDiv onClick={() => { navigate(`/admin/page/teams/${compId}`) }}>
              <ToggleOptionTextSpan>Teams</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>

            <AdminToggleOptionDiv onClick={() => { navigate(`/admin/page/students/${compId}`) }}>
              <ToggleOptionTextSpan>Students</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>

            <AdminToggleOptionDiv onClick={() => { navigate(`/admin/page/staff/${compId}`) }}>
              <ToggleOptionTextSpan>Staff</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>

            <AdminToggleOptionDiv onClick={() => { navigate(`/admin/page/site/${compId}`) }}>
              <ToggleOptionTextSpan>Site</ToggleOptionTextSpan>
            </AdminToggleOptionDiv>

          </CustomToggleSwitch>
        </PageOptionsContainerDiv>

        <Outlet context={{ filters, sortOption, searchTerm, removeFilter }}/>

      </MainPageDiv>
    </OverflowFlexBackground>
  )
}