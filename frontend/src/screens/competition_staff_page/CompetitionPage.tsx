import React, { FC, useEffect, useState } from "react";
import {
  MainPageDiv,
  OverflowFlexBackground,
  PageOptionsContainerDiv,
  ToggleOptionDiv,
} from "./components/PageUtils";
import { PageHeader } from "../../components/page_header/PageHeader";
import { CustomToggleSwitch } from "../../components/toggle_switch/ToggleSwitch";
import styled from "styled-components";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { sendRequest } from "../../utility/request";
import { SortOption } from "../../components/page_header/components/SortSelect";
import { TeamPageButtons } from "./teams_page/components/TeamPageButtons";
import { AdvancedDropdown } from "../../components/AdvancedDropdown/AdvancedDropdown";
import {
  SiteLocation,
  OtherSiteLocation,
} from "../competition/creation/CompDetails";
import { CompetitionRole } from "../../../shared_types/Competition/CompetitionRole";
import { ButtonConfiguration } from "./hooks/useCompetitionOutletContext";
import { AttendeesPageButtons } from "./attendees_page/components/AttendeesPageButtons";
import { CompetitionSite } from "../../../shared_types/Competition/CompetitionSite";
import { TeamDetails } from "../../../shared_types/Competition/team/TeamDetails";
import { StudentInfo } from "../../../shared_types/Competition/student/StudentInfo";
import { AttendeesDetails } from "../../../shared_types/Competition/staff/AttendeesDetails";
import { StaffInfo } from "../../../shared_types/Competition/staff/StaffInfo";

const ToggleOptionTextSpan = styled.span``;

const AdminToggleOptionDiv = styled(ToggleOptionDiv)`
  box-sizing: border-box;
`;

export interface CompetitionDetails {
  id?: number;
  name: string;
  teamSize?: number;
  createdDate: EpochTimeStamp;
  earlyRegDeadline: EpochTimeStamp;
  startDate: EpochTimeStamp;
  generalRegDeadline: EpochTimeStamp;
  siteLocations?: SiteLocation[];
  otherSiteLocations?: OtherSiteLocation[];
  code?: string;
  region: string;
  information?: string;
}

export const fetchTeams = async (
  compId: string | undefined,
  setTeams: React.Dispatch<React.SetStateAction<Array<TeamDetails>>>
) => {
  try {
    const response = await sendRequest.get<{ teamList: Array<TeamDetails> }>(
      "/competition/teams",
      { compId }
    );
    const { teamList } = response.data;
    console.log(teamList);
    setTeams(teamList.map((team) => ({ ...team, students: team.students.filter((student) => student.userId !== null) })));

  } catch (error: unknown) {
    console.log(error);
  }
};

