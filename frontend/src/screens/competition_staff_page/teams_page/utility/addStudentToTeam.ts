import React from "react";
import { Student, TeamDetails } from "../../../../../shared_types/Competition/team/TeamDetails";

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
  const newTeamLevel = (newTeam.students.length > 1
                      && newTeam.students.every((std) => std.level === 'Level A')
                      && student.level === 'Level A'
  ) ? 'Level A' : 'Level B';

  const currentTeamLevel = (
    currentTeam.students.length >= 4
    && currentTeam.students.every((std) => std.level === 'Level A' || std.userId === student.userId)

  ) ? 'Level A' : 'Level B';

  if (newTeamIndex < currentTeamIndex) {
    setTeamList([
      ...teamList.slice(0, newTeamIndex),
      { ...newTeam, teamLevel: newTeamLevel, students: [...newTeam.students, student] },
      ...teamList.slice(newTeamIndex + 1, currentTeamIndex),
      { ...currentTeam, teamLevel: currentTeamLevel, students: currentTeam.students.filter((currentStudent) => currentStudent.userId !== student.userId) },
      ...teamList.slice(currentTeamIndex + 1)
    ]);
  } else if (currentTeamIndex < newTeamIndex) {
    setTeamList([
      ...teamList.slice(0, currentTeamIndex),
      { ...currentTeam, teamLevel: currentTeamLevel, students: currentTeam.students.filter((currentStudent) => currentStudent.userId !== student.userId) },
      ...teamList.slice(currentTeamIndex + 1, newTeamIndex),
      { ...newTeam, teamLevel: newTeamLevel, students: [...newTeam.students, student] },
      ...teamList.slice(newTeamIndex + 1)
    ])
  } else {
    return false;
  }

  return true;

}