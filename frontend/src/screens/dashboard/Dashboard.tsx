import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { FlexBackground } from "../../components/general_utility/Background";
import { FaTimes } from "react-icons/fa";
import { CompCard } from "./components/CompCard";
import { sendRequest } from "../../utility/request";
import { useLocation, useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/page_header/PageHeader";
import {
  Input,
  RegisterPopUp,
} from "../../components/general_utility/RegisterPopUp";
import { IoIosCreate } from "react-icons/io";
import { MdAssignmentAdd } from "react-icons/md";
import { DashInfo } from "./hooks/useDashInfo";
import { ResponsiveActionButton } from "../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { OptionPopUp } from "../student/OptionPopUp";
import { ErrorMessage } from "../authentication/registration/AccountInformation";

interface Competition {
  compName: string;
  location: string;
  compDate: string; // format: "YYYY-MM-DD"
  roles: string[];
  compId: string;
  compCreatedDate: string;
}

interface DashboardsProps {
  dashInfo: DashInfo;
}

const OverflowFlexBackground = styled(FlexBackground)`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  height: 100vh;
  background-color: ${({ theme }) => theme.background};
`;

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 600px;
  /* overflow-y: hidden; */
  overflow-x: visible;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const AlertButton = styled.button`
  border-radius: 10px;
  padding: 0px;
  background-color: ${({ theme }) => theme.colours.notifLight};
  color: ${({ theme }) => theme.colours.notifDark};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.notifDark};
    color: ${({ theme }) => theme.colours.notifLight};
  }
`;

export const SortButton = styled.button<{ $isSortOpen: boolean }>`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.filterText};
  color: ${({ theme }) => theme.colours.filterText};
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;

  ${({ $isSortOpen: isSortOpen, theme }) =>
    isSortOpen &&
    `
    background-color: ${theme.colours.sidebarBackground};
    color: ${theme.fonts.colour};
  `}

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;

export const FilterTagButton = styled.button`
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  border-radius: 10px;
  padding: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  cursor: auto;
  box-sizing: border-box;
`;

export const RemoveFilterIcon = styled(FaTimes)`
  margin-left: 5px;
  color: ${({ theme }) => theme.fonts.colour};
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

const ContentArea = styled.div`
  margin-top: 32px;
  overflow-y: auto;
  overflow-x: auto;
  flex: 1;
  max-height: calc(100vh - 200px);
`;

const CompetitionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(294px, 100%), 1fr));
  gap: 20px;
  width: 100%;
  min-height: 500px;
  /* padding: 0 20px; */
  box-sizing: border-box;
