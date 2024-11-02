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
  

  university_id INT REFERENCES universities (id),

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
  created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  early_reg_deadline TIMESTAMPTZ,
  general_reg_deadline TIMESTAMPTZ NOT NULL,
  start_date TIMESTAMPTZ NOT NULL,
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

  bio TEXT NOT NULL DEFAULT '',

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
  
  -- coach info

  -- admin info

  -- site-coordinator info
  site_id INT REFERENCES competition_sites (id),

  -- staff info
  access_level competition_access_enum,

  CONSTRAINT unique_competition_user UNIQUE (user_id, competition_id)
);

CREATE TYPE competition_team_status AS ENUM ('Registered', 'Unregistered', 'Pending');

CREATE TABLE competition_teams (
  id SERIAL PRIMARY KEY,

  competition_coach_id INT REFERENCES competition_users (id), --- id is the id of the coach in the competition, not the user_id

  name TEXT NOT NULL,
  pending_name TEXT,

  team_status competition_team_status NOT NULL,
  team_size INT NOT NULL,

  site_attending_id INT REFERENCES competition_sites (id),
  pending_site_attending_id INT REFERENCES competition_sites (id) NULL,

  team_seat TEXT,

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
  JOIN competition_teams AS ct ON (ct.participants[1] = u.id OR ct.participants[2] = u.id OR ct.participants[3] = u.id)
  JOIN competition_sites AS cs ON cs.id = ct.site_attending_id
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
  JOIN competition_teams AS ct ON (ct.participants[1] = u.id OR ct.participants[2] = u.id OR ct.participants[3] = u.id)
  JOIN competition_sites AS cs ON cs.id = ct.site_attending_id
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

CREATE OR REPLACE VIEW competition_team_details AS
SELECT cu_source.user_id AS src_user_id,
  cu_source.competition_id AS src_competition_id, u_coach.id AS coach_user_id,
  ct.site_attending_id AS src_site_attending_id,
  c.name AS "compName", ct.id AS "teamId", ct.university_id AS "universityId",
  (ct.pending_name IS NULL) AS "teamNameApproved", ct.team_status AS "status",
  (CASE WHEN ct.pending_name IS NULL THEN ct.name ELSE ct.pending_name END) AS "teamName",
  (ct.pending_site_attending_id IS NULL) AS "siteApproved",
  cs.name AS "teamSite", ct.team_seat AS "teamSeat",
  cu_source.competition_level AS "teamLevel", c.start_date AS "startDate",
  JSON_BUILD_ARRAY(
    JSON_BUILD_OBJECT(
      'userId', u1.id,
      'name', u1.name,
      'email', u1.email,
      'bio', cu1.bio,
      'preferredContact', cu1.preferred_contact,
      'ICPCEligible', cu1.icpc_eligible,
      'level', cu1.competition_level,
      'boersenEligible', cu1.boersen_eligible,
      'isRemote', cu1.is_remote
    ),
    JSON_BUILD_OBJECT(
      'userId', u2.id,
      'name', u2.name,
      'email', u2.email,
      'bio', cu2.bio,
      'preferredContact', cu2.preferred_contact,
      'ICPCEligible', cu2.icpc_eligible,
      'level', cu2.competition_level,
      'boersenEligible', cu2.boersen_eligible,
      'isRemote', cu2.is_remote
    ),
    JSON_BUILD_OBJECT(
      'userId', u3.id,
      'name', u3.name,
      'email', u3.email,
      'bio', cu3.bio,
      'preferredContact', cu3.preferred_contact,
      'ICPCEligible', cu3.icpc_eligible,
      'level', cu3.competition_level,
      'boersenEligible', cu3.boersen_eligible,
      'isRemote', cu3.is_remote
    )
  ) AS students,
  JSON_BUILD_OBJECT(
    'name', u_coach.name,
    'email', u_coach.email,
    'bio', cu_coach.bio
  ) AS coach

FROM competition_users AS cu_source
JOIN competitions AS c ON c.id = cu_source.competition_id
JOIN competition_teams AS ct ON cu_source.user_id = ANY(ct.participants) AND cu_source.competition_id = ct.competition_id
JOIN competition_sites AS cs ON
  (CASE 
    WHEN ct.pending_site_attending_id IS NULL THEN ct.site_attending_id 
    ELSE ct.pending_site_attending_id 
  END) = cs.id

JOIN competition_users AS cu_coach ON cu_coach.id = ct.competition_coach_id
JOIN users AS u_coach ON u_coach.id = cu_coach.user_id

LEFT JOIN users AS u1 ON u1.id = ct.participants[1]
LEFT JOIN users AS u2 ON u2.id = ct.participants[2]
LEFT JOIN users AS u3 ON u3.id = ct.participants[3]
LEFT JOIN competition_users AS cu1 ON u1.id = cu1.user_id
LEFT JOIN competition_users AS cu2 ON u2.id = cu2.user_id
LEFT JOIN competition_users AS cu3 ON u3.id = cu3.user_id
WHERE (cu1.competition_id = cu_coach.competition_id OR cu1.competition_id IS NULL)
  AND (cu2.competition_id = cu_coach.competition_id OR cu2.competition_id IS NULL)
  AND (cu3.competition_id = cu_coach.competition_id OR cu3.competition_id IS NULL);



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
  'Algorithm Coach',
  'Algorithm',
  'raveen@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'XL',
  'None',
  '{}',
  'Stairs Access',
  'staff',
  5,
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
  'New User',
  'New User',
  'student@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  5,
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
  NULL,
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
  'XL',
  'None',
  '{}',
  NULL,
  'student',
  2,
  'z000009'); --- password is pleasechange

