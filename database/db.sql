DROP DATABASE IF EXISTS capstone_db;
CREATE DATABASE capstone_db;

\c capstone_db;

-- sql schema goes here:

CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  
  name TEXT NOT NULL
);

CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  
  name TEXT NOT NULL, -- Full Name of course including any course codes
  
  university_id INT NOT NULL REFERENCES universities (id)
);

CREATE TYPE user_type_enum AS ENUM ('student', 'staff', 'system_admin');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  name TEXT NOT NULL,
  preferred_name TEXT,
  
  email VARCHAR(320) NOT NULL UNIQUE,

  hashed_password CHAR(60) NOT NULL,

  gender TEXT,
  pronouns TEXT,
  tshirt_size TEXT NOT NULL,

  allergies TEXT,
  dietary_reqs TEXT[],
  accessibility_reqs TEXT,

  user_type user_type_enum NOT NULL,
  

  university_id INT,

  -- student info
  student_id TEXT, --- NULL iff not a student

  -- staff info

  -- system admin info

  CHECK (
    ((user_type = 'student' AND student_id IS NOT NULL) OR
      (user_type in ('staff', 'system_admin') AND student_id IS NULL))
  )
);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,

  session_id CHAR(36) NOT NULL,
  
  -- Foreign Key id of the user that is logged in
  user_id INT NOT NULL REFERENCES users (id),

  -- The time the session was created
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,
  
  name TEXT NOT NULL,
  team_size INT NOT NULL,
  created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  early_reg_deadline TIMESTAMP NOT NULL,
  general_reg_deadline TIMESTAMP NOT NULL,
  start_date TIMESTAMP NOT NULL,
  code VARCHAR(8) NOT NULL,

  region TEXT NOT NULL
);

CREATE TABLE competition_sites (
  id SERIAL PRIMARY KEY,

  competition_id INT NOT NULL REFERENCES competitions (id),
  university_id INT NOT NULL REFERENCES universities (id),

  name TEXT NOT NULL,

  capacity INT,

  CONSTRAINT unique_site_competition UNIQUE (competition_id, name, university_id)
);

CREATE TYPE competition_role_enum AS ENUM ('Participant', 'Coach', 'Admin', 'Site-Coordinator');
CREATE TYPE competition_level_enum AS ENUM ('Level A', 'Level B', 'No Preference');
CREATE TYPE competition_access_enum AS ENUM ('Accepted', 'Pending', 'Rejected');

CREATE TABLE competition_users (
  id SERIAL PRIMARY KEY,

  user_id INT NOT NULL REFERENCES users (id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  competition_roles competition_role_enum[] NOT NULL,

  -- participant info
  icpc_eligible BOOLEAN,
  competition_level competition_level_enum DEFAULT 'Level B',
  boersen_eligible BOOLEAN,
  degree_year INT,
  degree TEXT,
  is_remote BOOLEAN,
  is_official BOOLEAN,

  preferred_contact TEXT,

  national_prizes TEXT,
  international_prizes TEXT,
  codeforces_rating INT,
  university_courses TEXT[],
  past_regional BOOLEAN,
  
  competition_coach_id INT REFERENCES competition_users (id),

  site_attending_id INT REFERENCES competition_sites (id),

  -- coach info

  -- admin info

  -- site-coordinator info
  site_id INT REFERENCES competition_sites (id),

  -- staff info
  access_level competition_access_enum,

  CONSTRAINT unique_competition_user UNIQUE (user_id, competition_id)
);

CREATE TYPE competition_team_status AS ENUM ('registered', 'unregistered', 'pending');

CREATE TABLE competition_teams (
  id SERIAL PRIMARY KEY,

  competition_coach_id INT REFERENCES competition_users (id),

  name TEXT NOT NULL,
  pending_name TEXT,

  team_status competition_team_status NOT NULL,
  team_size INT NOT NULL,

  participants INT[], --- array of user_id's
  
  university_id INT NOT NULL REFERENCES universities (id),
  competition_id INT NOT NULL REFERENCES competitions (id)
);

CREATE TYPE notification_type_enum AS ENUM (
  'welcomeAccount',
  'welcomeCompetition',
  'withdrawal',
  'name',
  'site',
  'deadline',
  'teamStatus',
  'cheer',
  'invite'
);

CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  
  user_id INT NOT NULL REFERENCES users (id),
  team_id INT REFERENCES competition_teams (id),
  competition_id INT REFERENCES competitions (id),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  
  team_name TEXT,
  student_name TEXT,
  competition_name TEXT,
  new_team_name TEXT,
  site_location TEXT
);

