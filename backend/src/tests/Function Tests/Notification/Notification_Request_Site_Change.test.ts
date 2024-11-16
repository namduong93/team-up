import { SqlDbCompetitionRepository } from "../../../repository/competition/SqlDbCompetitionRepository";
import { SqlDbNotificationRepository } from "../../../repository/notification/SqlDbNotificationRepository";
import { SqlDbUserRepository } from "../../../repository/user/SqlDbUserRepository";
import pool, { dropTestDatabase } from "../Utils/dbUtils"

describe.skip('Notification Request Site Change Withdrawal Function', () => {
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