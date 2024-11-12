import { Student } from "../../../models/user/student/student";
import { SqlDbUniversityRepository } from "../../../repository/university/sqldb";
import { SqlDbUserRepository } from "../../../repository/user/sqldb"
import { UserIdObject } from "../../../repository/user_repository_type";
import pool, { dropTestDatabase } from "../Utils/dbUtils";


describe('Universe Courses Function', () => {
  let user_db;
  let uni_db;

  const mockUser: Student = {
    name: 'Maximillian Maverick',
    preferredName: 'X',
    email: 'UniversitySacrifice1@OwO.com',
    password: 'ezpass',
    gender: 'Male',
    pronouns: 'He/Him',
    tshirtSize: 'L',
    universityId: 5,
    studentId: 'z5381412'
  };

  let user: UserIdObject;

  beforeAll(async () => {
    user_db = new SqlDbUserRepository(pool);
    user = await user_db.studentRegister(mockUser);
    uni_db = new SqlDbUniversityRepository(pool)
  });

  afterAll(async () => {
    await dropTestDatabase(pool);
  });

  test('Sucess case: returns a list of courses', async () => {
    // console.log(await uni_db.universityCourses(user.userId))
    expect(await uni_db.universityCourses(user.userId)).toStrictEqual([
      {
        courseId: 1,
        courseName: 'COMP1511 Programming Fundamentals',
        category: 'Introduction'
      },
      {
        courseId: 2,
        courseName: 'COMP2521 Data Structures and Algorithms',
        category: 'Data Structures'
      },
      {
        courseId: 3,
        courseName: 'COMP3121 Algorithm Design or COMP 3821 Extended Algorithm Design',
        category: 'Algorithm Design'
      },
      {
        courseId: 4,
        courseName: 'COMP4128 Programming Challenges',
        category: 'Programming Challenges'
      }
    ]);
  })
})