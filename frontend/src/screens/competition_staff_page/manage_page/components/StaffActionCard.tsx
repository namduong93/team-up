import React, { FC, SetStateAction, useEffect, useState } from "react";
import styled from "styled-components";
import {
  FaFileSignature,
  FaChair,
  FaEdit,
  FaChevronLeft,
  FaCopy,
} from "react-icons/fa";
import { AssignSeats } from "../AssignSeats";
import { BioChangePopUp } from "./BioChangePopUp";
import { EditCompRegoPopUp } from "./EditCompRegoPopUp";
import {
  EditRego,
  EditCourse,
} from "../../../../../shared_types/Competition/staff/Edit";
import { CourseCategory } from "../../../../../shared_types/University/Course";
import { EditSiteCapacityPopUp } from "./EditSiteCapacityPopUp";
import { sendRequest } from "../../../../utility/request";
import { StaffInfo } from "../../../../../shared_types/Competition/staff/StaffInfo";
import { useParams } from "react-router-dom";
import { Announcement } from "../../../../../shared_types/Competition/staff/Announcement";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";

import { EditCompDetailsPopUp } from "./EditCompDetailsPopUp";
import { CompetitionInformation } from "../../../../../shared_types/Competition/CompetitionDetails";
import { CompetitionSite, CompetitionSiteCapacity } from "../../../../../shared_types/Competition/CompetitionSite";
import { CompetitionDetails } from "../../../competition/register/CompInformation";
import { CompetitionRole } from "../../../../../shared_types/Competition/CompetitionRole";

type ActionType =
  | "code"
  | "competition"
  | "registration"
  | "seat"
  | "contact"
  | "capacity";

interface StaffActionCardProps {
}

interface ActionCardProps {
  $actionType: ActionType;
}

const StandardContainerDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  gap: 10px;
  justify-content: flex-start;
`;

const ActionCard = styled.button<ActionCardProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  max-width: 280px;
  height: 100%;
  width: 100%;
  aspect-ratio: 1;
  box-sizing: border-box;
  background-color: ${({ theme, $actionType }) =>
    theme.staffActions[$actionType]};
  border: ${({ theme, $actionType }) =>
    `1px solid ${theme.staffActions[`${$actionType}Border`]}`};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translate(2px, 2px);
  }
`;

const CardIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const CardText = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.fonts.colour};
  margin: 0;
`;

const BackButton = styled.button`
  color: ${({ theme }) => theme.colours.primaryDark};
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-size: 1rem;
  display: flex;
  align-self: flex-start;
  gap: 5px;
  margin: 10px;

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const AssignSeatsPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ManageContainer = styled.div`
  width: 100%;
  height: 70%;
`;

const Code = styled.div`
  font-size: 1rem;
  font-style: ${({ theme }) => theme.fonts.style};
  color: ${({ theme }) => theme.fonts.descriptor};
  background: ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  width: 80%;
  max-width: 400px;
  height: 15%;
  max-height: 25px;
  text-align: center;
  word-wrap: break-word;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;
const CopyCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
`;
export const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  white-space: pre-wrap;
  word-break: break-word;
`;

const CodeCardText = styled(CardText)`
  font-size: 1.25rem;
`;

// const Title2 = styled.h2`
//   margin-top: 40px;
//   margin-bottom: 20px;
//   font-size: 22px;
//   white-space: pre-wrap;
//   word-break: break-word;
// `;

const defaultAnnouncement = `
The ICPC is the premier global programming competition conducted by and for the world’s universities. It fosters creativity, teamwork, and innovation in building new software programs, and enables students to test their ability to perform well under pressure.

3 students, 5 hours  
1 computer, 12 problems* (typical, but varies per contest)

In 2021, more than 50,000 of the finest students in computing disciplines from over 3,000 universities competed worldwide in the regional phases of this contest. We conduct ICPC contests for the South Pacific region, with top teams qualifying to the World Finals.

The detail can be seen at: [sppcontests.org/south-pacific-icpc](https://sppcontests.org/south-pacific-icpc/)`

const Title2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const DEFAULT_REGO_FIELDS = {
  enableCodeforcesField: true,
  enableNationalPrizesField: true,
  enableInternationalPrizesField: true,
  enableRegionalParticipationField: true,
}

