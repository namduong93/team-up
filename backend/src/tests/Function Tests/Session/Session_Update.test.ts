import { Session } from "../../../models/session/session";
import { Student } from "../../../models/user/student/student";
import { SqlDbSessionRepository } from "../../../repository/session/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";

import pool, { dropTestDatabase } from "../Utils/dbUtils"

// session update has not been implemented
describe.skip('Session Update Function', () => {
  let session_db;
  let timeStamp = Date.now();
  let user_db;
  let student: UserIdObject;

  const mockStudent: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'notifSacrifice3@gmail.com',
    password: 'testPassword',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 1,
    studentId: 'z5381412'
  };

  beforeAll(async () => {
    session_db = new SqlDbSessionRepository(pool);
    user_db = new SqlDbUserRepository(pool);
    student = await user_db.studentRegister(mockStudent)
    const newSession: Session = {
      sessionId: 'ezID',
      createdAt: timeStamp,
      userId: student.userId
    }
    await session_db.create(newSession);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('husk', async () => {
    expect(2 + 2).toStrictEqual(4)
  })
})