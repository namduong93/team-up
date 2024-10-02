import { Student } from "../models/user/student/student.js";
import { UserRepository } from "../repository/user_repository_type.js";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  addStudent = async (student: Student): Promise<Student | undefined> => {
    // use the user passed in to do some stuff and call the 
    // userRepository methods to interact with the db on behalf of the user.
    return new Student(1, '', '', '', '');
  }
}