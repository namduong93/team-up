import { UniversityController } from '../../../controllers/university_controller';
import { SessionRepository } from '../../../repository/session_repository_type';
import { SqlDbUniversityRepository } from '../../../repository/university/sqldb';
import { UniversityRepository } from '../../../repository/university_repository_type';
import { UniversityService } from '../../../services/university_service';
import { Request, Response } from 'express';
import pool from '../test_util/test_utilities';

describe('GET universities/list', () => {
  let universityService: UniversityService;

  beforeAll(async () => {
    // Initialize the UniversityService with real repositories that connect to the test database
    universityService = new UniversityService(new SqlDbUniversityRepository(pool));
  });

  afterAll(() => {
    // Clean up and close the database connection
    pool.end();
  });

  describe('successful cases', () => {
    test('success', async () => {
      const mockUniversitiesList = {
        universities: [
          { id: 1, name: 'University of Melbourne' },
          { id: 2, name: 'Monash University' },
          { id: 3, name: 'RMIT University' },
          { id: 4, name: 'University of Sydney' },
          { id: 5, name: 'University of New South Wales' },
        ],
      };

      const result = await universityService.universitiesList();

      expect(result).toEqual(mockUniversitiesList);
    });
  });
});
