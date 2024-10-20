import { FC, useState } from "react";
import { FaBell } from "react-icons/fa";
import styled from "styled-components";
import { Notifications } from "../../components/general_utility/Notifications";
import { AlertButton } from "../../screens/Dashboard/Dashboard";
import { PageHeaderContainerDiv, PageTitle, PageDescriptionSpan } from "../../components/sort_filter_search/PageHeader";
import { CompCountdownBar } from "./CompCountdownBar";
import { ActionButton } from "../../components/general_utility/ActionButton";

interface HeaderAttributes extends React.HTMLAttributes<HTMLDivElement> {
  compName: string;
  teamName: string;
  compCountdown: number;
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

const SquareAlertButton = styled(AlertButton)`
  width: 17%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border-radius: 8px;
`;

export const TeamHeader: FC<HeaderAttributes> = ({ compName, teamName, compCountdown }) => {  
  return (
    <ResponsiveHeader>
      <HeaderContent>
        <TeamTitle>{compName}</TeamTitle>
        <TeamDescription>Team {teamName}</TeamDescription>
      </HeaderContent>

      <HeaderRightSection>
        <ButtonContainer>
          <WithdrawButton
            actionName="Withdraw"
            question="Are you sure you want to withdraw from the competition?"
            redirectPath="/dashboard"
            actionType="error"
          />
          <Notifications />
        </ButtonContainer>

        <CompCountdownBar daysRemaining={compCountdown} progress={0.5} />
      </HeaderRightSection>
    </ResponsiveHeader>
  );
};