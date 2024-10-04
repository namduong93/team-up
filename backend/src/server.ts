import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { serverAddress } from '../config/serverAddressConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Pool } = pkg;
import { dbConfig } from '../config/dbConfig.js';
import { SqlDbUserRepository } from './repository/user/sqldb.js';
import { UserService } from './services/user_service.js';
import { UserController } from './controllers/user_controller.js';

const { HOST, PORT } = serverAddress;
const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev'));

const pool = new Pool({
  user: dbConfig.DB_USER,
  host: dbConfig.DB_HOST,
  database: dbConfig.DB_NAME,
  password: dbConfig.DB_PASSWORD,
  port: Number(dbConfig.DB_PORT),
  max: 10,
});

const userRepository = new SqlDbUserRepository(pool);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const currentDir = path.dirname(fileURLToPath(import.meta.url));
app.use('/images', express.static(path.join(currentDir, '../../public/images')));

app.get('/', async (req: Request, res: Response) => {
});


// PARAMS: { name, preferredName, password, email, tshirtSize, pronouns?,
// 	allergies?, accessibilityReqs?, universityId?, studentId? }
// RESPONSE: { id: Number }
app.post('/student/register', userController.studentRegister);


// This should return things that need to be displayed on the dash
// DEV: If you need this to return more things, you can just start assuming it does
// on the frontend and then tell the backend team which more things you need it to return
// PARAMS: --- NOTE: will require the sessionId cookie in browser DEV: assume it has the cookie
// RESPONSE: { preferredName: string }
app.get('/student/dash_info', userController.studentDashInfo);

// This is used when the staff registers with a code or once the staff has been approved by admin.
// DEV: For now it is ok to just call this straight away and we can implement the codes etc. later.
// PARAMS: { name, preferredName, password, email, tshirtSize, pronouns?,
// 	allergies?, accessibilityReqs?, universityId? }
// RESPONSE: { id: Number }
app.post('/staff/register', userController.staffRegister);

// This should return things that need to be displayed on the dash
// DEV: If you need this to return more things, you can just start assuming it does
// on the frontend and then tell the backend team which more things you need it to return
// PARAMS: {} --- NOTE: will require the sessionId cookie in browser DEV: assume it has the cookie
// RESPONSE: { preferredName: string }
app.get('/staff/dash_info', userController.staffDashInfo);

// PARAMS: { email, password }
// RESPONSE: {} --- NOTE: response will set sessionId cookie in the browser.
app.post('/user/login', userController.userLogin);

// Gets the type of user, 'staff', 'student' OR 'system_admin'
// PARAMS: {} --- NOTE: will require the sessionId cookie in browser DEV: assumie it has the cookie
// RESPONSE: { type: string }
app.get('/user/type', userController.userType);

// PARAMS: { name: string, earlyRegDeadline, generalRegDeadline,
//          siteLocations: Array<{ universityId: number, defaultSite: string }> }
// RESPONSE: { code: string }
app.post('/system_admin/competition/create', userController.systemAdminCompetitionCreate);

// DEV: If you need this to return more things, you can just start assuming it does
// on the frontend and then tell the backend team which more things you need it to return
// PARAMS: {} --- NOTE: will require the sessionId cookie in browser DEV: assume it has the cookie
// RESPONSE: { preferredName: string }
app.get('/system_admin/dash_info', userController.systemAdminDashInfo);

const server = app.listen(Number(PORT), HOST, () => {
  console.log(`Listening on port ${PORT} ✨`);
})

process.on('SIGINT', () => {
  server.close(() => console.log('server closing'));
})