-- Competitions
INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region)
VALUES 
('South Pacific Preliminary Contest 2024', 3, '2024-06-30 00:00:00', '2024-08-29 00:00:00', '2024-08-31 00:00:00', 'SPPR2024', '2025-09-30 00:00:00', 'Australia'),
('South Pacific Regional Contest 2024', 3, '2024-08-31 00:00:00', '2024-10-20 00:00:00', '2024-10-20 00:00:00', 'SPRG2024', '2025-09-30 00:00:00', 'Australia'),
('ICPC World Final', 3, '2024-10-10 00:00:00', '2025-09-10 00:00:00', '2025-09-11 00:00:00', 'WF2025', '2025-09-30 00:00:00', 'Earth');

-- Competition Sites
INSERT INTO competition_sites (competition_id, university_id, name, capacity)
VALUES 
(1, 1, 'Library', 100),
(2, 2, 'Computer Science Building', 150),
(3, 5, 'K7', 300),
(2, 5, 'K7', 300);

-- Competition Admin(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level, bio)
VALUES
(1, 1, ARRAY['Admin']::competition_role_enum[], 'Accepted', 'epic bio'),
(1, 2, ARRAY['Admin']::competition_role_enum[], 'Accepted', 'epic bio'),
(1, 3, ARRAY['Admin']::competition_role_enum[], 'Accepted', 'epic bio');

-- Competition Coach(es)
INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level, bio)
VALUES
(2, 1, ARRAY['Coach']::competition_role_enum[], 'Accepted', 'epic bio'),
(2, 2, ARRAY['Coach']::competition_role_enum[], 'Accepted', 'epic bio'),
(2, 3, ARRAY['Coach']::competition_role_enum[], 'Accepted', 'epic bio');

