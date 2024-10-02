import { Student } from "../models/user/student/student.js";

export interface UserRepository {
  addStudent(student: Student): Promise<Student | undefined>;
};