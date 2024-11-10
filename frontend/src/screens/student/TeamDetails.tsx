import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import { ProfileCard } from "./components/ProfileCard";
import { EditCompPreferences } from "./components/EditCompPreferences";
import { backendURL } from "../../../config/backendURLConfig";
import { StudentInfo } from "../../../shared_types/Competition/student/StudentInfo";
import { CompetitionRole } from "../../../shared_types/Competition/CompetitionRole";
import { CompetitionLevel } from "../../../shared_types/Competition/CompetitionLevel";

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
  box-sizing: border-box;
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
  box-sizing: border-box;
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
}

export const TeamDetails: FC = () => {
  const { teamName, teamSite, teamSeat, teamLevel, students } =
    useOutletContext<{
      teamName: string;
      teamSite: string;
      teamSeat: string;
      teamLevel: "";
      students: Student[];
    }>();

  useEffect(() => {
    console.log(teamLevel.includes("A"));
  }, []);

  const [editingPreferences, setEditingPreferences] =
    useState<StudentInfo | null>(null);

  const handleSave = (updatedStudent: StudentInfo) => {
    // alert(`Saved details for: ${updatedStudent.name}`);
    // TODO: hook backend to update student's competition preferences
    console.log("save details for: ", updatedStudent.name);
  };

  // TODO: waiting for backend route to get 1 paritcipant comp details
  const fetchStudentDetails = (id: string): StudentInfo => {
    console.log("fetching for studentID: ", id);
    // BACKEND FETCH HERE:

    return {
      userId: 0,
      universityId: 0,
      universityName: "UNSW",
      name: "John Doe",
      preferredName: "Johnny",
      email: "john@example.com",
      sex: "M",
      pronouns: "He/Him",
      tshirtSize: "MXL",
      allergies: "",
      dietaryReqs: "",
      accessibilityReqs: "",
      studentId: "z1234",

      // competition_user info
      roles: [CompetitionRole.Participant],
      bio: "epic bio",
      ICPCEligible: true,
      boersenEligible: false,
      level: CompetitionLevel.LevelA,
      degreeYear: 3,
      degree: "Comp Sci",
      isRemote: false,
      isOfficial: true,
      preferredContact: "discord:@hello",
      nationalPrizes: "",
      internationalPrizes: "",
      codeforcesRating: 0,
      universityCourses: ["COMP1234"],
      pastRegional: false,
      status: "Matched",

      // team info
      teamName: "UNSW Koalas",
      siteName: "CSE Building",
      siteId: 0,
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
            <TeamField>{teamLevel}</TeamField>
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
            image={
              student.image ||
              `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`
            }
            preferredContact={student.preferredContact}
            isFirst={index === 0}
            onEdit={() =>
              setEditingPreferences(fetchStudentDetails(student.id))
            }
          />
        ))}
      </StudentsContainer>
      {editingPreferences && (
        <EditCompPreferences
          student={editingPreferences}
          onSave={handleSave}
          onClose={() => setEditingPreferences(null)}
        />
      )}
    </DetailsContainer>
  );
};
