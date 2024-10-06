import { UserService } from '../services/user_service';
import { UserIdObject, UserRepository } from '../repository/user_repository_type';
import { Student } from '../models/user/student/student';
import { SessionRepository, SessionTokenObject } from '../repository/session_repository_type';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('POST /student/register', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;
    let mockSessionRepository: jest.Mocked<SessionRepository>;

    beforeEach(() => {
      mockUserRepository = {
        studentRegister: jest.fn(),
        staffRegister: jest.fn(),
        userAuthenticate: jest.fn(),
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
    });

    test('should register a student successfully', async () => {
      const mockStudent: Student = {
        name: 'Quan',
        email: 'hoangtungquan@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
        studentId: 'z5296486'
      };

      const mockUserId: UserIdObject = {
        userId: 1,
      };

      const mockSessionToken: SessionTokenObject = {
        sessionToken: 'mock-token-1234',
      };
      (uuidv4 as jest.Mock).mockReturnValue('mock-token-1234');

      mockUserRepository.studentRegister.mockResolvedValue(mockUserId);
      mockSessionRepository.create.mockResolvedValue(mockSessionToken);

      const result = await userService.studentRegister(mockStudent);

      expect(result).toEqual(mockSessionToken);
      expect(mockUserRepository.studentRegister).toHaveBeenCalledWith(mockStudent);
      expect(mockSessionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          userId: mockUserId.userId,
          token: 'mock-token-1234',
          createdAt: expect.any(Number),
      }));
    });

    test('should handle failure to register a student', async () => {
      const newStudent: Student = {
        name: '',
        email: '',
        password: '',
        tshirtSize: '',
        universityId: 0,
        studentId: ''
      };

      const errorMessage = "Failed to register student";
      mockUserRepository.studentRegister.mockRejectedValue(new Error(errorMessage));

      try {
          await userService.studentRegister(newStudent);
      } catch (error) {
          if (error instanceof Error) {
              expect(error.message).toBe(errorMessage);
          } else {
              expect(error).toBe("Unknown error");
          }
      }

      expect(mockUserRepository.studentRegister).toHaveBeenCalledWith(newStudent);
    });
});
