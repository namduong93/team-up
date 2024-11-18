import { DbError } from '../../../errors/DbError';
import { University } from '../../../models/university/university';
import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import { SqlDbUserRepository } from '../../../repository/user/SqlDbUserRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';


describe('Competition Default Site Function', () => {
  let user_db: SqlDbUserRepository;
  let comp_db: SqlDbCompetitionRepository;

  const mockUniversity: University = {
    id: 1,
    name: 'University of Melbourne'
  };

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    comp_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success case', async () => {
    const result = await comp_db.competitionUniversityDefaultSite(1, mockUniversity);
    expect(result).toStrictEqual({
      'id': expect.any(Number),
      'name': expect.any(String),
      'universityId': 1,
    })
  });

  test('Fail case', async () => {
    await expect(comp_db.competitionUniversityDefaultSite(9999, mockUniversity)).rejects.toThrow(DbError);
  });
});