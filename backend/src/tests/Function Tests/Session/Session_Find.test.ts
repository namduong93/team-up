import { SqlDbSessionRepository } from "../../../repository/session/sqldb";

import pool, { dropTestDatabase } from "../Utils/dbUtils"
import { UserIdObject } from "../../../repository/user_repository_type";
import { Student } from "../../../models/user/student/student";
import { Session } from "../../../models/session/session";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";

describe('Session Find Function', () => {
  let session_db;
  let timeStamp = Date.now();
  let user_db;
  let student: UserIdObject;

  const mockStudent: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'notifSacrifice2@gmail.com',
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

  test('Success case: a new session is created', async () => {
    expect(await session_db.find('ezID')).toStrictEqual({
      sessionId: 'ezID                                ',
      userId: student.userId,
      createdAt: expect.any(Date)
    })
  })
})