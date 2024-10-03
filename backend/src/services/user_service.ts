import { Staff } from "../models/user/staff/staff.js";
import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { StaffJSON } from "../models/user/staff/staff_json.js";
import { Student } from "../models/user/student/student.js";
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { StudentJSON } from "../models/user/student/student_json.js";
import { User } from "../models/user/user.js";
import { UserJSON } from "../models/user/user_json.js";
import { UserRepository } from "../repository/user_repository_type.js";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  studentRegister = async (student: StudentJSON): Promise<Student | undefined> => {
    // use the user passed in to do some stuff and call the 
    // userRepository methods to interact with the db on behalf of the user.
    return new Student(1, '', '', '', '');
  }

  staffRegister = async (staff: StaffJSON): Promise<Staff | undefined> => {

    return new Staff(1, '', '', '', '');
  }

  userLogin = async (email: string, password: string): Promise<User | undefined> => {

    return new User(1, '', '', '', '');
  }

  userType = async (sessionId: string): Promise<string | undefined> => {
    
    return 'student';
  }

  studentDashInfo = async (sessionId: string): Promise<StudentDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  staffDashInfo = async (sessionId: string): Promise<StaffDashInfo | undefined> => {
    
    return { preferredName: 'Name' };
  }

  
}