-- Competition Site Coordinator(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id, access_level)
VALUES
(4, 1, ARRAY['Site-Coordinator']::competition_role_enum[], 2, 'Accepted');


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
  past_regional,
  is_official,
  preferred_contact,
  bio
)
VALUES
    (5, 1, ARRAY['Participant']::competition_role_enum[], 4,  TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Email:example@email.com', 'epic bio'),
    (6, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Discord:fdc234', 'epic bio'),
    (7, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Phone:0413421311', 'epic bio'),
    (8, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Minecraft:EpicMan123', 'epic bio'),
    (9, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Roblox: epicerrMan123', 'epic bio'),
    (10, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'faxMachineNumber:98531234', 'epic bio'),
    (12, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'faxMachineNumber:98531234', 'epic bio'),
    (13, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Phone:0402067382', 'epic bio'),
    (14, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Email:anotherexample@email.com', 'epic bio');
  

-- Non-access coaches
INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id, access_level)
VALUES
(3, 1, ARRAY['Coach']::competition_role_enum[], 1, 'Pending'),
(11, 1, ARRAY['Coach', 'Site-Coordinator']::competition_role_enum[], 1, 'Rejected');

-- Competition Teams
INSERT INTO competition_teams (
  competition_coach_id, name, team_status, pending_name,
  team_size, participants, university_id, competition_id, team_seat, site_attending_id, pending_site_attending_id
)
VALUES
(4, 'Bulbasaur', 'Registered'::competition_team_status, NULL, 3, ARRAY[8, 9, 10], 2, 1, 'Bongo11', 2, NULL),
(4, 'Ivysaur', 'Pending'::competition_team_status, 'Charmander', 3, ARRAY[5, 6, 7], 2, 1, 'Tabla01', 2, NULL),
(4, 'Venusaur', 'Pending'::competition_team_status, 'Charmeleon', 3, ARRAY[12, 13, 14], 2, 1, 'Organ20', 2, 4);

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


-- Algorithm 
INSERT INTO competitions (name, team_size, created_date, early_reg_deadline, general_reg_deadline, code, start_date, region)
VALUES
('Algorithm Testing', 3, '2024-06-30 00:00:00', '2024-08-29 00:00:00', '2024-08-31 00:00:00', 'ALG2024', '2025-09-30 00:00:00', 'Australia');

INSERT INTO competition_sites (competition_id, university_id, name, capacity)
VALUES 
(4, 5, 'J17 K17 Building', 100),
(1, 1, 'Ainsworth Building', 100),
(1, 1, 'Krusty Krab', 100),
(1, 1, 'Spooky Manor', 100),
(1, 1, 'Mickey Mouse Clubhouse', 100),
(1, 1, 'afternoon chance some', 100),
(1, 1, 'charge back finish', 100),
(1, 1, 'chemical captured choose', 100);

INSERT INTO competition_users (user_id, competition_id, competition_roles, access_level, bio)
VALUES
(1, 4, ARRAY['Admin']::competition_role_enum[], 'Accepted', 'epic bio'),
(3, 4, ARRAY['Coach']::competition_role_enum[], 'Accepted', 'epic bio');

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
-- Member from Team ID: 2
( 
  'AR',
  'AR',
  'ar@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000002'
),

-- Member from Team ID: 3, Member 1
(
  'AK',
  'AK',
  'ak@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000003'
),

-- Member from Team ID: 3, Member 2
(
  'YF',
  'YF',
  'yf@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000004'
),

-- Member from Team ID: 4
(
  'DY',
  'DY',
  'dy@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000005'
),

-- Member from Team ID: 5, Member 1
(
  'Kass',
  'Kass',
  'kass@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000006'
),

-- Member from Team ID: 5, Member 2
(
  'JL',
  'JL',
  'jl@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000007'
),

-- Member from Team ID: 6
(
  'HT',
  'HT',
  'ht@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000008'
),

-- Member from Team ID: 7
(
  'Boersen#1',
  'Boersen#1',
  'boersen1@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000009'
),

-- Member from Team ID: 8
(
  'Boersen#1',
  'Boersen#1',
  'boersen1_dup@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000010'
),

-- Member from Team ID: 9
(
  'Boersen#2',
  'Boersen#2',
  'boersen2@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000011'
),

-- Member from Team ID: 10
(
  'Boersen#3',
  'Boersen#3',
  'boersen3@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000012'
),

-- Member from Team ID: 11
(
  'Boersen#4',
  'Boersen#4',
  'boersen4@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000013'
),

-- Member from Team ID: 12
(
  'Algo Student 1',
  'AlgoStu',
  'testingaccount@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000014'
),

-- Member from Team ID: 13
(
  'Algo Student 2',
  'AlgoStu2',
  'testingaccount3@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'M',
  'he/him',
  'L',
  'None',
  '{}',
  'None',
  'student',
  5,
  'z000015'
);

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
  past_regional,
  is_official,
  preferred_contact,
  bio
)
VALUES
  (15, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, 'AIO', 'IOI', 2537, ARRAY[]::TEXT[], TRUE, FALSE, 'AR', 'bio for AR'),
  (16, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, 'INOI', '', 2113, ARRAY[]::TEXT[], TRUE, FALSE, 'AK', 'bio for AK'),
  (17, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], TRUE, FALSE, 'YF', 'bio for YF'),
  (18, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, 'AIO', '', 1624, ARRAY['COMP1511', 'COMP2521', 'COMP3121', 'COMP4128'], TRUE, FALSE, 'DY', 'bio for DY'),
  (19, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, 'NOI', '', 2848, ARRAY['COMP1511', 'COMP2521', 'COMP3821'], TRUE, FALSE, 'Kass', 'bio for Kass'),
  (20, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', FALSE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP1511', 'COMP2521'], TRUE, FALSE, 'JL', 'bio for JL'),
  (21, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, 'NOI', '', 1962, ARRAY['COMP1511', 'COMP2521'], TRUE, FALSE, 'HT', 'bio for HT'),
  (22, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP1511', 'COMP2521', 'COMP3121', 'COMP4128'], TRUE, FALSE, 'Boersen#1', 'bio for Boersen#1'),
  (23, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP1511', 'COMP2521', 'COMP3121', 'COMP4128'], TRUE, FALSE, 'Boersen#1', 'bio for Boersen#1'),
  (24, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP3121', 'COMP4128'], TRUE, FALSE, 'Boersen#2', 'bio for Boersen#2'),
  (25, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP2521'], TRUE, FALSE, 'Boersen#3', 'bio for Boersen#3'),
  (26, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP1511'], TRUE, FALSE, 'Boersen#4', 'bio for Boersen#4'),
  (27, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP2521'], TRUE, FALSE, 'Testing Account', 'bio for Testing Account'),
  (28, 4, ARRAY['Participant']::competition_role_enum[], 20, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY['COMP4128'], TRUE, FALSE, 'Testing Account 3', 'bio for Testing Account 3');
  

INSERT INTO competition_teams (
  competition_coach_id, 
  name, 
  team_status, 
  pending_name,
  team_size, 
  participants, 
  university_id, 
  competition_id, 
  team_seat,
  site_attending_id
)
VALUES
  (20, 'Bulbasaur', 'Pending'::competition_team_status, NULL, 1, ARRAY[15], 5, 4, 'bongo11', 2),
  (20, 'Ivysaur', 'Pending'::competition_team_status, NULL, 2, ARRAY[16, 17], 5, 4, 'bongo14', 2),
  (20, 'Venusaur', 'Pending'::competition_team_status, NULL, 1, ARRAY[18], 5, 4, 'bongo17', 2),
  (20, 'Charmander', 'Pending'::competition_team_status, NULL, 2, ARRAY[19, 20], 5, 4, 'bongo20', 2),
  (20, 'Charmeleon', 'Pending'::competition_team_status, NULL, 1, ARRAY[21], 5, 4, 'bongo23', 2),
  (20, 'Charizard', 'Pending'::competition_team_status, NULL, 1, ARRAY[22], 5, 4, 'bongo26', 2),
  (20, 'Squirtle', 'Pending'::competition_team_status, NULL, 1, ARRAY[23], 5, 4, 'bongo29', 2),
  (20, 'Wartortle', 'Pending'::competition_team_status, NULL, 1, ARRAY[24], 5, 4, 'bongo32', 2),
  (20, 'Blastoise', 'Pending'::competition_team_status, NULL, 1, ARRAY[25], 5, 4, 'bongo35', 2),
  (20, 'Caterpie', 'Pending'::competition_team_status, NULL, 1, ARRAY[26], 5, 4, 'bongo38', 2),
  (20, 'Metapod', 'Pending'::competition_team_status, NULL, 1, ARRAY[27], 5, 4, 'bongo41', 2),
  (20, 'Butterfree', 'Pending'::competition_team_status, NULL, 1, ARRAY[28], 5, 4, 'bongo44', 2);

-- Delete after demo
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
  past_regional,
  is_official,
  preferred_contact,
  bio
)
VALUES
    (15, 1, ARRAY['Participant']::competition_role_enum[], 4,  TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Email:example@email.com', 'epic bio'),
    (16, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Discord:fdc234', 'epic bio'),
    (17, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level A', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, FALSE, 'Phone:0413421311', 'epic bio'),
    (18, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Minecraft:EpicMan123', 'epic bio'),
    (19, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'Roblox: epicerrMan123', 'epic bio'),
    (20, 1, ARRAY['Participant']::competition_role_enum[], 4, TRUE, 'Level B', TRUE, 3, 'CompSci', FALSE, '', '', 0, ARRAY[]::TEXT[], FALSE, TRUE, 'faxMachineNumber:98531234', 'epic bio');
  
INSERT INTO competition_teams (
  competition_coach_id, name, team_status, pending_name,
  team_size, participants, university_id, competition_id, team_seat, site_attending_id, pending_site_attending_id
)
VALUES
(4, 'Charizard', 'Unregistered'::competition_team_status, NULL, 3, ARRAY[15, 16, 17], 2, 1, 'Bongo11', 2, NULL),
(4, 'Wimpod', 'Unregistered'::competition_team_status, 'Snorlax', 3, ARRAY[18, 19, 20], 2, 1, 'Organ20', 2, 4);