import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import pool, { dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Student Function', () => {
  let user_db;
  beforeAll(async () => {
    user_db = new SqlDbCompetitionRepository(pool);
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Failure case: user does not have access to this list', async () => {
    const result = await user_db.competitionStudents(5, 1);
    expect(result).toStrictEqual([])
  })

  test('Sucess case 1: returns List of students participating in competition', async () => {
    const result = await user_db.competitionStudents(1, 1);
    expect(result).toStrictEqual([
      {
        userId: 5,
        universityId: 5,
        name: 'New User',
        sex: 'M',
        email: 'student@example.com',
        studentId: 'z000001',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'Charmander'
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
        teamName: 'Charmander'
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
        teamName: 'Charmander'
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
        teamName: 'Bulbasaur'
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
        teamName: 'Bulbasaur'
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
        teamName: 'Bulbasaur'
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
        teamName: 'Charmeleon'
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
        teamName: 'Charmeleon'
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
        tshirtSize: 'XL',
        siteName: 'Computer Science Building',
        teamName: 'Charmeleon'
      },
      {
        userId: 15,
        universityId: 5,
        name: 'AR',
        sex: 'M',
        email: 'ar@example.com',
        studentId: 'z000002',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Bulbasaur'
      },
      {
        userId: 15,
        universityId: 5,
        name: 'AR',
        sex: 'M',
        email: 'ar@example.com',
        studentId: 'z000002',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charizard'
      },
      {
        userId: 16,
        universityId: 5,
        name: 'AK',
        sex: 'M',
        email: 'ak@example.com',
        studentId: 'z000003',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Ivysaur'
      },
      {
        userId: 16,
        universityId: 5,
        name: 'AK',
        sex: 'M',
        email: 'ak@example.com',
        studentId: 'z000003',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charizard'
      },
      {
        userId: 17,
        universityId: 5,
        name: 'YF',
        sex: 'M',
        email: 'yf@example.com',
        studentId: 'z000004',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Ivysaur'
      },
      {
        userId: 17,
        universityId: 5,
        name: 'YF',
        sex: 'M',
        email: 'yf@example.com',
        studentId: 'z000004',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charizard'
      },
      {
        userId: 18,
        universityId: 5,
        name: 'DY',
        sex: 'M',
        email: 'dy@example.com',
        studentId: 'z000005',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Venusaur'
      },
      {
        userId: 18,
        universityId: 5,
        name: 'DY',
        sex: 'M',
        email: 'dy@example.com',
        studentId: 'z000005',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Snorlax'
      },
      {
        userId: 19,
        universityId: 5,
        name: 'Kass',
        sex: 'M',
        email: 'kass@example.com',
        studentId: 'z000006',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charmander'
      },
      {
        userId: 19,
        universityId: 5,
        name: 'Kass',
        sex: 'M',
        email: 'kass@example.com',
        studentId: 'z000006',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Snorlax'
      },
      {
        userId: 20,
        universityId: 5,
        name: 'JL',
        sex: 'M',
        email: 'jl@example.com',
        studentId: 'z000007',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charmander'
      },
      {
        userId: 20,
        universityId: 5,
        name: 'JL',
        sex: 'M',
        email: 'jl@example.com',
        studentId: 'z000007',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Snorlax'
      }
    ])
  })
  test('Sucess case 2: check if coaches also have access', async () => {
    const result = await user_db.competitionStudents(2, 1);
    expect(result).toStrictEqual([
      {
        userId: 5,
        universityId: 5,
        name: 'New User',
        sex: 'M',
        email: 'student@example.com',
        studentId: 'z000001',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'S',
        siteName: 'Computer Science Building',
        teamName: 'Charmander'
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
        teamName: 'Charmander'
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
        teamName: 'Charmander'
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
        teamName: 'Bulbasaur'
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
        teamName: 'Bulbasaur'
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
        teamName: 'Bulbasaur'
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
        teamName: 'Charmeleon'
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
        teamName: 'Charmeleon'
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
        tshirtSize: 'XL',
        siteName: 'Computer Science Building',
        teamName: 'Charmeleon'
      },
      {
        userId: 15,
        universityId: 5,
        name: 'AR',
        sex: 'M',
        email: 'ar@example.com',
        studentId: 'z000002',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Bulbasaur'
      },
      {
        userId: 15,
        universityId: 5,
        name: 'AR',
        sex: 'M',
        email: 'ar@example.com',
        studentId: 'z000002',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charizard'
      },
      {
        userId: 16,
        universityId: 5,
        name: 'AK',
        sex: 'M',
        email: 'ak@example.com',
        studentId: 'z000003',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Ivysaur'
      },
      {
        userId: 16,
        universityId: 5,
        name: 'AK',
        sex: 'M',
        email: 'ak@example.com',
        studentId: 'z000003',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charizard'
      },
      {
        userId: 17,
        universityId: 5,
        name: 'YF',
        sex: 'M',
        email: 'yf@example.com',
        studentId: 'z000004',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Ivysaur'
      },
      {
        userId: 17,
        universityId: 5,
        name: 'YF',
        sex: 'M',
        email: 'yf@example.com',
        studentId: 'z000004',
        status: 'Matched',
        level: 'Level A',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charizard'
      },
      {
        userId: 18,
        universityId: 5,
        name: 'DY',
        sex: 'M',
        email: 'dy@example.com',
        studentId: 'z000005',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Venusaur'
      },
      {
        userId: 18,
        universityId: 5,
        name: 'DY',
        sex: 'M',
        email: 'dy@example.com',
        studentId: 'z000005',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Snorlax'
      },
      {
        userId: 19,
        universityId: 5,
        name: 'Kass',
        sex: 'M',
        email: 'kass@example.com',
        studentId: 'z000006',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charmander'
      },
      {
        userId: 19,
        universityId: 5,
        name: 'Kass',
        sex: 'M',
        email: 'kass@example.com',
        studentId: 'z000006',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Snorlax'
      },
      {
        userId: 20,
        universityId: 5,
        name: 'JL',
        sex: 'M',
        email: 'jl@example.com',
        studentId: 'z000007',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Charmander'
      },
      {
        userId: 20,
        universityId: 5,
        name: 'JL',
        sex: 'M',
        email: 'jl@example.com',
        studentId: 'z000007',
        status: 'Matched',
        level: 'Level B',
        tshirtSize: 'L',
        siteName: 'Computer Science Building',
        teamName: 'Snorlax'
      }
    ])
  })
})