import React, { useState } from "react";
import styled from "styled-components";
import { FaInfoCircle, FaRegCopy, FaTimes, FaUserTie, FaCheck } from "react-icons/fa";
import { TeamActionCard } from "../../components/general_utility/TeamActionCard";

const ManageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 100%;
  width: 100%;
  height: 100%;
  max-height: 70%;
  align-items: center;
`;

const InfoContainer = styled.div`
  display: grid;
  gap: 16px;
  width: 100%;
  height: 50%;
  max-width: 50%;
`;

const InfoCard = styled.div`
  display: flex;
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 15px;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.h3`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin: 0;
  color: ${({ theme }) => theme.colours.primaryDark};
  margin-bottom: 5%;
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
  margin: 4px 0 0;
  color: ${({ theme }) => theme.fonts.colour};
`;

const InfoLink = styled.a`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.colours.primaryDark};
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colours.primaryLight};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background: ${({ theme }) => theme.background};
  border-radius: 12px;
  padding: 20px;
  max-width: 600px;
  width: 80%;
  color: ${({ theme }) => theme.fonts.colour};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.error};
  font-size: 24px;
  transition: color 0.3s;

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

const CoachInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const CoachName = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 1rem;
  color: ${({ theme }) => theme.fonts.colour};
`;

const CoachEmail = styled.p`
  margin: 0;
  font-size: 1rem;
  text-decoration: underline;
  color: ${({ theme }) => theme.colours.primaryDark};
  display: flex;
  align-items: center;
`;

const CopyIcon = styled(FaRegCopy)`
  margin-left: 5%;
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.primaryDark};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const CheckIcon = styled(FaCheck)`
  margin-left: 5%;
  width: 1.2rem;
  height: 1.2rem;
  color: ${({ theme }) => theme.colours.confirm};
`;

const StyledUserTieIcon = styled(FaUserTie)`
  font-size: 32px;
  margin-right: 15px;
  width: 20px;
  height: auto;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledInfoCircleIcon = styled(FaInfoCircle)`
  font-size: 32px;
  margin-right: 15px;
  width: 20px;
  height: auto;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const TeamManage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ManageContainer>
      <TeamActionCard numMembers={1} />
      <InfoContainer>
        <InfoCard>
          <StyledUserTieIcon />
          <InfoContent>
            <InfoLabel>Coach Contact:</InfoLabel>
            <CoachInfoContainer>
              <CoachName>Coach Name</CoachName>
              <CoachEmail>
                coach@email.com
                {copied ? (
                  <CheckIcon />
                ) : (
                  <CopyIcon onClick={() => copyToClipboard("coach@email.com")} />
                )}
              </CoachEmail>
              <InfoText>Contact office/hours...</InfoText>
            </CoachInfoContainer>
          </InfoContent>
        </InfoCard>
        <InfoCard>
          <StyledInfoCircleIcon />
          <InfoContent>
            <InfoLabel>Competition Information:</InfoLabel>
            <InfoLink onClick={handleOpenModal}>see competition details →</InfoLink>
          </InfoContent>
        </InfoCard>
      </InfoContainer>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <CloseButton onClick={handleCloseModal}>
              <FaTimes />
            </CloseButton>
            <p>
              The ICPC is the premier global programming competition conducted by and for the world’s universities. It fosters creativity, teamwork, and innovation in building new software programs, and enables students to test their ability to perform well under pressure.
            </p>
            <p>
              3 students, 5 hours
              <br />
              1 computer, 12 problems* (typical, but varies per contest)
            </p>
            <p>
              In 2021, more than 50,000 of the finest students in computing disciplines from over 3,000 universities competed worldwide in the regional phases of this contest. We conduct ICPC contests for the South Pacific region, with top teams qualifying to the World Finals.
            </p>
            <p>
              The detail can be seen at:{" "}
              <InfoLink href="https://sppcontests.org/south-pacific-icpc/" target="_blank" rel="noopener noreferrer">
                sppcontests.org/south-pacific-icpc
              </InfoLink>
            </p>
          </ModalContent>
        </ModalOverlay>
      )}
    </ManageContainer>
  );
};
