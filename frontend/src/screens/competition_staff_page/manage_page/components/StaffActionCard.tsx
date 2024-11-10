import { FC, SetStateAction, useEffect, useState } from "react";
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
import { EditRego } from "../../../../../shared_types/Competition/staff/Edit";
import { sendRequest } from "../../../../utility/request";
import { StaffInfo } from "../../../../../shared_types/Competition/staff/StaffInfo";
import { useParams } from "react-router-dom";
import { Announcement } from "../../../../../shared_types/Competition/staff/Announcement";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";

type ActionType =
  | "code"
  | "competition"
  | "registration"
  | "seat"
  | "contact"
  | "capacity";

interface StaffActionCardProps {
  staffRoles: string[];
  compCode: string;
  universityOption: { value: string; label: string };
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
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`;

const CodeCardText = styled(CardText)`
  font-size: 1.25rem;
`;

const Title2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const defaultAnnouncement = `
The ICPC is the premier global programming competition conducted by and for the world’s universities. It fosters creativity, teamwork, and innovation in building new software programs, and enables students to test their ability to perform well under pressure.

3 students, 5 hours  
1 computer, 12 problems* (typical, but varies per contest)

In 2021, more than 50,000 of the finest students in computing disciplines from over 3,000 universities competed worldwide in the regional phases of this contest. We conduct ICPC contests for the South Pacific region, with top teams qualifying to the World Finals.

The detail can be seen at: [sppcontests.org/south-pacific-icpc](https://sppcontests.org/south-pacific-icpc/)
`;

export const DEFAULT_REGO_FIELDS = {
  enableCodeforcesField: true,
  enableNationalPrizesField: true,
  enableInternationalPrizesField: true,
  enableRegionalParticipationField: true,
}

export const StaffActionCard: FC<StaffActionCardProps> = ({
  staffRoles,
  compCode,
}) => {
  const { compId } = useParams();
  const [showManageSite, setShowManageSite] = useState(false);
  const [showContactBio, setShowContactBio] = useState(false);
  const [showEditRego, setShowEditRego] = useState(false);
  const [currentBio, setCurrentBio] = useState("Default Bio");
  const [staffInfo, setStaffInfo] = useState<StaffInfo>();
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const { universityOption  } = useCompetitionOutletContext("teams");

  const actions = [
    {
      type: "code" as ActionType,
      icon: FaCopy,
      text: `Copy Competition Code`,
      roles: ["Admin", "Coach", "Site-Coordinator"],
    },
    {
      type: "competition" as ActionType,
      icon: FaEdit,
      text: "Edit Competition Details",
      roles: ["Admin"],
    },
    {
      type: "registration" as ActionType,
      icon: FaFileSignature,
      text: "Update Registration Form",
      roles: ["Admin", "Coach"],
    },
    {
      type: "seat" as ActionType,
      icon: FaChair,
      text: "Assign Seats to Teams",
      roles: ["Admin", "Site-Coordinator"],
    },
    {
      type: "contact" as ActionType,
      icon: FaChair,
      text: "Update Your Bio and Annoucements",
      roles: ["Admin", "Coach"],
    },
    {
      type: "capacity" as ActionType,
      icon: FaChair,
      text: "Update Your Site Capacity",
      roles: ["Admin", "Site-Coordinator"],
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
            '/competition/staff/details',
            { compId, universityId }
          );
        } else {
          response = await sendRequest.get<{ staffDetails: StaffInfo }>(
            '/competition/staff/details',
            { compId }
          );
        }
        setCurrentBio(response.data.staffDetails.bio);
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
            '/competition/announcement',
            { compId, universityId }
          );
        } else {
          response = await sendRequest.get<{ announcement: Announcement }>(
            '/competition/announcement',
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
        bio: currentBio
      };
      try {
        if (universityOption.value) {
          const universityId = universityOption.value;
          await sendRequest.put('/competition/staff/details', {
            staffInfo: updatedStaffInfo,
            compId,
            universityId
          });
        } else {
          await sendRequest.put('/competition/staff/details', {
            staffInfo: updatedStaffInfo,
            compId
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
        await sendRequest.put('/competition/announcement', {
          announcementMessage,
          compId,
          universityId
        });
      } else {
        await sendRequest.put('/competition/announcement', {
          announcementMessage,
          compId
        });
      }
    } catch (err) {
      console.log("Error updating announcement info", err);
    }
  };

  // TO-DO: call the backend to retrive the previous options
  const [regoFields, setRegoFields] = useState<EditRego>(DEFAULT_REGO_FIELDS);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

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
    // TO-DO: send the EditRego to backend for storage
    await sendRequest.post('/competition/staff/update_rego_toggles',
      { compId: parseInt(compId as string), regoFields, universityId: parseInt(universityOption.value) });
    console.log(regoFields);
    console.log("submitted");
  };

  return (
    <StandardContainerDiv>
      {showManageSite ? (
        <AssignSeatsPage>
          <BackButton onClick={() => setShowManageSite(false)}>
            <FaChevronLeft /> Back
          </BackButton>
          <AssignSeats siteName="CSE Building K17" siteCapacity={50} />
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
              onAnnouncementChange={(value: SetStateAction<string>) => setAnnouncementMessage(value)}
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
            />
          )}
        </>
      )}
    </StandardContainerDiv>
  );
};
