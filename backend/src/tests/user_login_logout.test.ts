import { UserService } from '../services/user_service';
import { UserIdObject, UserRepository } from '../repository/user_repository_type';
import { Student } from '../models/user/student/student';
import { SessionRepository, SessionTokenObject } from '../repository/session_repository_type';
import { v4 as uuidv4 } from 'uuid';
import HttpError from "http-errors";
import { Staff } from '../models/user/staff/staff';
import exp from 'constants';

jest.mock('uuid');

describe('POST /user/login and POST /user/logout', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockSessionRepository: jest.Mocked<SessionRepository>;

  let mockStudent: Student;
  let mockStaff: Staff;
  let mockUserId: UserIdObject;
  let mockSessionToken: SessionTokenObject;

  beforeEach(() => {
    mockUserRepository = {
      studentRegister: jest.fn(),
      staffRegister: jest.fn(),
      userAuthenticate: jest.fn(),
      userProfileInfo: jest.fn(),
      userLogin: jest.fn(),
      userType: jest.fn(),
      studentDashInfo: jest.fn(),
      staffDashInfo: jest.fn(),
      systemAdminDashInfo: jest.fn(),
    } as jest.Mocked<UserRepository>;

    mockSessionRepository = {
      find: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as jest.Mocked<SessionRepository>;

    userService = new UserService(mockUserRepository, mockSessionRepository);

    mockStudent = {
      name: 'Quan',
      email: 'hoangtungquan@gmail.com',
      password: 'testPassword',
      tshirtSize: 'M',
      universityId: 1,
      studentId: 'z5296486'
    };

    mockStaff = {
      name: 'Quan',
      email: 'hoangtungquan@gmail.com',
      password: 'testPassword',
      tshirtSize: 'M',
      universityId: 1,
    };

    mockUserId = {
      userId: 1,
    };

    mockSessionToken = {
      sessionId: 'mock-token-1234',
    };
  });

  describe('successful cases', () => {
    test('student register => logout => login', async () => {
      (uuidv4 as jest.Mock).mockReturnValue(mockSessionToken.sessionId);
      mockSessionRepository.create.mockResolvedValue(mockSessionToken);

      // Register the student
      mockUserRepository.studentRegister.mockResolvedValue(mockUserId);
      await userService.studentRegister(mockStudent);

      // Log the user out
      mockSessionRepository.delete.mockResolvedValue(undefined);
      await userService.userLogout(mockSessionToken.sessionId);
      expect(mockSessionRepository.delete).toHaveBeenCalledWith(mockSessionToken.sessionId);

      // Log the user back in
      const newMockSessionToken = 'newMockSessionToken';
      (uuidv4 as jest.Mock).mockReturnValue(newMockSessionToken);

      // Mocking a new session creation for the new login attempt
      mockSessionRepository.create.mockResolvedValue({
        sessionId: newMockSessionToken,
      });

      mockUserRepository.userLogin.mockResolvedValue(mockUserId);
      const sessionAfterRelogin = await userService.userLogin(mockStudent.email, mockStudent.password);

      expect(sessionAfterRelogin).toEqual({ sessionId: newMockSessionToken });
      expect(mockSessionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId.userId,
          sessionId: newMockSessionToken,
          createdAt: expect.any(Number),
        })
      );

      // Log the user out
      mockSessionRepository.delete.mockResolvedValue(undefined);
      await userService.userLogout(mockSessionToken.sessionId);
      expect(mockSessionRepository.delete).toHaveBeenCalledWith(mockSessionToken.sessionId);
    });

    test('staff register => logout => login', async () => {
      const mockStaff: Staff = {
        name: 'Quan',
        email: 'hoangtungquan@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      const mockUserId: UserIdObject = {
        userId: 1,
      };

      const mockSessionToken: SessionTokenObject = {
        sessionId: 'mock-token-1234',
      };
      (uuidv4 as jest.Mock).mockReturnValue('mock-token-1234');
      mockSessionRepository.create.mockResolvedValue(mockSessionToken);

      // Register the student
      mockUserRepository.staffRegister.mockResolvedValue(mockUserId);
      await userService.staffRegister(mockStaff);

      // Log the user out
      mockSessionRepository.delete.mockResolvedValue(undefined);
      await userService.userLogout(mockSessionToken.sessionId);
      expect(mockSessionRepository.delete).toHaveBeenCalledWith(mockSessionToken.sessionId);

      // Log the user back in
      const newMockSessionToken = 'newMockSessionToken';
      (uuidv4 as jest.Mock).mockReturnValue(newMockSessionToken);

      // Mocking a new session creation for the new login attempt
      mockSessionRepository.create.mockResolvedValue({
        sessionId: newMockSessionToken,
      });

      mockUserRepository.userLogin.mockResolvedValue(mockUserId);
      const sessionAfterRelogin = await userService.userLogin(mockStaff.email, mockStaff.password);

      expect(sessionAfterRelogin).toEqual({ sessionId: newMockSessionToken });
      expect(mockSessionRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUserId.userId,
          sessionId: newMockSessionToken,
          createdAt: expect.any(Number),
        })
      );

      // Log the user out
      mockSessionRepository.delete.mockResolvedValue(undefined);
      await userService.userLogout(mockSessionToken.sessionId);
      expect(mockSessionRepository.delete).toHaveBeenCalledWith(mockSessionToken.sessionId);
    });
  });

  describe('failing cases', () => {
    test('login with undefined email', async () => {
      await expect(userService.userLogin(undefined, mockStudent.password))
        .rejects
        .toThrow(HttpError.BadRequest('Email is required'));
    });

    test('login with empty password', async () => {
      await expect(userService.userLogin(mockStudent.email, ''))
        .rejects
        .toThrow(HttpError.BadRequest('Password is required'));
    });

    test('login with non-matching credentials', async () => {
      await expect(userService.userLogin(mockStudent.email, 'wrongPassword'))
        .rejects
        .toThrow(HttpError.Unauthorized('Invalid email or password'));
    });
  });
});
