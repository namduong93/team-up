import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Student Details Function', () => {
  let poolean;

  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: user is not in this competition', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    await expect(user_db.competitionStudentDetails(5, 2)).rejects.toThrow('User does not exist or is not a participant in this competition.');
  })
  test('Failure case: user does not exist', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    await expect(user_db.competitionStudentDetails(200, 1)).rejects.toThrow('User does not exist or is not a participant in this competition.');
  })

  test('Sucess case: returns the users team details', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionStudentDetails(5, 1);
    expect(result).toStrictEqual(
      {
        name: 'New User',
        email: 'student@example.com',
        preferredContact: 'Email:example@email.com',
        codeforcesRating: 0,
        competitionBio: "epic bio",
        competitionLevel: "Level A",
        degree: "CompSci",
        degreeYear: 3,
        ICPCEligible: true,
        boersenEligible: true,
        isRemote: false,
        internationalPrizes: "",
        nationalPrizes: "",
        pastRegional: false,
        universityCourses: []
      },
    )
  })
})