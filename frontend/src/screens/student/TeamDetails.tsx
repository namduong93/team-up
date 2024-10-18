import { FC, useState } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import { FaEdit, FaRegCopy, FaCheck } from "react-icons/fa";
import { EditCompPreferences } from "./EditCompPreferences";
import { StudentDetails } from "./EditCompPreferences";
import defaultProfile from "./default-profile.jpg";

export interface Student {
  name: string;
  email: string;
  bio: string;
  image: string;
  id: string; // to fetch student details
};

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

const StudentCard = styled.div<{ $isFirst?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start; 
  border: 2px solid ${({ theme, $isFirst }) => ($isFirst ? theme.colours.secondaryLight : theme.colours.primaryLight)};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.background};
  width: 100%;
  margin: 10px 0;
  position: relative;
  overflow: hidden;
`;

const StudentCardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  margin: 5%;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5%;
`;

const StudentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
`;

const StudentName = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 1rem;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StudentEmail = styled.p`
  margin: 0;
  font-size: 1rem;
  text-decoration: underline;
  color: ${({ theme }) => theme.colours.primaryDark};
  display: flex;
  align-items: center;
`;

const CopyIcon = styled(FaRegCopy)<{ $copied: boolean }>`
  margin-left: 5%;
  width: 15px;
  height: 15px;
  cursor: pointer;
  color: ${({ theme, $copied: copied }) => (copied ? theme.colours.confirm : theme.colours.primaryDark)};
  transition: color 0.2s;

  &:hover {
      color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const StudentBio = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.fonts.descriptor};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 10px;
  overflow: hidden;
  white-space: normal;
  max-width: 100%;
  text-overflow: ellipsis;
  flex-grow: 1;
`;

const StudentImage = styled.img`
  width: 20%;
  max-width: 50px;
  height: auto;
  border-radius: 50%;
  object-fit: cover;
`;

const EditIcon = styled(FaEdit)`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.secondaryDark};

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryLight};
  }
`;

const CheckIcon = styled(FaCheck)`
  color: ${({ theme }) => theme.colours.confirm};
  margin-left: 5%;
  width: 15px;
  height: 15px;
`;

export const TeamDetails: FC = () => {
  const { teamName, teamSite, teamLevel, students } = useOutletContext<{
    teamName: string;
    teamSite: string;
    teamLevel: "A" | "B" | "AB";
    students: Student[];
  }>();
  const [editingPreferences, setEditingPreferences] = useState<StudentDetails | null>(null);
  const [copiedEmailIndex, setCopiedEmailIndex] = useState<number | null>(null);

  const copyToClipboard = (email: string, index: number) => {
    navigator.clipboard.writeText(email);
    setCopiedEmailIndex(index);
    setTimeout(() => setCopiedEmailIndex(null), 2000);
  };

  const handleSave = (updatedStudent: StudentDetails) => {
    alert(`Saved details for: ${updatedStudent.name}`);
  };

  const fetchStudentDetails = (id: string): StudentDetails => {
    const stubData: StudentDetails = {
      name: "John Doe",
      email: "john.doe@example.com",
      bio: "Passionate coder and team player.",
      image: defaultProfile,
      id,
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
    return stubData;
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
            <TeamLabel>Level:</TeamLabel>
            <TeamField>{teamLevel === "A" ? "A (Competitive)" : "B (Participation)"}</TeamField>
          </div>
        </TeamInfo>
      </TeamDetailsContainer>
      <StudentsContainer>
        {students.map((student, index) => (
          <StudentCard key={student.id} $isFirst={index === 0}>
            <StudentCardContent>
              <ContentContainer>
                <StudentImage
                  src={student.image || defaultProfile}
                  onError={(e) => (e.currentTarget.src = defaultProfile)}
                  alt={`${student.name}'s profile`}
                />
                <StudentInfo>
                  <div>
                    <StudentName>{student.name}</StudentName>
                    <StudentEmail>
                      {student.email}
                      {copiedEmailIndex === index ? (
                        <CheckIcon />
                      ) : (
                        <CopyIcon
                          $copied={copiedEmailIndex === index}
                          onClick={() => copyToClipboard(student.email, index)}
                        />
                      )}
                    </StudentEmail>
                  </div>
                  <StudentBio>{student.bio}</StudentBio>
                </StudentInfo>
              </ContentContainer>
              {index === 0 && ( // Render Edit functionality only for the first student card
                <EditIcon
                  onClick={async () => {
                    const studentDetails = await fetchStudentDetails(student.id);
                    setEditingPreferences(studentDetails);
                  }}
                />
              )}
            </StudentCardContent>
          </StudentCard>
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
