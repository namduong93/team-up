import { FC } from "react";
import styled from "styled-components";
import { NotificationButton } from "../../components/page_header/components/NotificationButton";
import { PageHeaderContainerDiv, PageTitle, PageDescriptionSpan } from "../../components/page_header/PageHeader";
import { CompCountdownBar } from "./CompCountdownBar";
import { ActionButton } from "../../components/responsive_fields/action_buttons/ActionButton";

interface HeaderAttributes extends React.HTMLAttributes<HTMLDivElement> {
  compName: string;
  teamName: string;
  compCountdown: number;
  onWithdrawClick: () => void;
};

const TeamTitle = styled(PageTitle)`
  color: ${({ theme }) => theme.colours.primaryDark};
  font-size: ${({ theme }) => theme.fonts.fontSizes.heading};
`;

const TeamDescription = styled(PageDescriptionSpan)`
  color: ${({ theme }) => theme.colours.secondaryDark};
  font-size: ${({ theme }) => theme.fonts.fontSizes.subheading};
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 250px;
`;

const WithdrawButton = styled(ActionButton)`
  height: 100%;
  width: 100%;
  min-height: 20px;
  flex: 1;
  padding: 0 16px;
  box-sizing: border-box;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 50%;
  justify-content: space-between;
`;

const HeaderRightSection = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10%;
  width: 100%;
  height: 100%;
  max-width: 50%;
`;

const ResponsiveHeader = styled(PageHeaderContainerDiv)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
  width: 100%;
  margin: 0 auto;
`;

export const TeamHeader: FC<HeaderAttributes> = ({ compName, teamName, compCountdown, onWithdrawClick }) => {
  return (
    <ResponsiveHeader>
      <HeaderContent>
        <TeamTitle>{compName}</TeamTitle>
        <TeamDescription>Team {teamName}</TeamDescription>
        {/* <div>{compCountdown}</div> */}
      </HeaderContent>

      <HeaderRightSection>
        <ButtonContainer>
          <WithdrawButton
            actionName="Withdraw"
            question="Are you sure you want to withdraw from the competition?"
            redirectPath="/dashboard"
            actionType="error"
            handleClick={onWithdrawClick}
          />
          <NotificationButton />
        </ButtonContainer>

        <CompCountdownBar daysRemaining={compCountdown} progress={0.5} />
      </HeaderRightSection>
    </ResponsiveHeader>
  );
};