CREATE OR REPLACE FUNCTION competition_list(u_id INT)
RETURNS TABLE(id INT, name TEXT, created_date TIMESTAMP, early_reg_deadline TIMESTAMP, general_reg_deadline TIMESTAMP)
AS $$
  SELECT c.id AS id, c.name AS name, created_date, early_reg_deadline, general_reg_deadline
  FROM competition_users as cu
  JOIN competitions AS c ON c.id = cu.competition_id
  WHERE cu.user_id = u_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION competition_coach_team_list(u_id INT, c_id INT)
RETURNS TABLE(
  team_id INT, university_id INT,
  team_name TEXT, member1 JSON, member2 JSON, member3 JSON,
  status competition_team_status, team_name_approved BOOLEAN)
AS $$
  SELECT
    ct.id AS team_id,
    u.university_id AS university_id,
    (CASE WHEN ct.pending_name IS NULL THEN ct.name ELSE ct.pending_name END) AS team_name,
    JSON_BUILD_ARRAY(
      u1.name,
      cu1.site_attending_id,
      cu1.icpc_eligible,
      cu1.competition_level,
      cu1.boersen_eligible,
      cu1.is_remote) AS member1,
    
    JSON_BUILD_ARRAY(
      u2.name,
      cu2.site_attending_id,
      cu2.icpc_eligible,
      cu2.competition_level,
      cu2.boersen_eligible,
      cu2.is_remote) AS member2,
    
    JSON_BUILD_ARRAY(
      u3.name,
      cu3.site_attending_id,
      cu3.icpc_eligible,
      cu3.competition_level,
      cu3.boersen_eligible,
      cu3.is_remote) AS member3,
    ct.team_status AS status,
    (ct.pending_name IS NULL) AS team_name_approved
  FROM competition_teams AS ct
  LEFT JOIN users AS u1 ON u1.id = ct.participants[1]
  LEFT JOIN competition_users cu1 ON cu1.user_id = u1.id
  LEFT JOIN users AS u2 ON u2.id = ct.participants[2]
  LEFT JOIN competition_users cu2 ON cu2.user_id = u2.id
  LEFT JOIN users AS u3 ON u3.id = ct.participants[3]
  LEFT JOIN competition_users cu3 ON cu3.user_id = u3.id

  JOIN competition_users AS cu ON cu.id = ct.competition_coach_id
  JOIN users AS u ON u.id = cu.user_id
  WHERE u.id = u_id AND ct.competition_id = c_id;
$$ LANGUAGE sql;


CREATE OR REPLACE FUNCTION competition_admin_team_list(c_id INT)
RETURNS TABLE(
  team_id INT, university_id INT,
  team_name TEXT, member1 JSON, member2 JSON, member3 JSON,
  status competition_team_status, team_name_approved BOOLEAN)
AS $$
  SELECT
    ct.id AS team_id,
    u1.university_id AS university_id,
    (CASE WHEN ct.pending_name IS NULL THEN ct.name ELSE ct.pending_name END) AS team_name,
    JSON_BUILD_ARRAY(
      u1.name,
      cu1.site_attending_id,
      cu1.icpc_eligible,
      cu1.competition_level,
      cu1.boersen_eligible,
      cu1.is_remote) AS member1,
    
    JSON_BUILD_ARRAY(
      u2.name,
      cu2.site_attending_id,
      cu2.icpc_eligible,
      cu2.competition_level,
      cu2.boersen_eligible,
      cu2.is_remote) AS member2,
    
    JSON_BUILD_ARRAY(
      u3.name,
      cu3.site_attending_id,
      cu3.icpc_eligible,
      cu3.competition_level,
      cu3.boersen_eligible,
      cu3.is_remote) AS member3,
    ct.team_status AS status,
    (ct.pending_name IS NULL) AS team_name_approved
  FROM competition_teams AS ct
  LEFT JOIN users AS u1 ON u1.id = ct.participants[1]
  LEFT JOIN competition_users cu1 ON cu1.user_id = u1.id
  LEFT JOIN users AS u2 ON u2.id = ct.participants[2]
  LEFT JOIN competition_users cu2 ON cu2.user_id = u2.id
  LEFT JOIN users AS u3 ON u3.id = ct.participants[3]
  LEFT JOIN competition_users cu3 ON cu3.user_id = u3.id
  WHERE ct.competition_id = c_id;
$$ LANGUAGE sql;

CREATE OR REPLACE VIEW user_profile_info AS
SELECT u.id AS id, u.name, preferred_name, email, uni.name AS affiliation, gender,
      pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs
FROM users AS u
JOIN universities AS uni ON uni.id = u.university_id;

CREATE OR REPLACE VIEW user_dash_info AS
SELECT u.id AS id, 
      COALESCE(u.preferred_name, u.name) AS preferred_name, 
      uni.name AS affiliation
FROM users AS u
JOIN universities AS uni ON uni.id = u.university_id;

