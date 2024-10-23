import { FC, Fragment, useState } from "react";
import styled from "styled-components";
import { FaFileSignature, FaChair, FaEdit, FaChevronLeft } from "react-icons/fa";
import { ManageSite } from "../ManageSite";

type ActionType = "competition" | "registration" | "seat";

interface StaffActionCardProps {
  staffRoles: string[];
};

interface ActionCardProps {
  $actionType: ActionType;
};

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  margin: 5% 0;
  flex-wrap: wrap;
`;

const ActionCard = styled.button<ActionCardProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  background-color: ${({ theme, $actionType }) => theme.staffActions[$actionType]};
  border: ${({ theme, $actionType }) => `1px solid ${theme.staffActions[`${$actionType}Border`]}`};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translate(2px, 2px);
  }
`;

const CardIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const CardText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.fonts.colour};
  margin: 0;
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;


const BackButton = styled.button`
  color: ${({ theme }) => theme.colours.primaryDark};
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 10px;

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;


export const StaffActionCard: FC<StaffActionCardProps> = ({ staffRoles }) => {
  const [modalOpen, setModalOpen] = useState<string | null>(null);
  const [showManageSite, setShowManageSite] = useState(false);

  const actions = [
    { type: "competition" as ActionType, icon: FaEdit, text: "Edit Competition Details", roles: ["Admin"] },
    { type: "registration" as ActionType, icon: FaFileSignature, text: "Update Registration Form", roles: ["Admin", "Coach"] },
    { type: "seat" as ActionType, icon: FaChair, text: "Assign Seats to Teams", roles: ["Admin", "Site-Coordinator"] },
  ];

  // Filter actions based on at least one matching role
  const filteredActions = actions.filter(action =>
    action.roles.some(role => staffRoles.includes(role))
  );

  const handleAction = (actionType: string, actionText: string) => {
    if (actionType === "seat") {
      setShowManageSite(true);
    } else {
      setModalOpen(actionText);
    }
  };

  return (
    <>
      {showManageSite && (
        <>
          <BackButton onClick={() => setShowManageSite(false)}><FaChevronLeft /> Back</BackButton>
          <ManageSite />
        </>
      )}

      {!showManageSite && 
        <ActionsContainer>
          {filteredActions.map((action, index) => (
            <ActionCard
              key={index}
              onClick={() => handleAction(action.type, action.text)}
              $actionType={action.type}
            >
              <CardIcon as={action.icon} />
              <CardText>{action.text}</CardText>
            </ActionCard>
          ))}
        </ActionsContainer>
      }

      {filteredActions.map((action, index) => (
        <Fragment key={index}>
          <Overlay $isOpen={modalOpen === action.text} onClick={() => setModalOpen(null)} />
          <Modal $isOpen={modalOpen === action.text}>
            <h2>{action.text}</h2>
            <button onClick={() => setModalOpen(null)}>Close</button>
          </Modal>
        </Fragment>
      ))}
    </>
  );
};