export const CompetitionPage: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const [sortOption, setSortOption] = useState<string | null>(null);
  const [sortOptions, setSortOptions] = useState<Array<SortOption>>([]);

  const [filters, setFilters] = useState<Record<string, Array<string>>>({});
  const [filterOptions, setFilterOptions] = useState<
    Record<string, Array<string>>
  >({});
  const [searchTerm, setSearchTerm] = useState("");

  const [roles, setRoles] = useState<Array<CompetitionRole>>([]);

  const [buttonConfiguration, setButtonConfiguration] =
    useState<ButtonConfiguration>({
      enableTeamButtons: false,
      enableAttendeesButtons: false,
      enableStudentButtons: false,
      enableStaffButtons: false,
      enableTeamsChangedButtons: false,
    }
  );


  ////
  const [isEditingStatus, setIsEditingStatus] = useState<boolean>(false);
  const [approveTeamIds, setApproveTeamIds] = useState<Array<number>>([]);

  const [rejectedTeamIds, setRejectedTeamIds] = useState<Array<number>>([]);
  const [registeredTeamIds, setRegisteredTeamIds] = useState<Array<number>>([]);
  const [isEditingNameStatus, setIsEditingNameStatus] =
    useState<boolean>(false);

  const [teamList, setTeamList] = useState<Array<TeamDetails>>([]);
  const [students, setStudents] = useState<Array<StudentInfo>>([]);
  const [attendeesList, setAttendeesList] = useState<Array<AttendeesDetails>>(
    []
  );
  const [staffList, setStaffList] = useState<Array<StaffInfo>>([]);
  const [compDetails, setCompDetails] = useState<CompetitionDetails>({
    id: 0,
    name: "",
    teamSize: 3,
    createdDate: Date.now(),
    earlyRegDeadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
    startDate: Date.now() + 14 * 24 * 60 * 60 * 1000, // 14 days from now
    generalRegDeadline: Date.now() + 10 * 24 * 60 * 60 * 1000, // 10 days from now
    siteLocations: [],
    otherSiteLocations: [],
    code: "",
    region: "Unknown",
    information: "",
  });
  ////
  const [siteOptions, setSiteOptions] = useState([{ value: '', label: '' }]);


  useEffect(() => {
    const fetchCompetitionDetails = async () => {
      try {
        const response = await sendRequest.get<{
          competition: CompetitionDetails;
        }>("/competition/details", { compId });
        const { competition } = response.data;
        setCompDetails(competition);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err: unknown) {
        /* empty */
      }
    };

    const fetchCompetitionTeams = async () => {
      fetchTeams(compId, setTeamList);
    };

    const fetchStudents = async () => {
      const studentsResponse = await sendRequest.get<{
        students: Array<StudentInfo>;
      }>("/competition/students", { compId: parseInt(compId as string) });
      const { students } = studentsResponse.data;
      setStudents(students);
    };

    const fetchAttendeesList = async () => {
      const attendeesResponse = await sendRequest.get<{
        attendees: Array<AttendeesDetails>;
      }>("/competition/attendees", { compId });
      const { attendees } = attendeesResponse.data;
      setAttendeesList(attendees);
    };

    const fetchStaffList = async () => {
      const staffResponse = await sendRequest.get<{
        staff: Array<StaffInfo>;
      }>("/competition/staff", { compId });
      const { staff } = staffResponse.data;
      setStaffList(staff);
    };

    const fetchSites = async () => {
      try {
        const response = await sendRequest.get<{
          sites: Array<CompetitionSite>;
        }>("/competition/sites", { compId });
        const { sites } = response.data;
        setSiteOptions(
          sites.map((site) => ({ value: String(site.id), label: site.name }))
        );
      } catch (error: unknown) {
        console.error("Error fetching sites:", error);
      }
    };

    const fetchUniversities = async () => {
      const response = await sendRequest.get<{
        universities: Array<{ id: number; name: string }>;
      }>("/universities/list");
      const { universities } = response.data;
      setOptions([
        ...universities.map(({ id, name }) => ({
          value: String(id),
          label: name,
        })),
      ]);


      // TODO: Change the default to the users' own university
      setUniversityOption({ value: String(universities[0].id), label: universities[0].name });
    };

    const fetchInfo = async () => {
      const roleResponse = await sendRequest.get<{
        roles: Array<CompetitionRole>;
      }>("/competition/roles", { compId });

      const { roles: userRoles } = roleResponse.data;
      setRoles(userRoles);

      if (
        userRoles.includes(CompetitionRole.Admin) ||
        userRoles.includes(CompetitionRole.Coach) ||
        userRoles.includes(CompetitionRole.SiteCoordinator)
      ) {
        fetchCompetitionTeams();
        fetchCompetitionDetails();
      }

      if (
        userRoles.includes(CompetitionRole.Admin) ||
        userRoles.includes(CompetitionRole.Coach)
      ) {
        fetchStudents();
      }

      if (
        userRoles.includes(CompetitionRole.Admin) ||
        userRoles.includes(CompetitionRole.SiteCoordinator)
      ) {
        fetchAttendeesList();
      }

      if (userRoles.includes(CompetitionRole.Admin)) {
        fetchStaffList();
        fetchUniversities();
      }
      
      fetchSites();
    };

    fetchInfo();
  }, []);

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

  const [options, setOptions] = useState<
    Array<{ value: string; label: string }>
  >([{ value: "", label: "" }]);
  const [universityOption, setUniversityOption] = useState<{
    value: string;
    label: string;
  }>({ value: "", label: "" });



  useEffect(() => {
    setUniversityOption(options[0]);
  }, []);

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
          {buttonConfiguration.enableTeamButtons && (
            <TeamPageButtons
              universityOption={universityOption}
              filtersState={[filters, setFilters]}
              editingStatusState={[isEditingStatus, setIsEditingStatus]}
              teamIdsState={[approveTeamIds, setApproveTeamIds]}
              editingNameStatusState={[
                isEditingNameStatus,
                setIsEditingNameStatus,
              ]}
              rejectedTeamIdsState={[rejectedTeamIds, setRejectedTeamIds]}
              registeredTeamIdsState={[registeredTeamIds, setRegisteredTeamIds]}
              teamListState={[teamList, setTeamList]}
              compDetails={compDetails}
            />
          )}

          {buttonConfiguration.enableAttendeesButtons && (
            <AttendeesPageButtons
              attendeesListState={[attendeesList, setAttendeesList]}
              universityOption={universityOption}
              siteOptionsState={[siteOptions, setSiteOptions]}
            />
          )}

          {roles.includes(CompetitionRole.Admin) && (
            <AdvancedDropdown
              style={{ minWidth: "0", maxWidth: "342px", width: "100%" }}
              optionsState={[options, setOptions]}
              defaultSearchTerm={options[0].label}
              setCurrentSelected={setUniversityOption}
              isExtendable={false}
            />
          )}
        </PageHeader>
        <PageOptionsContainerDiv>
          <CustomToggleSwitch
            style={{ width: "100%", height: "100%" }}
            defaultBorderIndex={0}
          >
            {(roles.includes(CompetitionRole.Admin) ||
              roles.includes(CompetitionRole.Coach) ||
              roles.includes(CompetitionRole.SiteCoordinator)) && (
              <AdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/teams/${compId}`);
                }}
              >
                <ToggleOptionTextSpan>Teams</ToggleOptionTextSpan>
              </AdminToggleOptionDiv>
            )}

            {(roles.includes(CompetitionRole.Admin) ||
              roles.includes(CompetitionRole.Coach)) && (
              <AdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/students/${compId}`);
                }}
              >
                <ToggleOptionTextSpan>Students</ToggleOptionTextSpan>
              </AdminToggleOptionDiv>
            )}

            {roles.includes(CompetitionRole.Admin) && (
              <AdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/staff/${compId}`);
                }}
              >
                <ToggleOptionTextSpan>Staff</ToggleOptionTextSpan>
              </AdminToggleOptionDiv>
            )}

            {roles.includes(CompetitionRole.Admin) && (
              <AdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/site/${compId}`);
                }}
              >
                <ToggleOptionTextSpan>Site</ToggleOptionTextSpan>
              </AdminToggleOptionDiv>
            )}

            {roles.includes(CompetitionRole.SiteCoordinator) && (
              <AdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/site/${compId}`);
                }}
              >
                <ToggleOptionTextSpan>Attendees</ToggleOptionTextSpan>
              </AdminToggleOptionDiv>
            )}

            {(roles.includes(CompetitionRole.Admin) ||
              roles.includes(CompetitionRole.Coach) ||
              roles.includes(CompetitionRole.SiteCoordinator)) && (
              <AdminToggleOptionDiv
                onClick={() => {
                  navigate(`/competition/page/manage/${compId}`);
                }}
              >
                <ToggleOptionTextSpan>Manage</ToggleOptionTextSpan>
              </AdminToggleOptionDiv>
            )}
          </CustomToggleSwitch>
        </PageOptionsContainerDiv>

        <Outlet
          context={{
            filters,
            sortOption,
            searchTerm,
            removeFilter,
            setFilters,
            roles,
            filtersState: [filters, setFilters],
            editingStatusState: [isEditingStatus, setIsEditingStatus],
            teamIdsState: [approveTeamIds, setApproveTeamIds],
            editingNameStatusState: [
              isEditingNameStatus,
              setIsEditingNameStatus,
            ],
            rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
            registeredTeamIdsState: [registeredTeamIds, setRegisteredTeamIds],
            teamListState: [teamList, setTeamList],
            universityOption,

            setFilterOptions,
            setSortOptions,
            buttonConfigurationState: [
              buttonConfiguration,
              setButtonConfiguration,
            ],
            studentsState: [students, setStudents],
            attendeesListState: [attendeesList, setAttendeesList],
            staffListState: [staffList, setStaffList],
            compDetails,
            siteOptionsState: [siteOptions, setSiteOptions],
          }}
        />
      </MainPageDiv>
    </OverflowFlexBackground>
  );
};
