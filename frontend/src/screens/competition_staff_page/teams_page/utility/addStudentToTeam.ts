import React from "react";
import { TeamDetails } from "../components/TeamCard";
import { Student } from "../../../student/TeamProfile";

export const addStudentToTeam = (
  student: Student,
  currentTeamIndex: number, newTeamIndex: number,
  [teamList, setTeamList]: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>], 
) => {

  const newTeam = teamList[newTeamIndex];
  if (newTeam.students.length > 3) {
    return false;
  }
  const currentTeam = teamList[currentTeamIndex];

  if (newTeamIndex < currentTeamIndex) {
    setTeamList([
      ...teamList.slice(0, newTeamIndex),
      { ...newTeam, students: [...newTeam.students, student] },
      ...teamList.slice(newTeamIndex + 1, currentTeamIndex),
      { ...currentTeam, students: currentTeam.students.filter((currentStudent) => currentStudent.userId !== student.userId) },
      ...teamList.slice(currentTeamIndex + 1)
    ]);
  } else if (currentTeamIndex < newTeamIndex) {
    setTeamList([
      ...teamList.slice(0, currentTeamIndex),
      { ...currentTeam, students: currentTeam.students.filter((currentStudent) => currentStudent.userId !== student.userId) },
      ...teamList.slice(currentTeamIndex + 1, newTeamIndex),
      { ...newTeam, students: [...newTeam.students, student] },
      ...teamList.slice(newTeamIndex + 1)
    ])
  } else {
    return false;
  }

  return true;

}