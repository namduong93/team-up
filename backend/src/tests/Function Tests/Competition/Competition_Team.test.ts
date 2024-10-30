import { SqlDbCompetitionRepository } from "../../../repository/competition/sqldb";
import { createTestDatabase, dropTestDatabase } from "../Utils/dbUtils";

describe('Competition Teams Function', () => {
  let poolean;
  const testDbName = "capstone_db"

  beforeAll(async () => {
    poolean = await createTestDatabase(testDbName);
  });

  afterAll(async () => {
    await poolean.end();
    await dropTestDatabase(testDbName);
  });

  test('Failure case: User has no access to this list', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionTeams(5, 1);
    expect(result).toStrictEqual([])
  })

  test('Sucess case: returns a list of teams in competition', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionTeams(1, 1);
    expect(result).toStrictEqual([
      {
        teamId: 1,
        universityId: 2,
        status: 'Registered',
        teamNameApproved: true,
        compName: 'South Pacific Preliminary Contest 2024',
        teamName: 'Team Zeta',
        teamSite: 'Computer Science Building',
        teamSeat: 'Bongo11',
        teamLevel: 'Level B',
        startDate: new Date('2025-09-30 00:00:00'),
        students: [{
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent4@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 4",
          "preferredContact": "Minecraft:EpicMan123",
          "siteId": 2,
          "userId": 8,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent5@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 5",
          "preferredContact": "Roblox: epicerrMan123",
          "siteId": 2,
          "userId": 9,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent6@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 6",
          "preferredContact": "faxMachineNumber:98531234",
          "siteId": 2,
          "userId": 10,
        }],
        coach: { name: 'Coach 1', email: 'coach@example.com', bio: 'epic bio' }
      },
      {
        teamId: 2,
        universityId: 2,
        status: 'Pending',
        teamNameApproved: false,
        compName: 'South Pacific Preliminary Contest 2024',
        teamName: 'This Unapproved Name',
        teamSite: 'Computer Science Building',
        teamSeat: 'Tabla01',
        teamLevel: 'Level A',
        startDate: new Date('2025-09-30 00:00:00'),
        students: [{
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "student@example.com",
          "isRemote": false,
          "level": "Level A",
          "name": "Test Student Account 1",
          "preferredContact": "Email:example@email.com",
          "siteId": 2,
          "userId": 5,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent2@example.com",
          "isRemote": false,
          "level": "Level A",
          "name": "Test Student Account 2",
          "preferredContact": "Discord:fdc234",
          "siteId": 2,
          "userId": 6,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent3@example.com",
          "isRemote": false,
          "level": "Level A",
          "name": "Test Student Account 3",
          "preferredContact": "Phone:0413421311",
          "siteId": 2,
          "userId": 7,
        },],
        coach: { name: 'Coach 1', email: 'coach@example.com', bio: 'epic bio' }
      },
      {
        teamId: 3,
        universityId: 2,
        status: 'Pending',
        teamNameApproved: false,
        compName: 'South Pacific Preliminary Contest 2024',
        teamName: 'P Team, U Name',
        teamSite: 'Computer Science Building',
        teamSeat: 'Organ20',
        teamLevel: 'Level B',
        startDate: new Date('2025-09-30 00:00:00'),
        students: [{
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent7@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 7",
          "preferredContact": "faxMachineNumber:98531234",
          "siteId": 2,
          "userId": 12,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent8@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 8",
          "preferredContact": "Phone:0402067382",
          "siteId": 2,
          "userId": 13,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent9@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 9",
          "preferredContact": "Email:anotherexample@email.com",
          "siteId": 2,
          "userId": 14,
        },],
        coach: { name: 'Coach 1', email: 'coach@example.com', bio: 'epic bio' }
      }
    ])
  })

  test('Sucess case 2: Coaches has access to some list', async () => {
    const user_db = new SqlDbCompetitionRepository(poolean);
    const result = await user_db.competitionTeams(2, 1);
    expect(result).toStrictEqual([
      {
        teamId: 1,
        universityId: 2,
        status: 'Registered',
        teamNameApproved: true,
        compName: 'South Pacific Preliminary Contest 2024',
        teamName: 'Team Zeta',
        teamSite: 'Computer Science Building',
        teamSeat: 'Bongo11',
        teamLevel: 'Level B',
        startDate: new Date('2025-09-30 00:00:00'),
        students: [{
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent4@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 4",
          "preferredContact": "Minecraft:EpicMan123",
          "siteId": 2,
          "userId": 8,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent5@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 5",
          "preferredContact": "Roblox: epicerrMan123",
          "siteId": 2,
          "userId": 9,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent6@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 6",
          "preferredContact": "faxMachineNumber:98531234",
          "siteId": 2,
          "userId": 10,
        }],
        coach: { name: 'Coach 1', email: 'coach@example.com', bio: 'epic bio' }
      },
      {
        teamId: 2,
        universityId: 2,
        status: 'Pending',
        teamNameApproved: false,
        compName: 'South Pacific Preliminary Contest 2024',
        teamName: 'This Unapproved Name',
        teamSite: 'Computer Science Building',
        teamSeat: 'Tabla01',
        teamLevel: 'Level A',
        startDate: new Date('2025-09-30 00:00:00'),
        students: [{
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "student@example.com",
          "isRemote": false,
          "level": "Level A",
          "name": "Test Student Account 1",
          "preferredContact": "Email:example@email.com",
          "siteId": 2,
          "userId": 5,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent2@example.com",
          "isRemote": false,
          "level": "Level A",
          "name": "Test Student Account 2",
          "preferredContact": "Discord:fdc234",
          "siteId": 2,
          "userId": 6,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent3@example.com",
          "isRemote": false,
          "level": "Level A",
          "name": "Test Student Account 3",
          "preferredContact": "Phone:0413421311",
          "siteId": 2,
          "userId": 7,
        },],
        coach: { name: 'Coach 1', email: 'coach@example.com', bio: 'epic bio' }
      },
      {
        teamId: 3,
        universityId: 2,
        status: 'Pending',
        teamNameApproved: false,
        compName: 'South Pacific Preliminary Contest 2024',
        teamName: 'P Team, U Name',
        teamSite: 'Computer Science Building',
        teamSeat: 'Organ20',
        teamLevel: 'Level B',
        startDate: new Date('2025-09-30 00:00:00'),
        students: [{
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent7@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 7",
          "preferredContact": "faxMachineNumber:98531234",
          "siteId": 2,
          "userId": 12,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent8@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 8",
          "preferredContact": "Phone:0402067382",
          "siteId": 2,
          "userId": 13,
        },
        {
          "ICPCEligible": true,
          "bio": "epic bio",
          "boersenEligible": true,
          "email": "teststudent9@example.com",
          "isRemote": false,
          "level": "Level B",
          "name": "Test Student Account 9",
          "preferredContact": "Email:anotherexample@email.com",
          "siteId": 2,
          "userId": 14,
        },],
        coach: { name: 'Coach 1', email: 'coach@example.com', bio: 'epic bio' }
      }
    ])
  })
})