import { SessionIdObject, UserService } from '../services/user_service';
import { UserRepository } from '../repository/user_repository_type';
import { Staff } from '../models/user/staff/staff';

describe('POST /staff/register', () => {
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

    describe('staffRegister', () => {
        test('should register a staff successfully', async () => {
          const mockStaff: Staff = {
            name: 'Quan',
            email: 'hoangtungquan@gmail.com',
            password: 'testPassword',
            tshirtSize: 'M',
            universityId: 1,
          };

          const mockSessionId: SessionIdObject = {
            sessionId: 'mockSessionId',
          };

          mockUserRepository.staffRegister.mockResolvedValue(mockSessionId);

          const result = await userService.staffRegister(mockStaff);

          expect(result).toEqual(mockSessionId);
          expect(mockUserRepository.staffRegister).toHaveBeenCalledWith(mockStaff);
        });

        test('should handle failure to register a staff', async () => {
            const newStaff: Staff = {
              name: '',
              email: '',
              password: '',
              tshirtSize: '',
              universityId: 0,
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
    });
});
