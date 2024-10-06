import { UserService } from '../services/user_service';
import { UserIdObject, UserRepository } from '../repository/user_repository_type';
import { Staff } from '../models/user/staff/staff'; // Adjust the import according to your project structure
import { SessionRepository, SessionTokenObject } from '../repository/session_repository_type';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('POST /staff/register', () => {
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

  describe('successful cases', () => {
    test('success', async () => {
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

      mockUserRepository.staffRegister.mockResolvedValue(mockUserId);
      mockSessionRepository.create.mockResolvedValue(mockSessionToken);

      const result = await userService.staffRegister(mockStaff);

      expect(result).toEqual(mockSessionToken);
      expect(mockUserRepository.staffRegister).toHaveBeenCalledWith(mockStaff);
      expect(mockSessionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          userId: mockUserId.userId,
          sessionId: 'mock-token-1234',
          createdAt: expect.any(Number),
      }));
    });
  })

  describe('failing cases', () => {
    test('missing name', async () => {
      const newStaff: Staff = {
        name: '',
        email: 'hoangtungquan@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      const errorMessage = "Failed to register staff";
      mockUserRepository.staffRegister.mockRejectedValue(new Error(errorMessage));

      try {
          await userService.staffRegister(newStaff);
      } catch (error) {
          if (error instanceof Error) {
              expect(error.message).toBe(errorMessage);
          } else {
              expect(error).toBe("Unknown error");
          }
      }

      expect(mockUserRepository.staffRegister).toHaveBeenCalledWith(newStaff);
    });

    test('missing email', async () => {
      const newStaff: Staff = {
        name: 'Quan',
        email: '',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      const errorMessage = "Failed to register staff";
      mockUserRepository.staffRegister.mockRejectedValue(new Error(errorMessage));

      try {
          await userService.staffRegister(newStaff);
      } catch (error) {
          if (error instanceof Error) {
              expect(error.message).toBe(errorMessage);
          } else {
              expect(error).toBe("Unknown error");
          }
      }

      expect(mockUserRepository.staffRegister).toHaveBeenCalledWith(newStaff);
    });

    test('missing password', async () => {
      const newStaff: Staff = {
        name: 'Quan',
        email: 'hoangtungquan@gmail.com',
        password: '',
        tshirtSize: 'M',
        universityId: 1,
      };

      const errorMessage = "Failed to register staff";
      mockUserRepository.staffRegister.mockRejectedValue(new Error(errorMessage));

      try {
          await userService.staffRegister(newStaff);
      } catch (error) {
          if (error instanceof Error) {
              expect(error.message).toBe(errorMessage);
          } else {
              expect(error).toBe("Unknown error");
          }
      }

      expect(mockUserRepository.staffRegister).toHaveBeenCalledWith(newStaff);
    });

    test('missing t-shirt size', async () => {
      const newStaff: Staff = {
        name: 'Quan',
        email: 'hoangtungquan@gmail.com',
        password: 'testPassword',
        tshirtSize: '',
        universityId: 1,
      };

      const errorMessage = "Failed to register staff";
      mockUserRepository.staffRegister.mockRejectedValue(new Error(errorMessage));

      try {
          await userService.staffRegister(newStaff);
      } catch (error) {
          if (error instanceof Error) {
              expect(error.message).toBe(errorMessage);
          } else {
              expect(error).toBe("Unknown error");
          }
      }

      expect(mockUserRepository.staffRegister).toHaveBeenCalledWith(newStaff);
    });

    test('duplicated email', async () => {
      const mockStaff1: Staff = {
        name: 'Quan',
        email: 'hoangtungquan22@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      const mockStaff2: Staff = {
        name: 'Not Quan',
        email: 'hoangtungquan22@gmail.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      mockUserRepository.staffRegister.mockResolvedValue({ userId: 1 });
      await userService.staffRegister(mockStaff1);

      mockUserRepository.staffRegister.mockResolvedValue({ userId: 2 });
      try {
          await userService.staffRegister(mockStaff2);
      } catch (error) {
          if (error instanceof Error) {
              expect(error.message).toBe('Staff with this email already exists');
          } else {
              expect(error).toBe("Unknown error");
          }
      }
    });
  });
});
