import React, { useState } from "react";
import styled from "styled-components";
import { FaUserPlus, FaUsers, FaEdit, FaGlobe } from "react-icons/fa";

type ActionType = "invite" | "join" | "name" | "site";

const MAX_MEMBERS = 3; // Maximum number of team members

interface ActionCardProps {
  $actionType: ActionType;
  $disabled: boolean;
}

interface TeamActionCardProps {
  numMembers: number;
}

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5%;
  width: 100%;
  margin: 5% 5%;
  
`;

const ActionCard = styled.button<ActionCardProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 280px;
  height: 100%;
  aspect-ratio: 1;
  background-color: ${({ theme, $actionType, $disabled }) =>
    $disabled ? theme.disabledBg : theme.teamProfile[$actionType]};
  border: ${({ $disabled, theme, $actionType }) =>
    $disabled ? "none" : `1px solid ${theme.teamProfile[`${$actionType}Border`]}`};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: transform 0.2s;

  &:hover {
    transform: ${({ $disabled }) => ($disabled ? "none" : "translate(2px, 2px)")};
  }
`;

const CardIcon = styled.div<{ $disabled: boolean }>`
  font-size: 32px;
  margin-bottom: 10px;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colours.notifDark : theme.fonts.colour};
`;

const CardText = styled.p<{ $disabled: boolean }>`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colours.notifDark : theme.fonts.colour};
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

export const TeamActionCard: React.FC<TeamActionCardProps> = ({ numMembers }) => {
  const [modalOpen, setModalOpen] = useState<string | null>(null);

  const actions = [
    { type: "invite" as ActionType, icon: FaUserPlus, text: "Invite a Friend" },
    { type: "join" as ActionType, icon: FaUsers, text: "Join a Team" },
    { type: "name" as ActionType, icon: FaEdit, text: "Change Team Name" },
    { type: "site" as ActionType, icon: FaGlobe, text: "Change Team Site" }
  ];

  // Determine which actions should be disabled based on the number of members
  const isDisabled = (actionType: ActionType) => {
    if (numMembers === 1) return actionType === "name" || actionType === "site";
    if (numMembers > 1 && numMembers < MAX_MEMBERS) return actionType === "join";
    if (numMembers >= MAX_MEMBERS) return actionType === "invite" || actionType === "join";
    return false;
  };

  return (
    <>
      <ActionsContainer>
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            onClick={() => !isDisabled(action.type) && setModalOpen(action.text)}
            $actionType={action.type}
            $disabled={isDisabled(action.type)}
          >
            <CardIcon $disabled={isDisabled(action.type)} as={action.icon} />
            <CardText $disabled={isDisabled(action.type)}>
              {action.text}
            </CardText>
          </ActionCard>
        ))}
      </ActionsContainer>

      {actions.map((action, index) => (
        <React.Fragment key={index}>
          <Overlay $isOpen={modalOpen === action.text} onClick={() => setModalOpen(null)} />
          <Modal $isOpen={modalOpen === action.text}>
            <h2>{action.text}</h2>
            <button onClick={() => setModalOpen(null)}>Close</button>
          </Modal>
        </React.Fragment>
      ))}
    </>
  );
};
