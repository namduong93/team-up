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
    <StyledResponsiveHeader>
      <StyledHeaderContent>
        <StyledTeamTitle>{compName}</StyledTeamTitle>
        <StyledTeamDescription>Team {teamName}</StyledTeamDescription>
        {/* <div>{compCountdown}</div> */}
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
