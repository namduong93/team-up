import { SessionIdObject, UserService } from '../services/user_service';
import { UserRepository } from '../repository/user_repository_type';
import { Student } from '../models/user/student/student';

describe('POST /student/register', () => {
    let userService: UserService;
    let mockUserRepository: jest.Mocked<UserRepository>;

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

        userService = new UserService(mockUserRepository);
    });

    describe('studentRegister', () => {
        test('should register a student successfully', async () => {
          const mockStudent: Student = {
            name: 'Quan',
            email: 'hoangtungquan@gmail.com',
            password: 'testPassword',
            tshirtSize: 'M',
            universityId: 1,
            studentId: 'z5296486'
          };

          const mockSessionId: SessionIdObject = {
            sessionId: 'mockSessionId',
          };

          mockUserRepository.studentRegister.mockResolvedValue(mockSessionId);

          const result = await userService.studentRegister(mockStudent);

          expect(result).toEqual(mockSessionId);
          expect(mockUserRepository.studentRegister).toHaveBeenCalledWith(mockStudent);
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
});
