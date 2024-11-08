import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { SqlDbNotificationRepository } from "../../../repository/notification/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import pool, { dropTestDatabase } from "../Utils/dbUtils"

describe.skip('Notification Remove Function', () => {
  let user_db;
  let comp_db;
  let notif_db;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    comp_db = new SqlDbCompetitionRepository(pool);
    notif_db = new SqlDbNotificationRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('husk', () => {
    expect(1 + 1).toBe(2);
  })
})