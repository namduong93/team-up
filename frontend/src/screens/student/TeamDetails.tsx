import { FC } from "react";
import styled from "styled-components";
import { useOutletContext } from "react-router-dom";
import { FaRegCopy  } from "react-icons/fa";
import defaultProfile from "./default-profile.jpg";

interface Student {
  name: string;
  email: string;
  bio: string;
  image: string;
};

const DetailsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 75%;
  align-items: center;
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
  max-width: 45%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  height: 100%;
  justify-content: space-around;
`;

const StudentCard = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colours.primaryLight};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.background};
  width: 100%;
  padding: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StudentCardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  flex: 1;
  margin-left: 5%;
`;

const StudentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 80%;
  justify-content: space-around;
  width: 100%;
  max-width: 75%;

  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const StudentName = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  color: ${({ theme }) => theme.fonts.colour};
`;

const StudentEmail = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  text-decoration: underline;
  color: ${({ theme }) => theme.colours.primaryDark};
  display: flex;
  align-items: center;
`;

const CopyIcon = styled(FaRegCopy)`
  margin-left: 5%;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.primaryDark};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const StudentBio = styled.p`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.descriptor};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 10px;
  overflow-wrap: break-word;
  white-space: normal;
`;

const StudentImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

export const TeamDetails: FC = () => {
  const { teamName, teamSite, teamLevel, students } = useOutletContext<{
    teamName: string;
    teamSite: string;
    teamLevel: "A" | "B" | "AB";
    students: Student[];
  }>();

  const copyToClipboard = (email: string) => {
    navigator.clipboard.writeText(email);
    alert(`${email} copied to clipboard!`);
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
          <StudentCard key={index}>
            <StudentCardContent>
              <StudentImage src={student.image || defaultProfile} alt={`${student.name}'s profile`} />
              <StudentInfo>
                <div>
                  <StudentName>{student.name}</StudentName>
                  <StudentEmail>
                    {student.email}
                    <CopyIcon onClick={() => copyToClipboard(student.email)} />
                  </StudentEmail>
                </div>
                <StudentBio>{student.bio}</StudentBio>
              </StudentInfo>
            </StudentCardContent>
          </StudentCard>
        ))}
      </StudentsContainer>
    </DetailsContainer>
  );
};
