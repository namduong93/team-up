import { SqlDbUserRepository } from "../repository/user/sqldb";
import pool from "./test_util/test_utilities";

describe('User Type Function', () => {
  let user_db;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
  });


  afterAll(async () => {
    await pool.end();
  });

  test('Sucess case: returns list of staff', async () => {
    console.log(await user_db.staffList(1))
  })
})