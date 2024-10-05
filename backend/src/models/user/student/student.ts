import { User, validateUser } from "../user.js";

export interface Student extends User {
  universityId: number | undefined;
  studentId: string | undefined;
};


export function validateStudent(student: Student): string {
  // Validate the student object
  if(validateUser(student) !== "") {
    return validateUser(student);
  }

  return "";
}