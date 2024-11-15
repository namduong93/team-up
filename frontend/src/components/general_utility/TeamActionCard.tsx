import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaUserPlus, FaUsers, FaEdit, FaGlobe } from "react-icons/fa";
import { sendRequest } from "../../utility/request";
import { useParams } from "react-router-dom";
import { CompetitionSite } from "../../../shared_types/Competition/CompetitionSite";
import InvitePopUp from "../../screens/student/subcomponents/InvitePopUp";
import JoinPopUp from "../../screens/student/subcomponents/JoinPopUp";
import { SitePopUpChain } from "../../screens/student/subcomponents/popups/SitePopupChain/SitePopUpChain";
import { NamePopUpChain } from "../../screens/student/subcomponents/popups/NamePopupChain/NamePopUpChain";

type ActionType = "invite" | "join" | "name" | "site";

const MAX_MEMBERS = 3; // Maximum number of team members

interface ActionCardProps {
  $actionType: ActionType;
  $disabled: boolean;
}

interface TeamActionCardProps {
  numMembers: number;
  compId?: number;
}

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 5%;
  width: 100%;
  margin: 5% 5%;
  box-sizing: border-box;
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
    $disabled
      ? "none"
      : `1px solid ${theme.teamProfile[`${$actionType}Border`]}`};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: transform 0.2s;
  box-sizing: border-box;

  &:hover {
    transform: ${({ $disabled }) =>
      $disabled ? "none" : "translate(2px, 2px)"};
  }
`;

const CardIcon = styled.div<{ $disabled: boolean }>`
  font-size: 32px;
  margin-bottom: 10px;
  box-sizing: border-box;
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colours.notifDark : theme.fonts.colour};
`;

const CardText = styled.p<{ $disabled: boolean }>`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme, $disabled }) =>
    $disabled ? theme.colours.notifDark : theme.fonts.colour};
  margin: 0;
  box-sizing: border-box;
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

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
  box-sizing: border-box;
`;

export const TeamActionCard: React.FC<TeamActionCardProps> = ({
  numMembers,
}) => {
  const [modalOpen, setModalOpen] = useState<
    "invite" | "join" | "name" | "site" | null
  >(null);
  const [teamCode, setTeamCode] = useState("");
  const { compId } = useParams<{ compId: string }>();

  const [siteLocationOptions, setSiteLocationOptions] = useState([
    { value: "", label: "" },
  ]);

  useEffect(() => {
    const fetchSiteLocations = async () => {
      const response = await sendRequest.get<{ sites: Array<CompetitionSite> }>(
        "/competition/sites",
        { compId }
      );
      const { sites } = response.data;
      setSiteLocationOptions(
        sites.map((site) => ({ value: String(site.id), label: site.name }))
      );
    };

    fetchSiteLocations();
  }, []);

  useEffect(() => {
    const fetchTeamCode = async () => {
      const response = await sendRequest.get<{ code: string }>(
        "/competition/team/invite_code",
        { compId }
      );
      const { code } = response.data;
      setTeamCode(code);
    };

    fetchTeamCode();
  }, []);

  const actions = [
    { type: "invite" as ActionType, icon: FaUserPlus, text: "Invite a Friend" },
    { type: "join" as ActionType, icon: FaUsers, text: "Join a Team" },
    { type: "name" as ActionType, icon: FaEdit, text: "Change Team Name" },
    { type: "site" as ActionType, icon: FaGlobe, text: "Change Team Site" },
  ];

  // Determine which actions should be disabled based on the number of members
  const isDisabled = (actionType: ActionType) => {
    if (numMembers === 1) return actionType === "name" || actionType === "site";
    if (numMembers > 1 && numMembers < MAX_MEMBERS)
      return actionType === "join";
    if (numMembers >= MAX_MEMBERS)
      return actionType === "invite" || actionType === "join";
    return false;
  };

  // TO-DO: backend route to obtain the teamCode --> replace text in InvitePopUp with teamCode
  // when implemented

  return (
    <>
      <ActionsContainer>
        {actions.map((action, index) => (
          <ActionCard
            key={index}
            onClick={() =>
              !isDisabled(action.type) && setModalOpen(action.type)
            }
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

      <Overlay
        $isOpen={modalOpen !== null}
        onClick={() => setModalOpen(null)}
      />

      {modalOpen === "invite" && (
        <InvitePopUp
          heading={
            <Heading>
              Copy and send your {"\nTeam Code to invite your"} {"\nmembers"}
            </Heading>
          }
          text={teamCode}
          onClose={() => setModalOpen(null)}
        />
      )}

      {modalOpen === "join" && (
        <JoinPopUp
          heading={
            <Heading>
              Enter the details of the {"\nTeam you would like to join"}
            </Heading>
          }
          onClose={() => setModalOpen(null)}
          currentTeamCode={teamCode}
        />
      )}

      {modalOpen === "site" && (
        <SitePopUpChain
          siteOptionsState={[siteLocationOptions, setSiteLocationOptions]}
          handleClose={() => setModalOpen(null)}
        />
      )}

      {modalOpen === "name" && (
        <NamePopUpChain handleClose={() => setModalOpen(null)} />
      )}
    </>
  );
};
