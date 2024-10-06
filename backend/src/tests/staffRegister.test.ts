import { UserService } from '../services/user_service';
import { UserIdObject, UserRepository } from '../repository/user_repository_type';
import { Staff } from '../models/user/staff/staff';
import { SessionRepository, SessionTokenObject } from '../repository/session_repository_type';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid'); // Mocking uuid

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


    test('should register a staff successfully', async () => {
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
          sessionToken: 'mock-token-5678',
      };

      (uuidv4 as jest.Mock).mockReturnValue('mock-token-5678'); // Mocking UUID

      mockUserRepository.staffRegister.mockResolvedValue(mockUserId);
      mockSessionRepository.create.mockResolvedValue(mockSessionToken);

      const result = await userService.staffRegister(mockStaff);

      expect(result).toEqual(mockSessionToken);
      expect(mockUserRepository.staffRegister).toHaveBeenCalledWith(mockStaff);
      expect(mockSessionRepository.create).toHaveBeenCalledWith(expect.objectContaining({
          userId: mockUserId.userId,
          token: 'mock-token-5678',
          createdAt: expect.any(Number),
      }));
    });

    test('should handle failure to register a staff', async () => {
      const newStaff: Staff = {
          name: '',
          email: '',
          password: '',
          tshirtSize: '',
          universityId: 0,
      };

      const errorMessage = 'Failed to register staff';
      mockUserRepository.staffRegister.mockRejectedValue(new Error(errorMessage));

      try {
          await userService.staffRegister(newStaff);
      } catch (error) {
          if (error instanceof Error) {
              expect(error.message).toBe(errorMessage);
          } else {
              expect(error).toBe('Unknown error');
          }
      }

      expect(mockUserRepository.staffRegister).toHaveBeenCalledWith(newStaff);
    });
});
