import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useOutletContext, useParams } from "react-router-dom";
import { ProfileCard } from "./components/ProfileCard";
import { EditCompPreferences } from "./components/EditCompPreferences";
import { backendURL } from "../../../config/backendURLConfig";
import { StudentInfo } from "../../../shared_types/Competition/student/StudentInfo";
import { sendRequest } from "../../utility/request";
import { set } from "date-fns";

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

export const TeamDetails: FC = () => {
  const { teamName, teamSite, teamSeat, teamLevel, students } =
    useOutletContext<{
      teamName: string;
      teamSite: string;
      teamSeat: string;
      teamLevel: "";
      students: StudentInfo[];
    }>();
  const { compId } = useParams();

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await sendRequest.get<{ studentDetails: StudentInfo }>(
          '/competition/student/details',
          { compId, }
        );
        setStudenInfo(response.data.studentDetails);
      } catch (err) {
        console.log("Error fetching student info", err);
      }
    };
    fetchStudentInfo();
  }, []);

  const [studentInfo, setStudenInfo] =
    useState<StudentInfo | null>(null);
  
  const updateStudentInfo = async (studentInfo: StudentInfo) => {
    try {
      const response = await sendRequest.put<{ studentDetails: StudentInfo }>(
        '/competition/student/details',
        { compId, studentInfo }
      );
      setStudenInfo(response.data.studentDetails);
    } catch (err) {
      console.log("Error updating student info", err);
    }
  };

  const handleSave = (studentInfo: StudentInfo) => {
    // alert(`Saved details for: ${updatedStudent.name}`);
    // TODO: hook backend to update student's competition preferences
    updateStudentInfo(studentInfo);
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
            key={`student-${index}`}
            name={student.preferredName}
            email={student.email}
            bio={student.bio}
            image={
              `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`
            }
            preferredContact={student.preferredContact}
            isFirst={index === 0}
            onEdit={() =>
              setStudenInfo(student)
            }
          />
        ))}
      </StudentsContainer>
      {studentInfo && (
        <EditCompPreferences
          student={studentInfo}
          onSave={handleSave}
          onClose={() => setStudenInfo(null)}
        />
      )}
    </DetailsContainer>
  );
};
