import { SqlDbCompetitionRepository } from '../../../repository/competition/SqlDbCompetitionRepository';
import pool, { dropTestDatabase } from '../Utils/dbUtils';

// have not been implemented*
describe.skip('Staff Register Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });
  test.skip('Sucess case: returns the users team details', async () => {
    expect(2 + 2).toEqual(4);
  });
});