export const StaffActionCard: FC<StaffActionCardProps> = ({}) => {
  const { compId } = useParams();
  const [showManageSite, setShowManageSite] = useState(false);
  const [showContactBio, setShowContactBio] = useState(false);
  const [showEditCapacity, setShowEditCapacity] = useState(false);
  const [showEditRego, setShowEditRego] = useState(false);
  const [showEditComp, setShowEditComp] = useState(false);
  const [currentBio, setCurrentBio] = useState("Default Bio");
  const [staffInfo, setStaffInfo] = useState<StaffInfo>();
  const [announcementMessage, setAnnouncementMessage] = useState("");

  const [staffRoles, setRoles] = useState<Array<CompetitionRole>>([]);


  // Fetch the user type and set the state accordingly
  useEffect(() => {
    const fetchRoles = async () => {
      const roleResponse = await sendRequest.get<{ roles: Array<CompetitionRole> }>('/competition/roles', { compId });
      const { roles } = roleResponse.data;
      setRoles(roles);
    }
    fetchRoles();
  }, [])

  const { 
    universityOptionState: [universityOption, setUniversityOption],
    siteOptionState: [siteOption, setSiteOption], teamListState,
    siteOptionsState: [siteOptions, setSiteOptions],
    compDetails
  } = useCompetitionOutletContext(
    "manage",
    showManageSite,
    showManageSite ? 'site' : ''
  );

  const compCode = compDetails.code ?? "COMP1234";

  const actions = [
    {
      type: "code" as ActionType,
      icon: FaCopy,
      text: `Copy Competition Code`,
      roles: [CompetitionRole.Admin, CompetitionRole.Coach, CompetitionRole.SiteCoordinator],
    },
    {
      type: "competition" as ActionType,
      icon: FaEdit,
      text: "Edit Competition Details",
      roles: [CompetitionRole.Admin],
    },
    {
      type: "registration" as ActionType,
      icon: FaFileSignature,
      text: "Update Registration Form",
      roles: [CompetitionRole.Admin, CompetitionRole.Coach],
    },
    {
      type: "seat" as ActionType,
      icon: FaChair,
      text: "Assign Seats to Teams",
      roles: [CompetitionRole.Admin, CompetitionRole.SiteCoordinator],
    },
    {
      type: "contact" as ActionType,
      icon: FaChair,
      text: "Update Your Bio and Annoucements",
      roles: [CompetitionRole.Admin, CompetitionRole.Coach],
    },
    {
      type: "capacity" as ActionType,
      icon: FaChair,
      text: "Update Your Site Capacity",
      roles: [CompetitionRole.Admin, CompetitionRole.SiteCoordinator],
    },
  ];

  // Filter actions based on at least one matching role
  const filteredActions = actions.filter((action) =>
    action.roles.some((role) => staffRoles.includes(role))
  );

  const handleActionClick = (actionType: ActionType) => {
    if (actionType === "seat") {
      setShowManageSite(true);
    } else if (actionType === "contact") {
      setShowContactBio(true);
    } else if (actionType === "registration") {
      setShowEditRego(true);
    } else if (actionType === "competition") {
      setShowEditComp(true);
      // setShowEditRego(true);
    } else if (actionType === "capacity") {
      setShowEditCapacity(true);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(compCode);
    } catch (err) {
      alert(err);
    }
  };

  useEffect(() => {
    // If admin is requesting, check the particular uni they are updating bio and announcement for
    const fetchStaffInfo = async () => {
      try {
        let response;
        if (universityOption.value) {
          const universityId = universityOption.value;
          response = await sendRequest.get<{ staffDetails: StaffInfo }>(
            "/competition/staff/details",
            { compId, universityId }
          );
        } else {
          response = await sendRequest.get<{ staffDetails: StaffInfo }>(
            "/competition/staff/details",
            { compId }
          );
        }
        setCurrentBio(response.data.staffDetails.bio ?? "Default Bio");
        setStaffInfo(response.data.staffDetails);
      } catch (err) {
        console.log("Error fetching staff info", err);
      }
    };

    const fetchAnnouncementMessage = async () => {
      try {
        let response;
        if (universityOption.value) {
          const universityId = universityOption.value;
          response = await sendRequest.get<{ announcement: Announcement }>(
            "/competition/announcement",
            { compId, universityId }
          );
        } else {
          response = await sendRequest.get<{ announcement: Announcement }>(
            "/competition/announcement",
            { compId }
          );
        }

        if (response.data.announcement === undefined) {
          setAnnouncementMessage(defaultAnnouncement);
          return;
        }

        setAnnouncementMessage(response.data.announcement.message);
        console.log(response.data.announcement);
      } catch (err) {
        console.log("Error fetching announcement", err);
      }
    };

    // Call the async functions
    fetchStaffInfo();
    fetchAnnouncementMessage();
  }, [universityOption]);

  const handleChange = async () => {
    if (staffInfo) {
      const updatedStaffInfo = {
        ...staffInfo,
        bio: currentBio,
      };
      try {
        if (universityOption.value) {
          const universityId = universityOption.value;
          await sendRequest.put("/competition/staff/details", {
            staffInfo: updatedStaffInfo,
            compId,
            universityId,
          });
        } else {
          await sendRequest.put("/competition/staff/details", {
            staffInfo: updatedStaffInfo,
            compId,
          });
        }
        setShowContactBio(false);
      } catch (err) {
        console.log("Error updating staff info", err);
      }
    }

    try {
      if (universityOption.value) {
        const universityId = universityOption.value;
        await sendRequest.put("/competition/announcement", {
          announcementMessage,
          compId,
          universityId,
        });
      } else {
        await sendRequest.put("/competition/announcement", {
          announcementMessage,
          compId,
        });
      }
    } catch (err) {
      console.log("Error updating announcement info", err);
    }
  };

  // TO-DO: call the backend to retrive the previous options
  const [regoFields, setRegoFields] = useState<EditRego>(DEFAULT_REGO_FIELDS);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [editCourse, setEditCourse] = useState<EditCourse>({
    [CourseCategory.Introduction]: "",
    [CourseCategory.DataStructures]: "",
    [CourseCategory.AlgorithmDesign]: "",
    [CourseCategory.ProgrammingChallenges]: "",
  });

  const handleEditCourseChange = (category: CourseCategory, value: string) => {
    setEditCourse((prevEditCourse) => ({
      ...prevEditCourse,
      [category]: value,
    }));
  };

  useEffect(() => {
    if (isFirstLoad) {
      // ensures that on first load it doesn't request the data since it will be re-requested once
      // the universityOption is set
      setIsFirstLoad(false);
      return;
    }
    const fetchRegoFields = async () => {
      const response = await sendRequest.get<{ regoFields: EditRego }>('/competition/staff/rego_toggles',
        { compId, universityId: universityOption.value });
      const { regoFields: receivedRegoFields } = response.data;
      setRegoFields(receivedRegoFields || DEFAULT_REGO_FIELDS);
    }
    fetchRegoFields();
  }, [universityOption]);

  const handleRegoEditSubmit = async (regoFields: EditRego) => {
    await sendRequest.post("/competition/staff/update_rego_toggles", {
      compId: parseInt(compId as string),
      regoFields,
      universityId: parseInt(universityOption.value),
    });
    // TO-DO: send the edited courses to backend and store for competition
    console.log(editCourse);
    console.log(regoFields);
  };

  const handleSiteCapacityChange = (
    site: { label: string; value: number },
    capacity: number
  ) => {
    // TODO: backend PUT (update) the site capacity for a given site Id and new capacity
    console.log(
      `updating site ${site.label} with id ${site.value} with capacity: ${capacity}`
    );

    setShowEditCapacity(false);
  };

  const [siteList, setSiteList] = useState<
    CompetitionSiteCapacity[] | undefined
  >();

  useEffect(() => {
    const fetchSiteCapacities = async () => {
      const response = await sendRequest.get<{
        site: CompetitionSiteCapacity[];
      }>("/competition/site/capacity", {
        compId,
        ids: siteOptions.map((siteOption) => siteOption.value),
      });
      const { site: siteCapacities } = response.data;
      setSiteList(siteCapacities);
    };

    fetchSiteCapacities();
  }, []);

  const getSiteCapacity = (): number => {
    const foundSite = siteList?.find(
      (site) => site.id === parseInt(universityOption.value)
    );

    if (foundSite) return foundSite?.capacity;
    return 0;
  };

  // TO-DO: obtain the competition information from the
  const [competitionInfo, setCompetitionInfo] =
    useState<CompetitionInformation>({
      information: "",
      name: "",
      region: "",
      timeZone: "",
      startDate: "",
      startTime: "",
      start: "",
      earlyBird: null,
      earlyBirdDate: "",
      earlyBirdTime: "",
      early: "",
      generalDate: "",
      generalTime: "",
      general: "",
      code: "",
      siteLocations: [],
      otherSiteLocations: [],
    });
  
  useEffect(() => {
    const fetchCompetitionInfo = async () => {
      try {
        const response = await sendRequest.get<{competition: CompetitionDetails}>("/competition/details", { compId });
        const competitionData = response.data.competition;

        const competitionDetails: CompetitionInformation = {
          name: competitionData.name,
          early: competitionData.earlyRegDeadline ? new Date(competitionData.earlyRegDeadline).toISOString() : "",
          earlyBirdDate: competitionData.earlyRegDeadline ? new Date(competitionData.earlyRegDeadline).toISOString().split('T')[0] : "",
          earlyBirdTime: competitionData.earlyRegDeadline ? new Date(competitionData.earlyRegDeadline).toISOString().split('T')[1].split('.')[0] : "",
          earlyBird: competitionData.earlyRegDeadline ? false : true,
          general: new Date(competitionData.generalRegDeadline).toISOString(),
          generalDate: new Date(competitionData.generalRegDeadline).toISOString().split('T')[0],
          generalTime: new Date(competitionData.generalRegDeadline).toISOString().split('T')[1].split('.')[0],
          start: new Date(competitionData.startDate).toISOString(),
          startDate: new Date(competitionData.startDate).toISOString().split('T')[0],
          startTime: new Date(competitionData.startDate).toISOString().split('T')[1].split('.')[0],
          code: competitionData.code ? competitionData.code : "",
          region: competitionData.region,
          siteLocations: competitionData.siteLocations ? competitionData.siteLocations : [],
          otherSiteLocations: competitionData.otherSiteLocations ? competitionData.otherSiteLocations : [],
          information: competitionData.information,
          timeZone: "Australia/Sydney", // hardcoded timezone
        };

        setCompetitionInfo(competitionDetails);
      } catch (err: unknown) {
        console.error(err);
      }
    };
    fetchCompetitionInfo();
    console.log(1);
    console.log(competitionInfo);
  }, []);

  const handleCompEditSubmit = async (
    competitionInfo: CompetitionInformation
  ) => {
    const newCompetitionDetails = {
      id: compId,
      name: competitionInfo.name,
      teamSize: 3, // harcoded data because current type in here dont have team size
      earlyRegDeadline: new Date(competitionInfo.early).getTime(),
      generalRegDeadline: new Date(competitionInfo.general).getTime(),
      startDate: new Date(competitionInfo.start).getTime(),
      siteLocations: competitionInfo.siteLocations,
      code: competitionInfo.code,
      region: competitionInfo.region,
      information: competitionInfo.information,
    };

    try {
      await sendRequest.put('/competition/system_admin/update', newCompetitionDetails);
    } catch (err) {
      console.error("Error updating competition details", err);
    }
    console.log(competitionInfo);
    // TO-DO: send the EditRego to backend for storage
    await sendRequest.post('/competition/staff/update_rego_toggles',
      { compId: parseInt(compId as string), regoFields, universityId: parseInt(universityOption.value) });
    console.log(regoFields);
    console.log("submitted");
  };

  return (
    <ManageContainer>
      <StandardContainerDiv>
        {showManageSite ? (
          <AssignSeatsPage>
            <BackButton onClick={() => setShowManageSite(false)}>
              <FaChevronLeft /> Back
            </BackButton>
            <AssignSeats
              siteName={universityOption.label}
              siteCapacity={getSiteCapacity()}
              teamListState={teamListState}
              siteOptionState={[siteOption,setSiteOption]}
            />
          </AssignSeatsPage>
        ) : (
          <>
            <ActionsContainer>
              {filteredActions.map((action, index) => (
                <ActionCard
                  key={index}
                  onClick={() =>
                    action.type === "code"
                      ? handleCopyCode()
                      : handleActionClick(action.type)
                  }
                  $actionType={action.type}
                >
                  {action.type === "code" ? (
                    <CopyCard>
                      <CardIcon as={action.icon} />
                      <CodeCardText>{action.text}</CodeCardText>
                      <Code>
                        <p>{compCode}</p>
                      </Code>
                    </CopyCard>
                  ) : (
                    <>
                      <CardIcon as={action.icon} />
                      <CardText>{action.text}</CardText>
                    </>
                  )}
                </ActionCard>
              ))}
            </ActionsContainer>

            {showContactBio && (
              <BioChangePopUp
                onClose={() => setShowContactBio(false)}
                onNext={handleChange}
                bioValue={currentBio}
                announcementValue={announcementMessage}
                onBioChange={(e) => setCurrentBio(e.target.value)}
                onAnnouncementChange={(value: SetStateAction<string>) =>
                  setAnnouncementMessage(value)
                }
              />
            )}

            {showEditRego && (
              <EditCompRegoPopUp
                heading={
                  <Title2>
                    Please select the fields you would like to {"\n"} to remove
                    from the Competition Registration Form
                  </Title2>
                }
                onClose={() => setShowEditRego(false)}
                regoFields={regoFields}
                setRegoFields={setRegoFields}
                onSubmit={handleRegoEditSubmit}
                editCourses={editCourse}
                setCourses={handleEditCourseChange}
              />
            )}

            {showEditCapacity && (
              <EditSiteCapacityPopUp
                heading={"Update Site Capacities"}
                onClose={() => setShowEditCapacity(false)}
                onSubmit={handleSiteCapacityChange}
              />
            )}

            {showEditComp && (
              <EditCompDetailsPopUp
                onClose={() => setShowEditComp(false)}
                competitionInfo={competitionInfo}
                setCompetitionInfo={setCompetitionInfo}
                onSubmit={handleCompEditSubmit}
              />
            )}
          </>
        )}
      </StandardContainerDiv>
    </ManageContainer>
  );
};
