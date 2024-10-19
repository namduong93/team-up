DROP DATABASE IF EXISTS capstone_db;
CREATE DATABASE capstone_db;

\c capstone_db;

-- sql schema goes here:

CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  
  name TEXT NOT NULL
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
  code VARCHAR(8) NOT NULL

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

CREATE TABLE competition_users (
  id SERIAL PRIMARY KEY,

  user_id INT NOT NULL REFERENCES users (id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  competition_roles competition_role_enum[] NOT NULL,

  -- participant info
  icpc_eligible BOOLEAN,
  competition_level competition_level_enum,
  boersen_eligible BOOLEAN,
  degree_year INT,
  degree TEXT,
  is_remote BOOLEAN,

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

  CONSTRAINT unique_competition_user UNIQUE (user_id, competition_id)
);

CREATE TYPE competition_team_status AS ENUM ('registered', 'unregistered', 'pending');

CREATE TABLE competition_teams (
  id SERIAL PRIMARY KEY,

  competition_coach_id INT REFERENCES competition_users (id),

  name TEXT NOT NULL,

  team_status competition_team_status NOT NULL,
  team_name_approved BOOLEAN NOT NULL,
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
  decision TEXT,
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

CREATE OR REPLACE FUNCTION competition_team_list(u_id INT, c_id INT)
RETURNS TABLE(
  team_name TEXT, member_name1 TEXT, member_name2 TEXT, member_name3 TEXT,
  status competition_team_status, team_name_approved BOOLEAN)
AS $$
  SELECT ct.name AS team_name, 
    (SELECT u.name FROM users AS u WHERE u.id = ct.participants[1]) AS member_name1,
    (SELECT u.name FROM users AS u WHERE u.id = ct.participants[2]) AS member_name2,
    (SELECT u.name FROM users AS u WHERE u.id = ct.participants[3]) AS member_name3,
    ct.team_status AS status,
    ct.team_name_approved AS team_name_approved
  FROM competition_teams AS ct
  JOIN competition_users AS cu ON cu.id = ct.competition_coach_id
  JOIN users AS u ON u.id = cu.user_id
  WHERE u.id = u_id AND ct.competition_id = c_id;
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
  name TEXT, sex TEXT, email TEXT, "studentId" TEXT,
  status TEXT, level TEXT, "tshirtSize" TEXT, "siteName" TEXT, "teamName" TEXT)
AS $$
  SELECT u.name, u.gender AS sex, u.email, u.student_id AS "studentId", 'Matched' AS status,
      cu.competition_level AS level, u.tshirt_size AS "tshirtSize", cs.name AS "siteName", ct.name AS "teamName"
      FROM competition_users AS cu_coach
      JOIN users AS u_coach ON cu_coach.user_id = u_coach.id
      JOIN competition_users AS cu ON cu.competition_coach_id = cu_coach.id
      JOIN users AS u ON u.id = cu.user_id
      JOIN competition_sites AS cs ON cs.id = cu.site_attending_id
      JOIN competition_teams AS ct ON (ct.participants[1] = u.id OR ct.participants[2] = u.id OR ct.participants[3] = u.id)
      WHERE cu.competition_id = c_id AND cu_coach.user_id = u_id;
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
  'z000006');

-- Competitions
INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code)
VALUES 
('South Pacific Preliminary Contest 2024', 3, '2024-06-30 00:00:00', '2024-08-29 00:00:00', '2024-08-31 00:00:00', 'SPPR2024'),
('South Pacific Regional Contest 2024', 3, '2024-08-31 00:00:00', '2024-10-20 00:00:00', '2024-10-20 00:00:00', 'SPRG2024'),
('ICPC World Final', 3, '2024-10-10 00:00:00', '2025-09-10 00:00:00', '2025-09-11 00:00:00', 'WF2025');

-- Competition Sites
INSERT INTO competition_sites (competition_id, university_id, name, capacity)
VALUES 
(1, 1, 'Library', 100),
(2, 2, 'Computer Science Building', 150),
(3, 5, 'K7', 300);

-- Competition Admin(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles)
VALUES
(1, 1, ARRAY['Admin']::competition_role_enum[]),
(1, 2, ARRAY['Admin']::competition_role_enum[]),
(1, 3, ARRAY['Admin']::competition_role_enum[]);

-- Competition Coach(es)
INSERT INTO competition_users (user_id, competition_id, competition_roles)
VALUES
(2, 1, ARRAY['Coach']::competition_role_enum[]),
(2, 2, ARRAY['Coach']::competition_role_enum[]),
(2, 3, ARRAY['Coach']::competition_role_enum[]);

-- Competition Site Coordinator(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id)
VALUES
(4, 1, ARRAY['Site-Coordinator']::competition_role_enum[], 1);

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
  past_regional
)
VALUES
    (5, 1, ARRAY['Participant']::competition_role_enum[], 4,  TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE),
    (6, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE),
    (7, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE),
    (8, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE),
    (9, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE),
    (10, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], 2, FALSE);

INSERT INTO competition_teams (
  competition_coach_id, name, team_status, team_name_approved, team_size, participants, university_id, competition_id
)
VALUES
(4, 'Team Zeta', 'registered', FALSE, 3, ARRAY[8, 9, 10], 2, 1),
(4, 'Team Alpha', 'pending', FALSE, 3, ARRAY[5, 6, 7], 2, 1);

-- Notifications
INSERT INTO notifications (
  user_id, team_id, competition_id, type, message, decision, created_at,
  team_name, student_name, competition_name, new_team_name, site_location
)
VALUES 
(
  5, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NULL, NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  5, NULL, NULL, ARRAY['welcomeAccount']::notification_type_enum[], 'Welcome to TeamUP!', NULL, NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  6, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NULL, NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  7, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NULL, NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  8, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NULL, NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  9, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NULL, NOW(),
  NULL, NULL, NULL, NULL, NULL
),
(
  10, NULL, NULL, ARRAY['welcomeCompetition']::notification_type_enum[], 'Welcome to the competition!', NULL, NOW(),
  NULL, NULL, NULL, NULL, NULL
);
