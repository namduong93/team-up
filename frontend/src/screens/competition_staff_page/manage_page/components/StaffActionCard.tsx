import { FC, useState } from "react";
import styled from "styled-components";
import { FaFileSignature, FaChair, FaEdit, FaChevronLeft, FaCopy } from "react-icons/fa";
import { AssignSeats } from "../AssignSeats";
type ActionType = "code" | "competition" | "registration" | "seat" | "contact" | "capacity";

interface StaffActionCardProps {
  staffRoles: string[];
  compCode: string;
};

interface ActionCardProps {
  $actionType: ActionType;
};

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
  background-color: ${({ theme, $actionType }) => theme.staffActions[$actionType]};
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

const CodeCardText = styled(CardText)`
  font-size: 1.25rem;
`;

export const StaffActionCard: FC<StaffActionCardProps> = ({ staffRoles, compCode }) => {
  const [showManageSite, setShowManageSite] = useState(false);

  const actions = [
    { type: "code" as ActionType, icon: FaCopy, text: `Copy Competition Code`, roles: ["Admin", "Coach", "Site-Coordinator"] },
    { type: "competition" as ActionType, icon: FaEdit, text: "Edit Competition Details", roles: ["Admin"] },
    { type: "registration" as ActionType, icon: FaFileSignature, text: "Update Registration Form", roles: ["Admin", "Coach"] },
    { type: "seat" as ActionType, icon: FaChair, text: "Assign Seats to Teams", roles: ["Admin", "Site-Coordinator"] },
    { type: "contact" as ActionType, icon: FaChair, text: "Update Your Contact Bio", roles: ["Admin", "Coach"] },
    { type: "capacity" as ActionType, icon: FaChair, text: "Update Your Site Capacity", roles: ["Admin", "Site-Coordinator"] },
  ];

  // Filter actions based on at least one matching role
  const filteredActions = actions.filter(action =>
    action.roles.some(role => staffRoles.includes(role))
  );

  const handleActionClick = (actionType: ActionType) => {
    if (actionType === "seat") {
      setShowManageSite(true);
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

  return (
    <StandardContainerDiv>
      {showManageSite ? (
        <AssignSeatsPage>
          <BackButton onClick={() => setShowManageSite(false)}>
            <FaChevronLeft /> Back
          </BackButton>
          <AssignSeats />
        </AssignSeatsPage>
      ) : (
        <ActionsContainer>
          {filteredActions.map((action, index) => (
            <ActionCard
              key={index}
              onClick={() =>
                action.type === "code" ? handleCopyCode() : handleActionClick(action.type)
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
      )}
    </StandardContainerDiv>
  );
};