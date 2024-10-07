import { UniversityController } from '../controllers/university_controller';
import { SessionRepository } from '../repository/session_repository_type';
import { UniversityRepository } from '../repository/university_repository_type';
import { UniversityService } from '../services/university_service';
import { Request, Response } from 'express';

describe('UniversityController', () => {
  let universityService: UniversityService;
  let mockUniversityRepository: jest.Mocked<UniversityRepository>;

  beforeEach(() => {
    mockUniversityRepository = {
      universitiesList: jest.fn(),
    } as jest.Mocked<UniversityRepository>;
    
    universityService = new UniversityService(mockUniversityRepository);
  });

  describe('successful cases', () => {
    test('success', async () => {
      const mockUniversitiesList = {
        universities: [
          { id: 1, name: 'UNSW' },
          { id: 2, name: 'USYD' },
        ],
      };

      mockUniversityRepository.universitiesList.mockResolvedValue(mockUniversitiesList);

      const result = await universityService.universitiesList();

      expect(result).toEqual(mockUniversitiesList);
    });
  });
});