CREATE OR REPLACE FUNCTION competition_coach_students(u_id INT, c_id INT)
RETURNS TABLE(
  "userId" INT, "universityId" INT, name TEXT, sex TEXT, email TEXT, "studentId" TEXT,
  status TEXT, level TEXT, "tshirtSize" TEXT, "siteName" TEXT, "teamName" TEXT)
AS $$
  SELECT
    u.id AS "userId", u.university_id AS "universityId", u.name,
    u.gender AS sex, u.email, u.student_id AS "studentId", 'Matched' AS status,
    cu.competition_level AS level, u.tshirt_size AS "tshirtSize", cs.name AS "siteName",
    (CASE WHEN ct.pending_name IS NULL THEN ct.name ELSE ct.pending_name END) AS "teamName"
  FROM competition_users AS cu_coach
  JOIN users AS u_coach ON cu_coach.user_id = u_coach.id
  JOIN competition_users AS cu ON cu.competition_coach_id = cu_coach.id
  JOIN users AS u ON u.id = cu.user_id
  JOIN competition_sites AS cs ON cs.id = cu.site_attending_id
  JOIN competition_teams AS ct ON (ct.participants[1] = u.id OR ct.participants[2] = u.id OR ct.participants[3] = u.id)
  WHERE cu.competition_id = c_id AND cu_coach.user_id = u_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION competition_admin_students(c_id INT)
RETURNS TABLE(
  "userId" INT, "universityId" INT, name TEXT, sex TEXT, email TEXT, "studentId" TEXT,
  status TEXT, level TEXT, "tshirtSize" TEXT, "siteName" TEXT, "teamName" TEXT)
AS $$
  SELECT
    u.id AS "userId", u.university_id AS "universityId", u.name,
    u.gender AS sex, u.email, u.student_id AS "studentId", 'Matched' AS status,
    cu.competition_level AS level, u.tshirt_size AS "tshirtSize", cs.name AS "siteName",
    (CASE WHEN ct.pending_name IS NULL THEN ct.name ELSE ct.pending_name END) AS "teamName"
  FROM competition_users AS cu
  JOIN users AS u ON u.id = cu.user_id
  JOIN competition_sites AS cs ON cs.id = cu.site_attending_id
  JOIN competition_teams AS ct ON (ct.participants[1] = u.id OR ct.participants[2] = u.id OR ct.participants[3] = u.id)
  WHERE cu.competition_id = c_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION competition_staff(c_id INT)
RETURNS TABLE(
  "userId" INT, "name" TEXT, "roles" JSON,
  "universityName" TEXT, "access" competition_access_enum, email TEXT )
AS $$
  SELECT
    u.id AS "userId", u.name AS "name", TO_JSON(cu.competition_roles) AS "roles",
    uni.name AS "universityName", cu.access_level AS "access", u.email AS "email"
  FROM competition_users AS cu
  JOIN users AS u ON cu.user_id = u.id
  JOIN universities AS uni ON uni.id = u.university_id
  WHERE cu.competition_id = c_id AND cu.competition_roles <> ARRAY['Participant']::competition_role_enum[];
$$ LANGUAGE sql;

INSERT INTO universities (name) 
VALUES 
('University of Melbourne'),
('Monash University'),
('RMIT University'),
('University of Sydney'),
('University of New South Wales');


INSERT INTO users (
  name,
  preferred_name,
  email,
  hashed_password,
  gender,
  pronouns,
  tshirt_size,
  allergies,
  dietary_reqs,
  accessibility_reqs,
  user_type,
  university_id,
  student_id)
VALUES
( -- id: 1
  'System Admin',
  'Admin',
  'admin@example.com',
  '$2a$10$xeAb1BWjYheI6OIcv07RJOmFRvQtV0cTnbrmt2thWO.RWL7OwEbhO',
  'M',
  'he/him',
  'L',
  'Peanuts',
  '{}',
  'None',
  'system_admin',
  1,
  NULL), -- password is 'admin'
( -- id: 2
  'Coach 1',
  'Coach One',
  'coach@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'XL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  2,
  NULL), -- password is 'pleasechange'
( -- id: 3
  'Coach 2',
  'Coach Two',
  'testcoach2@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'XL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  3,
  NULL), -- password is 'pleasechange'
( -- id: 4
  'Site Coordinator 1',
  'Site Coord One',
  'testsitecoor1@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'XL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  2,
  NULL), -- password is 'pleasechange'
( -- id: 5
  'Test Student Account 1',
  'Test Account',
  'student@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000001'),
( -- id: 6
  'Test Student Account 2',
  'Test Account',
  'teststudent2@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000002'),
( -- id: 7
  'Test Student Account 3',
  'Test Account',
  'teststudent3@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000003'),
( -- id: 8
  'Test Student Account 4',
  'Test Account',
  'teststudent4@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000004'),
