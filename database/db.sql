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

  CONSTRAINT unique_site_competition UNIQUE (competition_id, name)
);

CREATE TYPE competition_role_enum AS ENUM ('participant', 'coach', 'admin', 'site-coordinator');
CREATE TYPE competition_level_enum AS ENUM ('A', 'B');

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

  national_prizes TEXT[],
  international_prizes TEXT[],
  codeforces_rating TEXT[],
  university_courses TEXT[],
  
  competition_coach_id INT REFERENCES competition_users (id),

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

CREATE OR REPLACE FUNCTION competition_list(u_id INT)
RETURNS TABLE(id INT, name TEXT, early_reg_deadline TIMESTAMP, general_reg_deadline TIMESTAMP)
AS $$
  SELECT c.id AS id, c.name AS name, early_reg_deadline, general_reg_deadline
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
SELECT u.id AS id, u.preferred_name, uni.name AS affiliation
FROM users AS u
JOIN universities AS uni ON uni.id = u.university_id;

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
  'Male',
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
  'testcoach1@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'Male',
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
  'Male',
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
  'Male',
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
  'teststudent1@example.com',
  '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.',
  'Male',
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
  'Male',
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
  'Male',
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
  'Male',
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
  'Male',
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
  'Male',
  'They/them',
  'S',
  'None',
  '{}',
  'Wheelchair Access',
  'student',
  2,
  'z000006');

-- Competitions
INSERT INTO competitions (name, team_size, early_reg_deadline, general_reg_deadline, code)
VALUES 
('Test Competition 1', 3, '204-10-20 00:00:00', '2024-10-15 00:00:00', 'TSTC1'),
('Test Competition 2', 3, '204-10-25 00:00:00', '2024-10-20 00:00:00', 'TSTC2'),
('Test Competition 3', 3, '204-11-10 00:00:00', '2024-11-01 00:00:00', 'TSTC3');

-- Competition Sites
INSERT INTO competition_sites (competition_id, university_id, name, capacity)
VALUES 
(1, 1, 'Library', 100),
(2, 2, 'Computer Science Building', 150),
(3, 5, 'K7', 300);

-- Competition Admin(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles)
VALUES
(1, 1, ARRAY['admin']::competition_role_enum[]);

-- Competition Coach(es)
INSERT INTO competition_users (user_id, competition_id, competition_roles)
VALUES
(2, 1, ARRAY['coach']::competition_role_enum[]),
(2, 2, ARRAY['coach']::competition_role_enum[]);

-- Competition Site Coordinator(s)
INSERT INTO competition_users (user_id, competition_id, competition_roles, site_id)
VALUES
(4, 1, ARRAY['site-coordinator']::competition_role_enum[], 1);

-- Competition Participants
INSERT INTO competition_users (
  user_id, competition_id, competition_roles,
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
  competition_coach_id
)
VALUES
(5, 1, ARRAY['participant']::competition_role_enum[], TRUE, 'A', TRUE, 3, 'CompSci', FALSE, '{}', '{}', '{}', '{}', 2),
(6, 1, ARRAY['participant']::competition_role_enum[], TRUE, 'A', TRUE, 3, 'CompSci', FALSE, '{}', '{}', '{}', '{}', 2),
(7, 1, ARRAY['participant']::competition_role_enum[], TRUE, 'A', TRUE, 3, 'CompSci', FALSE, '{}', '{}', '{}', '{}', 2),
(8, 1, ARRAY['participant']::competition_role_enum[], TRUE, 'B', TRUE, 3, 'CompSci', FALSE, '{}', '{}', '{}', '{}', 2),
(9, 1, ARRAY['participant']::competition_role_enum[], TRUE, 'B', TRUE, 3, 'CompSci', FALSE, '{}', '{}', '{}', '{}', 2),
(10, 1, ARRAY['participant']::competition_role_enum[], TRUE, 'B', TRUE, 3, 'CompSci', FALSE, '{}', '{}', '{}', '{}', 2);
