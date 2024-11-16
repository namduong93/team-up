import { FC } from "react";
import { NotificationButton } from "../../../../components/page_header/components/NotificationButton";

import { CompCountdownBar } from "../CompCountdownBar";
import { StyledButtonContainer, StyledHeaderContent, StyledHeaderRightSection, StyledResponsiveHeader, StyledTeamDescription, StyledTeamTitle, StyledWithdrawButton } from "./TeamHeader.styles";

interface HeaderAttributes extends React.HTMLAttributes<HTMLDivElement> {
  compName: string;
  teamName: string;
  compCountdown: number;
  onWithdrawClick: () => void;
}

export const TeamHeader: FC<HeaderAttributes> = ({
  compName,
  teamName,
  compCountdown,
  onWithdrawClick,
}) => {
  return (
    <StyledResponsiveHeader data-test-id="team-header--StyledResponsiveHeader-0">
      <StyledHeaderContent data-test-id="team-header--StyledHeaderContent-0">
        <StyledTeamTitle data-test-id="team-header--StyledTeamTitle-0">{compName}</StyledTeamTitle>
        <StyledTeamDescription data-test-id="team-header--StyledTeamDescription-0">Team{teamName}</StyledTeamDescription>
        {/* <div>{compCountdown}</div> */}
      </StyledHeaderContent>
      <StyledHeaderRightSection data-test-id="team-header--StyledHeaderRightSection-0">
        <StyledButtonContainer data-test-id="team-header--StyledButtonContainer-0">
          <StyledWithdrawButton
            actionName="Withdraw"
            question="Are you sure you want to withdraw from the competition?"
            redirectPath="/dashboard"
            actionType="error"
            handleClick={onWithdrawClick}
            data-test-id="team-header--StyledWithdrawButton-0" />
          <NotificationButton />
        </StyledButtonContainer>
        <CompCountdownBar daysRemaining={compCountdown} progress={0.5} />
      </StyledHeaderRightSection>
    </StyledResponsiveHeader>
  );
};
