import React, { useState } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { TeamActionCard } from "../../components/general_utility/TeamActionCard";
import { ProfileCard } from "./ProfileCard";
import { useOutletContext } from "react-router-dom";
import { Student } from "./TeamDetails";

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
  width: 100%;
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
  box-sizing: border-box;
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
  box-sizing: border-box;
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
  box-sizing: border-box;

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

export const TeamManage: React.FC = () => {
  const { students, coach } = useOutletContext<{
    students: Student[];
    coach: {
      name: '',
      email: '',
      bio: '',
    }
  }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ManageContainer>
      <TeamActionCard numMembers={students.length} />
      <InfoContainer>
        <ProfileCard
          name={coach.name}
          email={coach.email}
          bio={coach.bio}
          isCoach={true}
        />
        
        <InfoCard>
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
