
import { UserService } from '../services/user_service';
import { UserIdObject, UserRepository } from '../repository/user_repository_type';
import { SessionRepository } from '../repository/session_repository_type';
import { Student } from '../models/user/student/student';

describe('GET /user/profile_info', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockSessionRepository: jest.Mocked<SessionRepository>;

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
  });
  
  describe('successful cases', () => {
    test('student success', async () => {
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

      const mockSessionToken = 'mockSessionTokenStudent';

      // Mocking the session repository's find method to return the userId
      mockSessionRepository.find.mockResolvedValue({
        sessionId: mockSessionToken,
        createdAt: new Date().getTime(),
        userId: mockUserId.userId,
      });

      mockUserRepository.userProfileInfo.mockResolvedValue({
        name: mockStudent.name,
        email: mockStudent.email,
        university: 'University of Melbourne', // TODO: find a way to not hardcode this
      });

      // Register the student
      mockUserRepository.studentRegister.mockResolvedValue(mockUserId);
      await userService.studentRegister(mockStudent);

      // Retrieve user profile info using the mock session token
      const result = await userService.userProfileInfo(mockUserId.userId);

      expect(result).toEqual(expect.objectContaining({
        name: 'Quan',
        email: 'hoangtungquan@gmail.com',
        university: expect.any(String), // You can also assert a specific university name if needed
      }));

      // Does not matter if we pass in another userId here, the mock will always return the same result
      const result_2 = await userService.userProfileInfo(mockUserId.userId + 1);

      expect(result_2).toEqual(expect.objectContaining({
        name: 'Quan',
        email: 'hoangtungquan@gmail.com',
        university: expect.any(String),
      }));
    });

    test('staff success', async () => {
      const mockStaff = {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'testPassword',
        tshirtSize: 'M',
        universityId: 1,
      };

      const mockUserId: UserIdObject = {
        userId: 2,
      };

      const mockSessionToken = 'mockSessionTokenStaff';

      // Mocking the session repository's find method to return the userId
      mockSessionRepository.find.mockResolvedValue({
        sessionId: mockSessionToken,
        createdAt: new Date().getTime(),
        userId: mockUserId.userId,
      });

      mockUserRepository.userProfileInfo.mockResolvedValue({
        name: mockStaff.name,
        email: mockStaff.email,
        university: 'University of Melbourne', // TODO: find a way to not hardcode this
      });

      // Register the staff
      mockUserRepository.staffRegister.mockResolvedValue(mockUserId);
      await userService.staffRegister(mockStaff);

      // Retrieve user profile info using the mock session token
      const result = await userService.userProfileInfo(mockUserId.userId);

      expect(result).toEqual(expect.objectContaining({
        name: 'Alice',
        email: 'alice@example.com',
        university: expect.any(String), // You can also assert a specific university name if needed
      }));

      // Does not matter if we pass in another userId here, the mock will always return the same result
      const result_2 = await userService.userProfileInfo(mockUserId.userId + 1);

      expect(result_2).toEqual(expect.objectContaining({
        name: 'Alice',
        email: 'alice@example.com',
        university: expect.any(String),
      }));
    });
  });
});