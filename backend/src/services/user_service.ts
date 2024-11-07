import { StaffDashInfo } from "../models/user/staff/staff_dash_info.js";
import { SystemAdminDashInfo } from "../models/user/staff/system_admin/system_admin_dash_info.js";
import { StudentDashInfo } from "../models/user/student/student_dash_info.js";
import { UserRepository } from "../repository/user_repository_type.js";
import { SessionRepository, SessionTokenObject } from "../repository/session_repository_type.js";
import { Session } from "../models/session/session.js";
import { v4 as uuidv4 } from 'uuid';
import { UserProfileInfo } from "../models/user/user_profile_info.js";
import createHttpError from "http-errors";
import { Student, validateStudent } from "../models/user/student/student.js";
import { Staff, validateStaff } from "../models/user/staff/staff.js";
import { convertGenderToP, UserTypeObject } from "../models/user/user.js";
import { UserDashInfo } from "../models/user/user_dash_info.js";

export class UserService {
  private userRepository: UserRepository;
  private sessionRepository: SessionRepository;

  constructor(userRepository: UserRepository, sessionRepository: SessionRepository) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
  }

  studentRegister = async (student: Student): Promise<SessionTokenObject | undefined> => {
    if (!student.pronouns) {
      student.pronouns = convertGenderToP(student.gender);
    }
    const validated = validateStudent(student);
    if (validated) {
      throw createHttpError(400, validated);
    }

    const userIdObject = await this.userRepository.studentRegister(student);
    if (!userIdObject) {
      throw createHttpError(400, 'Student with this email already exists');
    }

    let session: Session = {
      sessionId: uuidv4(),
      userId: userIdObject.userId,
      createdAt: Math.floor(Date.now() / 1000)
    };
    await this.sessionRepository.create(session);
    return { sessionId: session.sessionId };
  }

  staffRegister = async (staff: Staff): Promise<SessionTokenObject | undefined> => {
    if (!staff.pronouns) {
      staff.pronouns = convertGenderToP(staff.gender);
    }
    const validated = validateStaff(staff);
    if (validated) {
      throw createHttpError(400, validated);
    }

    let userIdObject = await this.userRepository.staffRegister(staff);
    if (!userIdObject) {
      throw createHttpError(400, 'Student with this email already exists');
    }

    let session: Session = {
      sessionId: uuidv4(),
      userId: userIdObject.userId,
      createdAt: Math.floor(Date.now() / 1000)
    };
    await this.sessionRepository.create(session);
    return { sessionId: session.sessionId };
  }

  userLogin = async (email: string, password: string): Promise<SessionTokenObject | undefined> => {
    if (!email || email.length === 0) {
      throw createHttpError(400, 'Email is required');
    }
    if (!password || password.length === 0) {
      throw createHttpError(400, 'Password is required');
    }

    const userIdObject = await this.userRepository.userLogin(email, password);
    if (!userIdObject) {
      throw createHttpError(401, 'Invalid email or password');
    }

    let session: Session = {
      sessionId: uuidv4(),
      userId: userIdObject.userId,
      createdAt: Math.floor(Date.now() / 1000)
    };
    await this.sessionRepository.create(session);
    return { sessionId: session.sessionId };
  }

  userLogout = async (sessionToken: string): Promise<void> => {
    await this.sessionRepository.delete(sessionToken);
    return;
  }

  userProfileInfo = async (userId: number): Promise<UserProfileInfo | undefined> => {
    const userProfileInfo = await this.userRepository.userProfileInfo(userId);

    if (!userProfileInfo) {
      throw createHttpError(400, 'User not found');
    }

    return userProfileInfo;
  }

  userUpdatePassword = async (userId: number, oldPassword: string, newPassword: string): Promise<void> => {
    await this.userRepository.userUpdatePassword(userId, oldPassword, newPassword);
    return;
  }

  userUpdateProfile = async (userId: number, userProfile: UserProfileInfo): Promise<void> => {
    await this.userRepository.userUpdateProfile(userId, userProfile);
    return;
  }

  userType = async (userId: number): Promise<UserTypeObject | undefined> => {
    const userTypeObject = await this.userRepository.userType(userId);
    return userTypeObject;
  }

  userDashInfo = async (userId: number): Promise<UserDashInfo | undefined> => {
    const userDashInfo = await this.userRepository.userDashInfo(userId);
    if (!userDashInfo) {
      throw createHttpError(400, 'User not found');
    }
    return userDashInfo;
  }

}