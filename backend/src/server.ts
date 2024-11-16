import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { serverAddress } from '../config/serverAddressConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
import cookieParser from 'cookie-parser';
import { dbConfig } from '../config/dbConfig.js';
import { SqlDbUserRepository } from './repository/user/SqlDbUserRepository.js';
import { UserService } from './services/UserService.js';
import { UserController } from './controllers/UserController.js';
import { SqlDbCompetitionRepository } from './repository/competition/SqlDbCompetitionRepository.js';
import { CompetitionService } from './services/CompetitionService.js';
import { CompetitionController } from './controllers/CompetitionController.js';
import { Authenticator } from './middleware/authenticator.js';
import { UniversityService } from './services/UniversityService.js';
import { UniversityController } from './controllers/UniversityController.js';
import { SqlDbSessionRepository } from './repository/session/SqlDbSessionRepository.js';
import { SqlDbUniversityRepository } from './repository/university/SqlDbUniversityRepository.js';
import { NotificationController } from './controllers/NotificationController.js';
import { SqlDbNotificationRepository } from './repository/notification/SqlDbNotificationRepository.js';
import { NotificationService } from './services/NotificationService.js';
import { SqlDbCompetitionStudentRepository } from './repository/competition_student/SqlDbCompetitionStudentRepository.js';
import { CompetitionStudentService } from './services/CompetitionStudentService.js';
import { CompetitionStudentController } from './controllers/CompetitionStudentController.js';
import { SqlDbCompetitionStaffRepository } from './repository/competition_staff/SqlDbCompetitionStaffRepository.js';
import { CompetitionStaffService } from './services/CompetitionStaffService.js';
import { CompetitionStaffController } from './controllers/CompetitionStaffController.js';

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

const competitionStudentRepository = new SqlDbCompetitionStudentRepository(pool, competitionRepository);
const competitionStudentService = new CompetitionStudentService(
  competitionStudentRepository, competitionRepository, userRepository, notificationRepository
);
const competitionStudentController = new CompetitionStudentController(competitionStudentService);

const competitionStaffRepository = new SqlDbCompetitionStaffRepository(pool, competitionRepository);
const competitionStaffService = new CompetitionStaffService(competitionStaffRepository, competitionRepository, userRepository, notificationRepository);
const competitionStaffController = new CompetitionStaffController(competitionStaffService);


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

// Gets the list of all staff including staff that has requested in competition
// PARAMS: { userid }
// RESPONSE: { staff: Array<{id: number, name: string, email: string}>}
app.get('/user/staff_requests', userController.staffRequests);

// Approve every staff in the list
// PARAMS: { Array<StaffRequests> }
// RESPONSE: {}
app.post('/user/staff_requests', userController.staffRequestsUpdate);

// DEV: name of the site will appear as defaultSite on the FE. This is because the actual site object does not have a "default site" field,
// that is a field in university. In actuality, we are creating a new site based on the default site of the university specified in the FE.
// PARAMS: { name: string, earlyRegDeadline, generalRegDeadline, code, startDate, region,
//  siteLocations: Array<{ universityId: number, defaultSite: string }>, otherSiteLocations: Array<{ universityName: string, defaultSite: string } }
// RESPONSE: { competitionId: number }
app.post('/competition/system_admin/create', competitionStaffController.competitionsSystemAdminCreate);

// TODO: Add competition code and other site locations, but lets wait for FE design
// Update a competition's details
// TODO: Handle empty field cases (FE may prefill it, but if not we want to fill it with old info)
// PARAMS: { id: number, name?: string, teamSize?: number, earlyRegDeadline?: Date, generalRegDeadline?: Date,
//          siteLocations?: Array<{ universityId: number, name: string, startDate?, region? }> }
// RESPONSE: {}
app.put('/competition/system_admin/update', competitionStaffController.competitionSystemAdminUpdate)

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
app.post('/competition/student/join', competitionStudentController.competitionStudentJoin);

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
app.post('/competition/student/withdraw', competitionStudentController.competitionStudentWithdraw);

// Coach approves the team assignment (changing status from pending to unregistered)
// PARAMS: { compId: number, approveIds: Array<number> }
// RESPONSE: {}
app.put('/competition/coach/team_assignment_approve', competitionStaffController.competitionApproveTeamAssignment);

// Student requests to change the team name
// PARAMS: { compId: number, newTeamName: string }
// RESPONSE: {}
app.put('/competition/student/team_name_change', competitionStaffController.competitionRequestTeamNameChange);

// Coach approves the team name change (for many teams in one specific competition at once)
// PARAMS: { compId: number, approveIds: Array<number>, rejectIds: Array<number> }
// RESPONSE: {}
app.put('/competition/coach/team_name_approve', competitionStaffController.competitionApproveTeamNameChange);

// Student requests to change the team site
// PARAMS: { compId: number, newSiteId: number }
// RESPONSE: {}
app.put('/competition/student/site_change', competitionStudentController.competitionRequestSiteChange);

// Coach approves the team site change (for many teams in one specific competition at once)
// PARAMS: { compId: number, approveIds: Array<number>, rejectIds: Array<number> }
// RESPONSE: {}
app.put('/competition/coach/site_approve', competitionStaffController.competitionApproveSiteChange);

