import { FC } from "react";
import styled from "styled-components";
import { FaRegUser, FaInfoCircle, FaClipboard } from "react-icons/fa";

const ManageContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-width: 100%;
  width: 100%;
  height: 100%;
  background-color: red;
  max-height: 70%;
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  width: 45%;
`;

const ActionCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.background};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const CardIcon = styled(FaRegUser)`
  font-size: 32px;
  margin-bottom: 10px;
`;

const CardText = styled.p`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  margin: 0;
`;

const InfoContainer = styled.div`
  display: grid;
  gap: 16px;
  width: 50%;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  border-radius: 12px;
  padding: 20px;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const InfoIcon = styled(FaRegUser)`
  font-size: 32px;
  margin-right: 10px;
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.h3`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  margin: 0;
  color: ${({ theme }) => theme.colours.primaryDark};
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
  margin: 4px 0 0;
`;

const InfoLink = styled.a`
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
  color: ${({ theme }) => theme.colours.primaryDark};
  text-decoration: underline;
  cursor: pointer;
`;

export const TeamManage: FC = () => {
  return (
    <ManageContainer>
      <ActionsContainer>
        <ActionCard>
          <CardIcon />
          <CardText>Invite a friend</CardText>
        </ActionCard>
        <ActionCard>
          <CardIcon />
          <CardText>Join a team</CardText>
        </ActionCard>
        <ActionCard>
          <CardIcon />
          <CardText>Change team name</CardText>
        </ActionCard>
        <ActionCard>
          <CardIcon />
          <CardText>Change team site</CardText>
        </ActionCard>
      </ActionsContainer>

      <InfoContainer>
        <InfoCard>
          <InfoIcon />
          <InfoContent>
            <InfoLabel>Coach Contact:</InfoLabel>
            <InfoText>Name</InfoText>
            <InfoText>coach@email.com <FaClipboard /></InfoText>
            <InfoText>Contact office/hours...</InfoText>
          </InfoContent>
        </InfoCard>

        <InfoCard>
          <FaInfoCircle style={{ fontSize: '32px', marginRight: '10px' }} />
          <InfoContent>
            <InfoLabel>Competition Information:</InfoLabel>
            <InfoLink>see competition details →</InfoLink>
          </InfoContent>
        </InfoCard>
      </InfoContainer>
    </ManageContainer>
  );
};
