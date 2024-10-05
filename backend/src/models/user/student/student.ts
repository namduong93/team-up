
import { University } from "../../university/university.js";
import { User } from "../user.js";

export interface Student extends User {
  university: University | undefined;
  studentId: string | undefined;
};


export function validate(student: Student): string {
  // Validate the student object
  if (!student.name || student.name.length === 0) {
    return "Name is required";
  }

  if (!student.email || student.email.length === 0) {
    return "Email is required";
  }

  if (!student.password || student.password.length === 0) {
    return "Password is required";
  }

  if (!student.tshirtSize || student.tshirtSize.length === 0) {
    return "Tshirt size is required";
  }

  return "";
}