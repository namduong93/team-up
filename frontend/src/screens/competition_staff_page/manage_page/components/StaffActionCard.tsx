import { FC, useEffect, useState } from "react";
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
import { sendRequest } from "../../../../utility/request";
import { useParams } from "react-router-dom";
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
const Heading = styled.h2`
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

export const DEFAULT_REGO_FIELDS = {
  enableCodeforcesField: true,
  enableNationalPrizesField: true,
  enableInternationalPrizesField: true,
  enableRegionalParticipationField: true,
};

export const StaffActionCard: FC<StaffActionCardProps> = ({
  staffRoles,
  compCode,
  universityOption,
}) => {
  const { compId } = useParams();
  const [showManageSite, setShowManageSite] = useState(false);
  const [showContactBio, setShowContactBio] = useState(false);
  const [showEditRego, setShowEditRego] = useState(false);
  const [showEditComp, setShowEditComp] = useState(false);

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
      text: "Update Your Contact Bio",
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
    } else if (actionType === "competition") {
      setShowEditComp(true);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(compCode);
      alert("Competition code copied to clipboard!");
    } catch (err) {
      alert(err);
    }
  };

  // TO-DO: get the currentBio from the database
  const [currentBio, setCurrentBio] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. "
  );

  const handleBioChange = () => {
    console.log(currentBio);
    // TO-DO: submit the edited Contact Biography (string) to be changed in the
    // database
    setShowContactBio(false);
  };

  const [regoFields, setRegoFields] = useState<EditRego>(DEFAULT_REGO_FIELDS);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  // currently it's persisting the entries, so I don't know if you want
  // it to do that or not, feel free to call something from backend or something
  const [editCourse, setEditCourse] = useState<EditCourse>({
    [CourseCategory.Introduction]: "",
    [CourseCategory.DataStructures]: "",
    [CourseCategory.AlgorithmDesign]: "",
    [CourseCategory.ProgrammingChallenges]: "",
  });

  // updates the editCourse object with the user's input
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
      const response = await sendRequest.get<{ regoFields: EditRego }>(
        "/competition/staff/rego_toggles",
        { compId, universityId: universityOption.value }
      );
      const { regoFields: receivedRegoFields } = response.data;
      setRegoFields(receivedRegoFields || DEFAULT_REGO_FIELDS);
    };
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
              heading={
                <Heading>Edit your {"\n Competition Biography"}</Heading>
              }
              onClose={() => setShowContactBio(false)}
              onNext={handleBioChange}
              inputValue={currentBio}
              onChange={(e) => setCurrentBio(e.target.value)}
            />
          )}

          {showEditRego && (
            <EditCompRegoPopUp
              onClose={() => setShowEditRego(false)}
              regoFields={regoFields}
              setRegoFields={setRegoFields}
              onSubmit={handleRegoEditSubmit}
              editCourses={editCourse}
              setCourses={handleEditCourseChange}
            />
          )}

          {showEditComp && (
            <EditCompRegoPopUp
              onClose={() => setShowEditRego(false)}
              regoFields={regoFields}
              setRegoFields={setRegoFields}
              onSubmit={handleRegoEditSubmit}
              editCourses={editCourse}
              setCourses={handleEditCourseChange}
            />
          )}
        </>
      )}
    </StandardContainerDiv>
  );
};
