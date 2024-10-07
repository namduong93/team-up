import { User, validateUser } from "../user";

export interface Student extends User {
  universityId: number | undefined;
  studentId: string | undefined;
};


export function validateStudent(student: Student): string {
  // Validate the student object
  let userValidation = validateUser(student);
  if(userValidation) {
    return userValidation;
  }

  return "";
}