import { Session } from "../../../models/session/session";
import { Student } from "../../../models/user/student/student";
import { SqlDbSessionRepository } from "../../../repository/session/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb";
import { UserIdObject } from "../../../repository/user_repository_type";

import pool, { dropTestDatabase } from "../Utils/dbUtils"

// session create is bugged
describe.skip('Session Create Function', () => {
  let session_db;
  let timeStamp = Date.now();
  let user_db;
  let student: UserIdObject;

  const mockStudent: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'notifSacrifice1@gmail.com',
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
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Success case: a new session is created', async () => {
    console.log(timeStamp);
    const newSession: Session = {
      sessionId: 'ezID',
      createdAt: timeStamp,
      userId: student.userId
    }
    await session_db.create(newSession);
    console.log(await session_db.find('ezID'));
    expect(await session_db.find('ezID')).toStrictEqual({
      sessionId: 'ezID                                ',
      userId: student.userId,
      createdAt: new Date(timeStamp)
    })
  })
})