`;

const Title2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const Dashboard: FC<DashboardsProps> = ({ dashInfo }) => {
  const [filters, setFilters] = useState<{ [field: string]: string[] }>({});

  const [searchTerm, setSearchTerm] = useState("");

  const [sortOption, setSortOption] = useState<string | null>(null);
  const sortOptions = [
    { label: "Default", value: "original" },
    { label: "Alphabetical (Name)", value: "name" },
    { label: "Competition Date", value: "date" },
    { label: "Alphabetical (Location)", value: "location" },
    { label: "Time Remaining", value: "timeRemaining" },
  ];

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userType, setUserType] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const typeResponse = await sendRequest.get<{ type: string }>(
          "/user/type"
        );
        setUserType(typeResponse.data.type);
        setIsAdmin(typeResponse.data.type === "system_admin");
        setIsLoaded(true);

        const fakeComps = await sendRequest.get<{
          competitions: Competition[];
        }>("/competitions/list");
        const formattedCompetitions = fakeComps.data.competitions.map(
          (comp) => ({
            ...comp,
            compDate: new Date(comp.compDate).toISOString().split("T")[0],
            compCreatedDate: new Date(comp.compCreatedDate)
              .toISOString()
              .split("T")[0],
          })
        );
        setCompetitions(formattedCompetitions);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          setIsLoaded(false);
          navigate("/");
          console.log("Authentication Error: ", error);
        });
        // can handle other codes or types of errors here if needed.
      }
    })();
  }, []);

  // "YYYY-MM-DD" format
  const today = new Date().toISOString().split("T")[0];

  // filter options based on the Competition fields (location, role, status, year)
  const filterOptions = {
    Location: Array.from(
      new Set(competitions.map((comp) => comp.location))
    ).sort(),
    Role: Array.from(new Set(competitions.flatMap((comp) => comp.roles))),
    Status: ["Completed", "Upcoming"],
    Year: Array.from(
      new Set(competitions.map((comp) => comp.compDate.split("-")[0]))
    ).sort((a, b) => parseInt(a) - parseInt(b)),
  };

  // // click outside filter to close popup
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
  //       setIsFilterOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

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

  const matchesSearch = (comp: Competition) => {
    const searchLower = searchTerm.toLowerCase();
    const compDateMonth = new Date(comp.compDate)
      .toLocaleString("default", { month: "long" })
      .toLowerCase();

    return (
      comp.compName.toLowerCase().includes(searchLower) ||
      comp.location.toLowerCase().includes(searchLower) ||
      comp.roles.some((role) => role.toLowerCase().includes(searchLower)) ||
      compDateMonth.includes(searchLower)
    );
  };

  const filteredCompetitions = competitions.filter((comp) => {
    return (
      matchesSearch(comp) && // filter by search criteria
      Object.keys(filters).every((field) => {
        if (!filters[field].length) return true;
        if (field === "Status") {
          return (
            (comp.compDate < today && filters[field].includes("Completed")) ||
            (comp.compDate >= today && filters[field].includes("Upcoming"))
          );
        }
        if (field === "Year") {
          return filters[field].includes(comp.compDate.split("-")[0]);
        }
        return filters[field].some((filterValue) => {
          if (field === "Location") {
            return comp.location === filterValue;
          }
          if (field === "Role") {
            return comp.roles.includes(filterValue);
          }
          return false;
        });
      })
    );
  });

  // click outside sort to close popup
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
  //       setIsSortOpen(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [sortRef]);

  const sortedCompetitions = [...filteredCompetitions].sort((a, b) => {
    const defaultIndices = filteredCompetitions.map((comp) => comp.compId);

    switch (sortOption) {
      case "name":
        return a.compName.localeCompare(b.compName);
      case "date":
        return new Date(a.compDate).getTime() - new Date(b.compDate).getTime();
      case "location":
        return a.location.localeCompare(b.location);
      case "timeRemaining": {
        const aRemaining = new Date(a.compDate).getTime() - Date.now();
        const bRemaining = new Date(b.compDate).getTime() - Date.now();
        return aRemaining - bRemaining;
      }
      case "original":
        return (
          defaultIndices.indexOf(a.compId) - defaultIndices.indexOf(b.compId)
        );
      default:
        return 0;
    }
  });

  const location = useLocation();
  const [isRegoSucessPopUpOpen, setRegoSuccessPopUp] = useState(false);

  useEffect(() => {
    if (location.state?.isRegoSuccessPopUpOpen) {
      setRegoSuccessPopUp(true);
    }
  }, [location.state]);

  const [isStaffRegoPopUpOpen, setStaffRegoPopUpOpen] = useState(false);
  useEffect(() => {
    if (location.state?.isStaffRegoPopUpOpen) {
      setStaffRegoPopUpOpen(true);
    }
  }, [location.state]);

  const [isJoinPopUpOpen, setIsJoinPopUpOpen] = useState(false);
  const [teamName, setTeamName] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.joined) {
      setIsJoinPopUpOpen(true);
      setTeamName(location.state.teamName);
    }
  }, [location.state]);

  const [compRegisterCode, setCompRegisterCode] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegisterConfirm = async () => {
    const validateCode = async () => {
      try {
        await sendRequest.get<{}>("/competition/student/status", {
          code: compRegisterCode,
        });
        // above line will throw if the code is invalid

        setErrorMessage(null); // Clear any previous error message
        return true;
      } catch (error) {
        console.error("Failed to validate competition code:", error);
        setErrorMessage("Invalid competition code. Please try again."); // Set error message
        return false;
      } finally {
      }
    };

    return await validateCode();
  };

  return (
    isLoaded && (
      <OverflowFlexBackground>
        <DashboardContent>
          {/* <CompCreatePopUp isOpen={isPopUpOpen} onClose={handleClosePopUp} message={message} code={code} /> */}

          <PageHeader
            pageTitle="Dashboard"
            pageDescription={`Welcome back, ${dashInfo.preferredName}!`}
            sortOptions={sortOptions}
            filterOptions={filterOptions}
            sortOptionState={{ sortOption, setSortOption }}
            filtersState={{ filters, setFilters }}
            searchTermState={{ searchTerm, setSearchTerm }}
          >
            {isAdmin && (
              <ResponsiveActionButton
                icon={<IoIosCreate />}
                label="Create"
                question="Create a new competition?"
                redirectPath="/competition/create"
                // handleClick={handleCreateClick}
                actionType="secondary"
              />
            )}

            <ResponsiveActionButton
              icon={<MdAssignmentAdd />}
              label="Register"
              question="Register for a new competition?"
              redirectPath={
                userType === "student"
                  ? `/competition/information/${compRegisterCode}`
                  : `/competition/staff/register/${compRegisterCode}`
              }
              actionType="primary"
              handleSubmit={handleRegisterConfirm}
              timeout={2}
              handleClose={() => setErrorMessage(null)}
            >
              <div>
                <Input
                  type="text"
                  placeholder="COMP1234"
                  onChange={(e) => {
                    setCompRegisterCode(e.target.value);
                  }}
                />
              </div>

              <div>
                {errorMessage && (
                  <ErrorMessage style={{ marginTop: "10px" }}>
                    {errorMessage}
                  </ErrorMessage>
                )}
              </div>
            </ResponsiveActionButton>
          </PageHeader>

          {/* Active Filters Display */}
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
          </div>

          <ContentArea>
            <CompetitionGrid>
              {sortedCompetitions.map((comp, index) => (
                <CompCard
                  key={index}
                  compName={comp.compName}
                  location={comp.location}
                  compDate={comp.compDate}
                  roles={comp.roles}
                  compId={comp.compId}
                  compCreationDate={comp.compCreatedDate}
                />
              ))}
            </CompetitionGrid>

            {isRegoSucessPopUpOpen && (
              <RegisterPopUp
                isOpen={isRegoSucessPopUpOpen}
                onClose={() => setRegoSuccessPopUp(false)}
                message={
                  <Title2>
                    You have successfully registered for the Competition!{" "}
                    {"\n\n"}
                    <span style={{ fontWeight: "normal" }}>
                      Please navigate to the Team Profile Page to join a team or
                      invite team members
                    </span>
                  </Title2>
                }
              />
            )}

            {isJoinPopUpOpen && (
              <RegisterPopUp
                isOpen={isJoinPopUpOpen}
                onClose={() => setIsJoinPopUpOpen(false)}
                message={
                  <Title2>
                    You have successfully {"\n"} joined the Team: {"\n\n"}{" "}
                    <span style={{ fontWeight: "normal", fontStyle: "italic" }}>
                      {teamName}
                    </span>
                  </Title2>
                }
              />
            )}

            {isStaffRegoPopUpOpen && (
              <RegisterPopUp
                isOpen={isStaffRegoPopUpOpen}
                onClose={() => setStaffRegoPopUpOpen(false)}
                message={
                  <Title2>
                    Your Request has been {"\n"} sent {"\n\n"} Please wait for{" "}
                    {"\n"} Administrator approval
                  </Title2>
                }
              />
            )}
          </ContentArea>
        </DashboardContent>
      </OverflowFlexBackground>
    )
  );
};