// Coach assigns seats to teams
// PARAMS: { compId: number, seatAssignments: Array<SeatAssignment> }
// RESPONSE: {}
app.put('/competition/staff/seat_assignments', competitionStaffController.competitionTeamSeatAssignments);

// Coach registers teams for competition
// PARAMS: { compId: number, teamIds: Array<number> }
// RESPONSE: {}
app.put('/competition/staff/register_teams', competitionStaffController.competitionRegisterTeams);

// PARAMS: { competitionId }
// RESPONSE: { universities: Array<{ id: number, name: string }> }
app.get('/competition/universities/list', competitionController.competitionUniversitiesList)

////////// Competition staff joining with a specific coach, site or admin code.

// PARAMS: { code, staffRegistrationData : { competitionRoles: Array<CompetitionUserRole>, siteLocation?: CompetitionSiteObject }, competitionBio?: string }
// RESPONSE: {} --- (still receives 200 OK or an error)
app.post('/competition/staff/join', competitionStaffController.competitionStaffJoin);

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
app.get('/competition/teams', competitionStaffController.competitionTeams)

// PARAMS: { compId: number }
// RESPONSE: { roles: Array<'participant' | 'coach' | 'admin' | 'site-coordinator'> }
app.get('/competition/roles', competitionController.competitionRoles);

// PARAMS: { compId: number }
// RESPONSE: { students: Array<{ name, sex, email, studentId, status, level, tshirtSize, siteName, teamName? }> }
// all the above are strings
app.get('/competition/students', competitionStaffController.competitionStudents);

// PARAMS: { compId: number }
// RESPONSE: { staffs: Array<StaffInfo> }
app.get('/competition/staff', competitionStaffController.competitionStaff);

// PARAMS: {}
// Get all notifications for a user
app.get('/user/notifications', notificationController.userNotificationsList);

// PARAMS: { notificationId }
// RESPONSE: {}
app.delete('/notification', notificationController.notificationRemove);

// PARAMS: { compId, seatAssignments: Array<SeatAssignment> }
// RESPONSE: {}
app.post('/notification/team_seat_assignments', notificationController.notificationTeamSeatAssignments);

// PARAMS: { compId }
// RESPONSE: 
// Get all the details of a team in a competition
app.get('/competition/team/details', competitionStudentController.competitionTeamDetails);

// PARAMS: { compId }
// RESPONSE:
// Get the invite code for a team in a competition
app.get('/competition/team/invite_code', competitionStudentController.competitionTeamInviteCode);

// PARAMS: { compId, code }
// RESPONSE: {}
// Join a team in a competition
app.post('/competition/team/join', competitionStudentController.competitionTeamJoin);

// Sort teams based on userId university
app.post('/competition/algorithm', competitionStaffController.competitionAlgorithm);

app.get('/competition/attendees', competitionStaffController.competitionAttendees);

// PARAMS: { compId }
// RESPONSE: 
// { studentDetails: StudentInfo }
// Get all the details of a student in a competition
app.get('/competition/student/details', competitionStudentController.competitionStudentDetails);

// PARAMS: { compId, studentInfo: StudentInfo }
// RESPONSE: { }
app.put('/competition/student/details', competitionStudentController.competitionStudentDetailsUpdate);


// PARAMS: { compId }
// RESPONSE: { staffDetails: StaffInfo }
app.get('/competition/staff/details', competitionStaffController.competitionStaffDetails);

// PARAMS: { compId, staffInfo: StaffInfo }
// RESPONSE: { }
app.put('/competition/staff/details', competitionStaffController.competitionStaffDetailsUpdate);

// PARAMS: { compId }
// RESPONSE: { sites: Array<CompetitionSite> }
app.get('/competition/sites', competitionController.competitionSites);

// PARAMS: { code }
// RESPONSE: { sites: Array<CompetitionSite> }
app.get('/competition/sites_code', competitionController.competitionSitesCodes);

// PARAMS: { compId }
// RESPONSE: { announcement: Announcement }
app.get('/competition/announcement', competitionController.competitionAnnouncement);

// PARAMS: { compId, announcementMessage: string }
// RESPONSE: {}
app.put('/competition/announcement', competitionStaffController.competitionAnnouncementUpdate);


app.get('/university/courses', universityController.universityCourses);

app.post('/competition/teams/update', competitionStaffController.competitionTeamsUpdate);

app.post('/competition/students/update', competitionStaffController.competitionStudentsUpdate);

app.post('/competition/staff/update', competitionStaffController.competitionStaffUpdate);

app.get('/competition/staff/rego_toggles', competitionStaffController.competitionStaffRegoToggles);

app.post('/competition/staff/update_rego_toggles', competitionStaffController.competitionStaffUpdateRegoToggles);

app.get('/competition/students/rego_toggles', competitionStudentController.competitionStudentsRegoToggles);

app.get('/competition/site/capacity', competitionStaffController.competitionSiteCapacity);

app.put('/competition/site/capacity/update', competitionStaffController.competitionSiteCapacityUpdate);

app.get('/competition/information', competitionStaffController.competitionInformation);

app.put('/competition/staff/update_courses', competitionStaffController.competitionStaffUpdateCourses);

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Listening on port ${PORT} ✨`);
})

process.on('SIGINT', () => {
  server.close(() => console.log('server closing'));
})