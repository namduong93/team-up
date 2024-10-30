import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Student Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: user does not have access to this list', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionStudents(5, 1);
    expect(result).toStrictEqual([])
  })

  test('Sucess case: returns List of students participating in competition', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionStudents(1, 1);
    expect(result).toStrictEqual([
      {
        userId: 5,
        universityId: 2,
        name: 'Test Student Account 1',
        sex: 'M',
        email: 'student@example.com',
        studentId: 'z000001',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'This Unapproved Name'
      },
      {
        userId: 6,
        universityId: 2,
        name: 'Test Student Account 2',
        sex: 'M',
        email: 'teststudent2@example.com',
        studentId: 'z000002',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'This Unapproved Name'
      },
      {
        userId: 7,
        universityId: 2,
        name: 'Test Student Account 3',
        sex: 'M',
        email: 'teststudent3@example.com',
        studentId: 'z000003',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'This Unapproved Name'
      },
      {
        userId: 8,
        universityId: 2,
        name: 'Test Student Account 4',
        sex: 'M',
        email: 'teststudent4@example.com',
        studentId: 'z000004',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'Team Zeta'
      },
      {
        userId: 9,
        universityId: 2,
        name: 'Test Student Account 5',
        sex: 'M',
        email: 'teststudent5@example.com',
        studentId: 'z000005',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'Team Zeta'
      },
      {
        userId: 10,
        universityId: 2,
        name: 'Test Student Account 6',
        sex: 'M',
        email: 'teststudent6@example.com',
        studentId: 'z000006',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'Team Zeta'
      },
      {
        userId: 12,
        universityId: 2,
        name: 'Test Student Account 7',
        sex: 'M',
        email: 'teststudent7@example.com',
        studentId: 'z000007',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'P Team, U Name'
      },
      {
        userId: 13,
        universityId: 2,
        name: 'Test Student Account 8',
        sex: 'M',
        email: 'teststudent8@example.com',
        studentId: 'z000008',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'P Team, U Name'
      },
      {
        userId: 14,
        universityId: 2,
        name: 'Test Student Account 9',
        sex: 'M',
        email: 'teststudent9@example.com',
        studentId: 'z000009',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'P Team, U Name'
      }
    ])
  })
  test('Sucess case 2: check if coaches also have access', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionStudents(2, 1);
    expect(result).toStrictEqual([
      {
        userId: 5,
        universityId: 2,
        name: 'Test Student Account 1',
        sex: 'M',
        email: 'student@example.com',
        studentId: 'z000001',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'This Unapproved Name'
      },
      {
        userId: 6,
        universityId: 2,
        name: 'Test Student Account 2',
        sex: 'M',
        email: 'teststudent2@example.com',
        studentId: 'z000002',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'This Unapproved Name'
      },
      {
        userId: 7,
        universityId: 2,
        name: 'Test Student Account 3',
        sex: 'M',
        email: 'teststudent3@example.com',
        studentId: 'z000003',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'This Unapproved Name'
      },
      {
        userId: 8,
        universityId: 2,
        name: 'Test Student Account 4',
        sex: 'M',
        email: 'teststudent4@example.com',
        studentId: 'z000004',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'Team Zeta'
      },
      {
        userId: 9,
        universityId: 2,
        name: 'Test Student Account 5',
        sex: 'M',
        email: 'teststudent5@example.com',
        studentId: 'z000005',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'Team Zeta'
      },
      {
        userId: 10,
        universityId: 2,
        name: 'Test Student Account 6',
        sex: 'M',
        email: 'teststudent6@example.com',
        studentId: 'z000006',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'Team Zeta'
      },
      {
        userId: 12,
        universityId: 2,
        name: 'Test Student Account 7',
        sex: 'M',
        email: 'teststudent7@example.com',
        studentId: 'z000007',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'P Team, U Name'
      },
      {
        userId: 13,
        universityId: 2,
        name: 'Test Student Account 8',
        sex: 'M',
        email: 'teststudent8@example.com',
        studentId: 'z000008',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'P Team, U Name'
      },
      {
        userId: 14,
        universityId: 2,
        name: 'Test Student Account 9',
        sex: 'M',
        email: 'teststudent9@example.com',
        studentId: 'z000009',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'P Team, U Name'
      }
    ])
  })
})