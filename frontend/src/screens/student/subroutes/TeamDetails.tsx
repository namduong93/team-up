import { FC, useEffect, useState } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";
import { StudentInfo } from "../../../../shared_types/Competition/student/StudentInfo";
import { sendRequest } from "../../../utility/request";
import { ProfileCard } from "../subcomponents/ProfileCard/ProfileCard";
import { backendURL } from "../../../../config/backendURLConfig";
import { EditCompUserDetails } from "../subcomponents/EditCompUserDetails/EditCompUserDetails";

const StyledDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  max-height: 70%;
  gap: 5%;
`;

const StyledTeamDetailsContainer = styled.div`
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

const StyledTeamInfo = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  flex: 1;
  cursor: default;
`;

const StyledTeamLabel = styled.h2`
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.regular};
  color: ${({ theme }) => theme.colours.primaryDark};
`;

const StyledTeamField = styled.p`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 10px;
  box-sizing: border-box;
`;

const StyledStudentsContainer = styled.div`
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
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({} as StudentInfo);
  const [isEditing, setIsEditing] = useState<boolean>(false); 

  useEffect(() => {
    const fetchStudentInfo = async () => {
      try {
        const response = await sendRequest.get<{ studentDetails: StudentInfo }>(
          '/competition/student/details',
          { compId }
        );
        setStudentInfo(response.data.studentDetails);
        console.log("Student info fetched", response.data);
      } catch (err) {
        console.log("Error fetching student info", err);
      }
    };
    fetchStudentInfo();
  }, []);

  const handleSave = async (studentDetails: StudentInfo): Promise<boolean> => {
    try {
      setStudentInfo(studentDetails);
      await sendRequest.put(
        '/competition/student/details',
        { compId, studentDetails }
      );
      return true;
    } catch (err) {
      console.error("Error updating student info:", err);
      return false;
    }
  };


  return (
    <StyledDetailsContainer>
      <StyledTeamDetailsContainer>
        <StyledTeamInfo>
          <div>
            <StyledTeamLabel>Team Name:</StyledTeamLabel>
            <StyledTeamField>{teamName}</StyledTeamField>
          </div>
          <div>
            <StyledTeamLabel>Site Location:</StyledTeamLabel>
            <StyledTeamField>{teamSite}</StyledTeamField>
          </div>
          <div>
            <StyledTeamLabel>Seat:</StyledTeamLabel>
            <StyledTeamField>{teamSeat}</StyledTeamField>
          </div>
          <div>
            <StyledTeamLabel>Level:</StyledTeamLabel>
            <StyledTeamField>{teamLevel}</StyledTeamField>
          </div>
        </StyledTeamInfo>
      </StyledTeamDetailsContainer>
      <StyledStudentsContainer>
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
              setIsEditing(true)
            }
          />
        ))}
      </StyledStudentsContainer>
      {isEditing && (
        <EditCompUserDetails
          student={studentInfo}
          onSubmit={handleSave}
          onClose={() => setIsEditing(false)}
        />
      )}
    </StyledDetailsContainer>
  );
};
