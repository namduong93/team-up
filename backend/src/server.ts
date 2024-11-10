import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { serverAddress } from '../config/serverAddressConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import cookieParser from 'cookie-parser';
import { dbConfig } from '../config/dbConfig.js';
import { SqlDbUserRepository } from './repository/user/sqldb.js';
import { UserService } from './services/user_service.js';
import { UserController } from './controllers/user_controller.js';
import { SqlDbCompetitionRepository } from './repository/competition/sqldb.js';
import { CompetitionService } from './services/competition_service.js';
import { CompetitionController } from './controllers/competition_controller.js';
import { Authenticator } from './middleware/authenticator.js';
import { UniversityService } from './services/university_service.js';
import { UniversityController } from './controllers/university_controller.js';
import { SqlDbSessionRepository } from './repository/session/sqldb.js';
import { SqlDbUniversityRepository } from './repository/university/sqldb.js';
import { NotificationController } from './controllers/notification_controller.js';
import { SqlDbNotificationRepository } from './repository/notification/sqldb.js';
import { NotificationService } from './services/notification_service.js';

const { HOST, PORT } = serverAddress;
const app = express();
app.use(morgan('dev'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(json());

const { Pool } = pkg;
const pool = new Pool({
  user: dbConfig.DB_USER,
  host: dbConfig.DB_HOST,
  database: dbConfig.DB_NAME,
  password: dbConfig.DB_PASSWORD,
  port: Number(dbConfig.DB_PORT),
  max: 10,
});

//Middleware to authenticate request
const authenticator = new Authenticator();

// User Registry
const sessionRepository = new SqlDbSessionRepository(pool);
app.use(authenticator.authenticationMiddleware(sessionRepository));
// use authenticator middleware with the sessionRepository for getting session id

const userRepository = new SqlDbUserRepository(pool);
const userService = new UserService(userRepository, sessionRepository);
const userController = new UserController(userService);

// Notification Registry
const notificationRepository = new SqlDbNotificationRepository(pool);
const notificationService = new NotificationService(notificationRepository, userRepository);
const notificationController = new NotificationController(notificationService);

// Competition Registry
const competitionRepository = new SqlDbCompetitionRepository(pool);
const competitionService = new CompetitionService(competitionRepository, userRepository, notificationRepository);
const competitionController = new CompetitionController(competitionService);

// University Registry
const universityRepository = new SqlDbUniversityRepository(pool);
const universityService = new UniversityService(universityRepository);
const universityController = new UniversityController(universityService);

const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use('/images', express.static(path.join(currentDir, '../../public/images')));

app.get('/', async (req: Request, res: Response) => {
  res.json("Health check");
});


// PARAMS: { name, preferredName, email, password, gender, pronouns?, tshirtSize,
// 	allergies?, dietaryReqs, accessibilityReqs?, universityId?, studentId? }
// RESPONSE: { }
app.post('/student/register', userController.studentRegister);

// This is used when the staff registers with a code or once the staff has been approved by admin.
// DEV: For now it is ok to just call this straight away and we can implement the codes etc. later.
// PARAMS: { name, preferredName, email, password, tshirtSize, pronouns?,
// 	allergies?, accessibilityReqs?, universityId?}
// RESPONSE: { }
app.post('/staff/register', userController.staffRegister);

// PARAMS: { email, password }
// RESPONSE: {} --- NOTE: response will set sessionId cookie in the browser.
app.post('/user/login', userController.userLogin);

// PARAMS: { }
// RESPONSE: {} --- NOTE: will require the sessionId cookie in browser. response will clear the sessionId cookie in the browser.
app.post('/user/logout', userController.userLogout);

// PARAMS: {}
// RESPONSE: { name, preferredName, email, affiliation, gender, pronouns, tshirtSize, allergies, dietaryReqs, accessibilityReqs}
app.get('/user/profile_info', userController.userProfileInfo);

// PARAMS: { name, preferredName, email, affiliation, gender, pronouns, tshirtSize, allergies, dietaryReqs, accessibilityReqs }
// RESPONSE: {}
app.put('/user/profile_info', userController.userUpdateProfile);

app.put('/user/password', userController.userUpdatePassword);

// This should return things that need to be displayed on the dash
// DEV: If you need this to return more things, you can just start assuming it does
// on the frontend and then tell the backend team which more things you need it to return
// PARAMS: --- NOTE: will require the sessionToken cookie in browser DEV: assume it has the cookie
// RESPONSE: { preferredName: string, affiliation: string }
app.get('/user/dash_info', userController.userDashInfo);

// Gets the type of user, 'staff', 'student' OR 'system_admin' OR 'staff'
// PARAMS: {} --- NOTE: will require the sessionToken cookie in browser DEV: assumie it has the cookie
// RESPONSE: { type: string }
app.get('/user/type', userController.userType);

// DEV: name of the site will appear as defaultSite on the FE. This is because the actual site object does not have a "default site" field,
// that is a field in university. In actuality, we are creating a new site based on the default site of the university specified in the FE.
// PARAMS: { name: string, earlyRegDeadline, generalRegDeadline, code, startDate, region,
//  siteLocations: Array<{ universityId: number, defaultSite: string }>, otherSiteLocations: Array<{ universityName: string, defaultSite: string } }
// RESPONSE: { competitionId: number }
app.post('/competition/system_admin/create', competitionController.competitionsSystemAdminCreate);

// TODO: Add competition code and other site locations, but lets wait for FE design
// Update a competition's details
// TODO: Handle empty field cases (FE may prefill it, but if not we want to fill it with old info)
// PARAMS: { id: number, name?: string, teamSize?: number, earlyRegDeadline?: Date, generalRegDeadline?: Date,
//          siteLocations?: Array<{ universityId: number, name: string, startDate?, region? }> }
// RESPONSE: {}
app.put('/competition/system_admin/update', competitionController.competitionSystemAdminUpdate)

// Get a competition's details
// PARAMS: { compId: number }
// RESPONSE: { competition: CompetitionDetails}
app.get('/competition/details', competitionController.competitionGetDetails)

// Throw status codes for when getting the competition code fails
// PARAMS: { code: string }
app.get('/competition/student/status', competitionController.competitionCodeStatus);

// PARAMS: { code: string }
// RESPONSE: { siteLocation: {id, name} }
app.get('/competition/user/default_site', competitionController.competitionUserDefaultSite);

// Student join competition with 0 friends
// PARAMS: { code, competitionUser: { ICPCEligible, competitionLevel, boersenEligible, degreeYear, degree, isRemote, nationalPrizes, international_prizes, codeforces_rating, university_courses, competitionBio, preferredContact } }
// --- NOTE: will require the sessionToken cookie in browser DEV: assume it has the cookie
// RESPONSE: { }
app.post('/competition/student/join', competitionController.competitionStudentJoin);

// Student join competition with 1 friend
// PARAMS: { code, individualInfo: { ICPCEligible, competitionLevel, boersenEligible, degreeYear, degree, isRemote },
//          teamMate1: { teamMateEmail, teamMateName, teamMateICPCEmail, teamMateDegreeYear, teamMateDegree }
// --- NOTE: will require the sessionToken cookie in browser DEV: assume it has the cookie
// RESPONSE: { incompleteTeamId }
app.post('/competition/student/join/1', competitionController.competitionStudentJoin1);

// Student join competition with 2 friends
// PARAMS: { code, teamInfo: { teamName, competitionLevel, ICPCEligible, boersenEligible, isRemote }
//          teamMate1: { teamMateEmail, teamMateName, teamMateICPCEmail, teamMateDegreeYear, teamMateDegree },
// 	        teamMate2: { teamMateEmail, teamMateName, teamMateICPCEmail, teamMateDegreeYear, teamMateDegree } }
// --- NOTE: will require the sessionToken cookie in browser DEV: assume it has the cookie
// RESPONSE: { teamId }
app.post('/competition/student/join/2', competitionController.competitionStudentJoin2);

// Student withdraws from competition
// PARAMS: { compId: number }
// RESPONSE: { competitionCode: string }
app.post('/competition/student/withdraw', competitionController.competitionStudentWithdraw);

// Coach approves the team assignment (changing status from pending to unregistered)
// PARAMS: { compId: number, approveIds: Array<number> }
// RESPONSE: {}
app.put('/competition/coach/team_assignment_approve', competitionController.competitionApproveTeamAssignment);

// Student requests to change the team name
// PARAMS: { compId: number, newTeamName: string }
// RESPONSE: {}
app.put('/competition/student/team_name_change', competitionController.competitionRequestTeamNameChange);

// Coach approves the team name change (for many teams in one specific competition at once)
// PARAMS: { compId: number, approveIds: Array<number>, rejectIds: Array<number> }
// RESPONSE: {}
app.put('/competition/coach/team_name_approve', competitionController.competitionApproveTeamNameChange);

// Student requests to change the team site
// PARAMS: { compId: number, newSiteId: number }
// RESPONSE: {}
app.put('/competition/student/site_change', competitionController.competitionRequestSiteChange);

// Coach approves the team site change (for many teams in one specific competition at once)
// PARAMS: { compId: number, approveIds: Array<number>, rejectIds: Array<number> }
// RESPONSE: {}
app.put('/competition/coach/site_approve', competitionController.competitionApproveSiteChange);

// Coach assigns seats to teams
// PARAMS: { compId: number, seatAssignments: Array<SeatAssignment> }
// RESPONSE: {}
app.put('/competition/staff/seat_assignments', competitionController.competitionTeamSeatAssignments);

// Coach registers teams for competition
// PARAMS: { compId: number, teamIds: Array<number> }
// RESPONSE: {}
app.put('/competition/staff/register_teams', competitionController.competitionRegisterTeams);

// PARAMS: { competitionId }
// RESPONSE: { universities: Array<{ id: number, name: string }> }
app.get('/competition/universities/list', competitionController.competitionUniversitiesList)

////////// Competition staff joining with a specific coach, site or admin code.

// PARAMS: { code, staffRegistrationData : { competitionRoles: Array<CompetitionUserRole>, siteLocation?: CompetitionSiteObject }, competitionBio?: string }
// RESPONSE: {} --- (still receives 200 OK or an error)
app.post('/competition/staff/join', competitionController.competitionStaffJoin);

// PARAMS: {}
// RESPONSW: {universities: Array<{id: number, name: string}>}
// TODO: Add it into middleware
app.get('/universities/list', universityController.universitiesList);

// Gets all competitions that this user is a part of
// PARAMS: {} --- NOTE: will require the sessionToken cookie in browser DEV: assumie it has the cookie
// RESPONSE: { competitions: Competition[] }
app.get('/competitions/list', competitionController.competitionsList);

// PARAMS: { email: string }
// RESPONSE: {} --- NOTE: emails them a 6 character code e.g '123456'
app.post('/user/password_recovery/generate_code', userController.userPasswordRecoveryGenerateCode);

// PARAMS: { code: string }
// RESPONSE: {} --- NOTE: No error if successful, error if not successful
app.post('/user/password_recovery/input_code', userController.userPasswordRecoveryInputCode);

// PARAMS: { compId: number }
// RESPONSE: { unknown }
app.get('/competition/teams', competitionController.competitionTeams)

// PARAMS: { compId: number }
// RESPONSE: { roles: Array<'participant' | 'coach' | 'admin' | 'site-coordinator'> }
app.get('/competition/roles', competitionController.competitionRoles);

// PARAMS: { compId: number }
// RESPONSE: { students: Array<{ name, sex, email, studentId, status, level, tshirtSize, siteName, teamName? }> }
// all the above are strings
app.get('/competition/students', competitionController.competitionStudents);

app.get('/competition/staff', competitionController.competitionStaff);

// PARAMS: {}
// Get all notifications for a user
app.get('/user/notifications', notificationController.userNotificationsList);

// PARAMS: { notificationId }
// RESPONSE: {}
app.delete('/notification', notificationController.notificationRemove);

// PARAMS: { compId }
// RESPONSE: 
// Get all the details of a team in a competition
app.get('/competition/team/details', competitionController.competitionTeamDetails);

// PARAMS: { compId }
// RESPONSE:
// Get the invite code for a team in a competition
app.get('/competition/team/invite_code', competitionController.competitionTeamInviteCode);

// PARAMS: { compId, code }
// RESPONSE: {}
// Join a team in a competition
app.post('/competition/team/join', competitionController.competitionTeamJoin);

// Sort teams based on userId university
app.post('/competition/algorithm', competitionController.competitionAlgorithm);

app.get('/competition/attendees', competitionController.competitionAttendees);
// PARAMS: { compId }
// RESPONSE: 
// { studentDetails: {...} }
// Get all the details of a student in a competition
app.get('/competition/student/details', competitionController.competitionStudentDetails);

// PARAMS: { compId }
// RESPONSE: { sites: Array<CompetitionSite> }
app.get('/competition/sites', competitionController.competitionSites);

// PARAMS: { code }
// RESPONSE: { sites: Array<CompetitionSite> }
app.get('/competition/sites_code', competitionController.competitionSitesCodes);

app.get('/university/courses', universityController.universityCourses);

app.post('/competition/teams/update', competitionController.competitionTeamsUpdate);

app.post('/competition/students/update', competitionController.competitionStudentsUpdate);

app.post('/competition/staff/update', competitionController.competitionStaffUpdate);

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Listening on port ${PORT} ✨`);
})

process.on('SIGINT', () => {
  server.close(() => console.log('server closing'));
})