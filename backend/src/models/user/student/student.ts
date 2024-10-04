import { University } from "../../university/university.js";
import { User } from "../user.js";

export class Student extends User {
  private university: University | undefined;
  private studentId: string | undefined;

  constructor(
    id: number, name: string, hashedPassword: string, email: string,
    tshirt_size: string, pronouns?: string | undefined, allergies?: string | undefined,
    accessibilityReqs?: string | undefined, university?: University | undefined, studentId?: string | undefined
  ) {
    super(id, name, hashedPassword, email, tshirt_size, pronouns, allergies, accessibilityReqs);
    this.university = university;
    this.studentId = studentId;
  }

  getUniversity(): University | undefined {
    return this.university;
  }

  getStudentId(): string | undefined {
    return this.studentId;
  }
}

export function validate(student: Student): string {
  // Validate the student object
  if (!student.getName() || student.getName().length === 0) {
    return "Name is required";
  }

  if (!student.getEmail() || student.getEmail().length === 0) {
    return "Email is required";
  }

  if (!student.getHashedPassword() || student.getHashedPassword().length === 0) {
    return "Password is required";
  }

  if (!student.getTshirtSize() || student.getTshirtSize().length === 0) {
    return "Tshirt size is required";
  }

  return "";
}