import { FC, useState } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import { ProfileCard } from "./ProfileCard";
import defaultProfile from "./default-profile.jpg";
import { EditCompPreferences } from "./EditCompPreferences";
import { StudentDetails } from "./EditCompPreferences";

const DetailsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  max-height: 70%;
  gap: 5%;
`;

const TeamDetailsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  width: 100%;
  max-width: 40%;
  max-height: 80%;
  height: 100%;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin: 0 auto;
  padding: 15px;
`;

const TeamInfo = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1;
  cursor: default;
`;

const TeamLabel = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.regular};
  color: ${({ theme }) => theme.colours.primaryDark};
`;

const TeamField = styled.p`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 10px;
`;

const StudentsContainer = styled.div`
  width: 100%;
  max-width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export interface Student {
  id: string;
  name: string;
  email: string;
  bio: string;
  image?: string;
  preferredContact?: string;
};

export const TeamDetails: FC = () => {
  const { teamName, teamSite, teamSeat, teamLevel, students } = useOutletContext<{
    teamName: string;
    teamSite: string;
    teamSeat: string;
    teamLevel: "A" | "B" | "AB";
    students: Student[];
  }>();
  const [editingPreferences, setEditingPreferences] =
    useState<StudentDetails | null>(null);

  const handleSave = (updatedStudent: StudentDetails) => {
    alert(`Saved details for: ${updatedStudent.name}`);
  };

  const fetchStudentDetails = (id: string): StudentDetails => {
    return {
      name: "John Doe",
      email: "john.doe@example.com",
      bio: "Passionate coder and team player.",
      image: defaultProfile,
      id,
      preferredContact: "Discord:john_doe",
      degreeYear: 3,
      degree: "Computer Science",
      ICPCEligibility: true,
      isRemote: false,
      competitionLevel: "A",
      boersenEligible: true,
      courses: ["COMP1511", "COMP3121"],
      codeforce: 1652,
      regional: false,
      nationalPrizes: "",
      internationalPrizes: "",
    };
  };

  return (
    <DetailsContainer>
      <TeamDetailsContainer>
        <TeamInfo>
          <div>
            <TeamLabel>Team Name:</TeamLabel>
            <TeamField>{teamName}</TeamField>
          </div>
          <div>
            <TeamLabel>Site Location:</TeamLabel>
            <TeamField>{teamSite}</TeamField>
          </div>
          <div>
            <TeamLabel>Seat:</TeamLabel>
            <TeamField>{teamSeat}</TeamField>
          </div>
          <div>
            <TeamLabel>Level:</TeamLabel>
            <TeamField>
              {teamLevel === "A"
                ? "A (Competitive)"
                : teamLevel === "B"
                ? "B (Participation)"
                : "AB (Mixed)"}
            </TeamField>
          </div>
        </TeamInfo>
      </TeamDetailsContainer>
      <StudentsContainer>
        {students.map((student, index) => (
          <ProfileCard
            key={student.id}
            name={student.name}
            email={student.email}
            bio={student.bio}
            image={student.image || defaultProfile}
            preferredContact={student.preferredContact}
            isFirst={index === 0}
            onEdit={() => setEditingPreferences(fetchStudentDetails(student.id))}
          />
        ))}
      </StudentsContainer>
      {editingPreferences && (
        <EditCompPreferences
          student={editingPreferences}
          onSave={handleSave}
          onCancel={() => setEditingPreferences(null)}
        />
      )}
    </DetailsContainer>
  );
};