( -- id: 9
  'Test Student Account 5',
  'Test Account',
  'teststudent5@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000005'),
( -- id: 10
  'Test Student Account 6',
  'Test Account',
  'teststudent6@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000006'),
  ( -- id: 11
  'Coach 3',
  'Coach Three',
  'testcoach3@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'XL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  3,
  NULL), -- password is 'pleasechange'
  ( -- id: 12
  'Test Student Account 7',
  'Test Account',
  'teststudent7@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000007'),
( -- id: 13
  'Test Student Account 8',
  'Test Account',
  'teststudent8@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000008'),
( -- id: 14
  'Test Student Account 9',
  'Test Account',
  'teststudent9@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000009'); --- password is pleasechange

-- Competitions
INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region)
VALUES 
('South Pacific Preliminary Contest 2024', 3, '2024-06-30 00:00:00', '2024-08-29 00:00:00', '2024-08-31 00:00:00', 'SPPR2024', '2024-09-30 00:00:00', 'Australia'),
('South Pacific Regional Contest 2024', 3, '2024-08-31 00:00:00', '2024-10-20 00:00:00', '2024-10-20 00:00:00', 'SPRG2024', '2024-09-30 00:00:00', 'Australia'),
('ICPC World Final', 3, '2024-10-10 00:00:00', '2025-09-10 00:00:00', '2025-09-11 00:00:00', 'WF2025', '2024-09-30 00:00:00', 'Earth');

-- Competition Sites
INSERT INTO competition_sites (competition_id, university_id, name, capacity)
VALUES 
(1, 1, 'Library', 100),
(2, 2, 'Computer Science Building', 150),
(3, 5, 'K7', 300);

-- Competition Admin(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level)
VALUES
(1, 1, ARRAY['Admin']::competition_role_enum[], 'Accepted'),
(1, 2, ARRAY['Admin']::competition_role_enum[], 'Accepted'),
(1, 3, ARRAY['Admin']::competition_role_enum[], 'Accepted');

-- Competition Coach(es)
INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level)
VALUES
(2, 1, ARRAY['Coach']::competition_role_enum[], 'Accepted'),
(2, 2, ARRAY['Coach']::competition_role_enum[], 'Accepted'),
(2, 3, ARRAY['Coach']::competition_role_enum[], 'Accepted');

-- Competition Site Coordinator(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id, access_level)
VALUES
(4, 1, ARRAY['Site-Coordinator']::competition_role_enum[], 1, 'Accepted');


-- Competition Participants
INSERT INTO competition_users (
  user_id, competition_id, competition_roles,
  competition_coach_id,
  icpc_eligible,
  competition_level,
  boersen_eligible,
  degree_year,
  degree,
  is_remote,
  national_prizes,
  international_prizes,
  codeforces_rating,
  university_courses,
  site_attending_id,
  past_regional,
  is_official,
  preferred_contact
)
VALUES
    (5, 1, ARRAY['Participant']::competition_role_enum[], 4,  TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, FALSE, 'Email example@email.com'),
    (6, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, FALSE, 'Discord fdc234'),
    (7, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, FALSE, 'Phone 0413421311'),
    (8, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, TRUE, 'Minecraft Account: EpicMan123'),
    (9, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, TRUE, 'Roblox Account: epicerrMan123'),
    (10, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, TRUE, 'fax machine number 98531234'),
    (12, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, TRUE, 'fax machine number 98531234'),
    (13, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, TRUE, 'fax number'),
    (14, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE, TRUE, 'fax 1332');
  

-- Non-access coaches
INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id, access_level)
VALUES
(3, 1, ARRAY['Coach']::competition_role_enum[], 1, 'Pending'),
(11, 1, ARRAY['Coach']::competition_role_enum[], 1, 'Rejected');

INSERT INTO competition_teams (
  competition_coach_id, name, team_status, pending_name, team_size, participants, university_id, competition_id
)
VALUES
(2, 'Team Zeta', 'registered'::competition_team_status, NULL, 3, ARRAY[8, 9, 10], 2, 1),
(2, 'Team Alpha', 'pending'::competition_team_status, 'This Unapproved Name', 3, ARRAY[5, 6, 7], 2, 1),
(2, 'Team Donkey', 'pending'::competition_team_status, 'P Team, U Name', 3, ARRAY[12, 13, 14], 2, 1);

-- Notifications
INSERT INTO notifications (
  user_id, team_id, competition_id, type, message, created_at,
  team_name, student_name, competition_name, new_team_name, site_location
)
VALUES 
(
  5, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  5, NULL, NULL, ARRAY['welcomeAccount']::notification_type_enum[], 'Welcome to TeamUP!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  6, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  7, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  8, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  9, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  10, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NOW(),
  NULL, NULL, NULL, NULL, NULL
);
