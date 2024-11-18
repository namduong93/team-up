import { FC } from "react";
import { NotificationButton } from "../../../../components/page_header/components/NotificationButton";

import { CompCountdownBar } from "../CompCountdownBar";
import {
  StyledButtonContainer,
  StyledHeaderContent,
  StyledHeaderRightSection,
  StyledResponsiveHeader,
  StyledTeamDescription,
  StyledTeamTitle,
  StyledWithdrawButton,
} from "./TeamHeader.styles";

interface HeaderAttributes extends React.HTMLAttributes<HTMLDivElement> {
  compName: string;
  teamName: string;
  compCountdown: number;
  onWithdrawClick: () => void;
};

/**
 * `TeamHeader` is a React web page component header that displays competition and team details 
 * at the top of the page.It includes the competition name, the team name, a countdown bar for 
 * the competition, a withdraw button with a confirmation prompt, and a notification button.

 * @param {HeaderAttributes} props - React HeaderAttributes specified above
 * 
 * @returns {JSX.Element} - The rendered header component.
 */
export const TeamHeader: FC<HeaderAttributes> = ({
  compName,
  teamName,
  compCountdown,
  onWithdrawClick,
}) => {
  return (
    <StyledResponsiveHeader>
      <StyledHeaderContent>
        <StyledTeamTitle>{compName}</StyledTeamTitle>
        <StyledTeamDescription>Team {teamName}</StyledTeamDescription>
      </StyledHeaderContent>

      <StyledHeaderRightSection>
        <StyledButtonContainer>
          <StyledWithdrawButton
            actionName="Withdraw"
            question="Are you sure you want to withdraw from the competition?"
            redirectPath="/dashboard"
            actionType="error"
            handleClick={onWithdrawClick}
          />
          <NotificationButton />
        </StyledButtonContainer>

        <CompCountdownBar daysRemaining={compCountdown} progress={0.5} />
      </StyledHeaderRightSection>
    </StyledResponsiveHeader>
  );
};
