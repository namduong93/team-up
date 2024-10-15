
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
  
  name TEXT,

  -- UG and PG course codes in format (UGcode/PGcode)
  code TEXT NOT NULL,

  university_id INT REFERENCES universities (id)
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,

  -- Don't know if there should be constraints on name lol
  name TEXT NOT NULL,

  preferred_name TEXT,

  -- Maximum email address length is 320 chars set by IETF
  email VARCHAR(320) NOT NULL UNIQUE,

  -- Enforces EXACTLY 60 length hashed_password (bcrypt hashed pass is always 60 chars)
  hashed_password CHAR(60) NOT NULL,

  gender TEXT,
  pronouns TEXT,
  tshirt_size TEXT NOT NULL,

  -- Optional field
  allergies TEXT,
  dietary_reqs TEXT[],
  accessibility_reqs TEXT
);

CREATE TABLE staffs (
  -- Foreign Key Primary Key of their user id
  user_id INT PRIMARY KEY,

  university_id INT NOT NULL, 

  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (university_id) REFERENCES universities (id)
);

CREATE TABLE students (
  -- Foreign Key Primary Key of their user id
  user_id INT PRIMARY KEY,
  
  -- Foreign Key id of university they attend (null if they do not attend university (unofficial))
  university_id INT,
  student_id TEXT,

  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (university_id) REFERENCES universities (id)

);

CREATE TABLE sessions (
  id SERIAL PRIMARY KEY,

  session_id CHAR(36) NOT NULL,
  
  -- Foreign Key id of the user that is logged in
  user_id INT NOT NULL REFERENCES users (id),

  -- The time the session was created
  created_at TIMESTAMP NOT NULL
);

CREATE TABLE system_admins (
  -- Foreign Key Primary Key of their Staff user id
  staff_id INT PRIMARY KEY,
  FOREIGN KEY (staff_id) REFERENCES staffs (user_id)
);

CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,

  -- TODO: add constraints to the name
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

  address TEXT,

  capacity INT,

  default_site BOOLEAN NOT NULL,

  CONSTRAINT unique_site_competition UNIQUE (competition_id, address)
);


CREATE TABLE competition_admins (
  id SERIAL PRIMARY KEY,
  
  staff_id INT NOT NULL REFERENCES staffs (user_id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  CONSTRAINT unique_admin UNIQUE (staff_id, competition_id)
);

CREATE TABLE competition_coaches (
  id SERIAL PRIMARY KEY,

  staff_id INT NOT NULL REFERENCES staffs (user_id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  CONSTRAINT unique_coach UNIQUE (staff_id, competition_id)
);

CREATE TABLE competition_site_coordinators (
  id SERIAL PRIMARY KEY,

  staff_id INT NOT NULL REFERENCES staffs (user_id),
  competition_id INT NOT NULL REFERENCES competitions (id),
  site_id INT NOT NULL REFERENCES competition_sites (id),

  CONSTRAINT unique_site_coordinator UNIQUE (staff_id, competition_id)
);

CREATE TABLE competition_teams (
  id SERIAL PRIMARY KEY,

  competition_coach_id INT REFERENCES competition_coaches (id),

  -- TODO: add constraints to the name
  name TEXT NOT NULL,
  
  competition_id INT NOT NULL REFERENCES competitions (id),
  site_id INT NOT NULL REFERENCES competition_sites (id),
  university_id INT REFERENCES universities (id)
);

-- i.e. competition_pair
CREATE TABLE competition_incomplete_teams (
  id SERIAL PRIMARY KEY,

  competition_coach_id INT REFERENCES competition_coaches (id),
  competition_id INT NOT NULL REFERENCES competitions (id),
  university_id INT NOT NULL REFERENCES universities (id)

);

CREATE TABLE competition_participants (
  id SERIAL PRIMARY KEY,

  user_id INT NOT NULL REFERENCES users (id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  -- -- TENTATIVE: Score ranking student
  -- qualification_score INT,

  -- The team they are in if they are in one.
  competition_team_id INT REFERENCES competition_Teams (id),

  -- if not in one then the incomplete team they are in
  competition_incomplete_team_id INT REFERENCES competition_incomplete_teams (id),
  
  -- enforce that you can only be in a team or an incomplete team but not both or neither.
  CHECK (competition_team_id IS NULL AND competition_incomplete_team_id IS NOT NULL
        OR competition_team_id IS NOT NULL AND competition_incomplete_team_id IS NULL),
  CONSTRAINT unique_participant UNIQUE (user_id, competition_id)

);

CREATE OR REPLACE FUNCTION competition_list_participants(u_id INT)
RETURNS TABLE(id INT, name TEXT, early_reg_deadline TIMESTAMP, general_reg_deadline TIMESTAMP)
AS $$
  SELECT c.id AS id, c.name AS name, early_reg_deadline, general_reg_deadline
  FROM competition_participants AS cp
  JOIN competitions AS c ON c.id = cp.competition_id
  WHERE cp.user_id = u_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION competition_list_coaches(u_id INT)
RETURNS TABLE(id INT, name TEXT, early_reg_deadline TIMESTAMP, general_reg_deadline TIMESTAMP)
AS $$
  SELECT c.id AS id, c.name AS name, early_reg_deadline, general_reg_deadline
  FROM competition_coaches AS cc
  JOIN competitions AS c ON c.id = cc.competition_id
  WHERE cc.staff_id = u_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION competition_list_admins(u_id INT)
RETURNS TABLE(id INT, name TEXT, early_reg_deadline TIMESTAMP, general_reg_deadline TIMESTAMP)
AS $$
  SELECT c.id AS id, c.name AS name, early_reg_deadline, general_reg_deadline
  FROM competition_admins AS ca
  JOIN competitions AS c ON c.id = ca.competition_id
  WHERE ca.staff_id = u_id;
$$ LANGUAGE sql;

CREATE OR REPLACE FUNCTION competition_list_site_coordinators(u_id INT)
RETURNS TABLE(id INT, name TEXT, early_reg_deadline TIMESTAMP, general_reg_deadline TIMESTAMP)
AS $$
  SELECT c.id AS id, c.name AS name, early_reg_deadline, general_reg_deadline
  FROM competition_site_coordinators AS csc
  JOIN competitions AS c ON c.id = csc.competition_id
  WHERE csc.staff_id = u_id;
$$ LANGUAGE sql;


-- TEST DATA
-- TODO: This is hard code for some university, we will delete it later when we get into Admin and University api
INSERT INTO universities (name) 
VALUES 
('University of Melbourne'),
('Monash University'),
('RMIT University'),
('University of Sydney'),
('University of New South Wales');

-- Users
-- Staffs
INSERT INTO users (name, preferred_name, email, hashed_password, gender, pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs) 
VALUES 
('System Admin', 'Admin', 'admin@example.com', '$2a$10$xeAb1BWjYheI6OIcv07RJOmFRvQtV0cTnbrmt2thWO.RWL7OwEbhO', 'Male', 'he/him', 'L', 'Peanuts', '{}', 'None'), -- password is 'admin'
('Test Staff Account', 'Staff', 'teststaff@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Male', 'he/him', 'M', 'None', '{}', 'None'), -- password is 'pleasechange'
('Coach 1', 'Coach One', 'testcoach1@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Male', 'he/him', 'XL', 'None', '{}', 'Stairs Access'), -- password is 'pleasechange'
('Coach 2', 'Coach Two', 'testcoach2@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Female', 'she/her', 'S', 'Water', '{}', 'None'), -- password is 'pleasechange'
('Site Coordinator 1', 'Site Coord 1', 'testsitecoor1@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Female', 'she/her', 'L', 'None', '{}', 'None'), -- password is 'pleasechange'
('Site Coordinator 2', 'Site Coord 2', 'testsitecoor2@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Non-binary', 'they/them', 'XS', 'Tomato', '{}', 'Wheelchair Access'), -- password is 'pleasechange'
('Site Coordinator 3', 'Site Coord 3', 'testsitecoor3@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Non-binary', 'they/them', 'S', 'None', '{}', 'None'); -- password is 'pleasechange'

INSERT INTO staffs (user_id, university_id)
VALUES 
(1, 1),
(2, 1),
(3, 2),
(4, 3),
(5, 1),
(6, 2),
(7, 5);

INSERT INTO system_admins (staff_id)
VALUES 
(1);

-- Students
INSERT INTO users (name, preferred_name, email, hashed_password, gender, pronouns, tshirt_size, allergies, dietary_reqs, accessibility_reqs) 
VALUES
('Test Student Account 1', 'Test Account', 'teststudent1@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Male', 'They/them', 'S', 'None', '{}', 'Wheelchair Access'), 
('Test Student Account 2', 'Test Account 2', 'teststudent2@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Male', 'he/him', 'M', 'None', '{}', 'None'), 
('Test Student Account 3', 'Test Account 3', 'teststudent3@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Female', 'she/her', 'L', 'Milk', '{}', 'None'), 
('Test Student Account 4', 'Test Account 4', 'teststudent4@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Male', 'he/him', 'M', 'None', '{}', 'None'), 
('Test Student Account 5', 'Test Account 5', 'teststudent5@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Female', 'she/her', 'L', 'None', '{}', 'None'), 
('Test Student Account 6', 'Test Account 6', 'teststudent6@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Non-binary', 'they/them', 'S', 'Orange', '{}', 'None'), 
('Test Student Account 7', 'Test Account 7', 'teststudent7@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Male', 'he/him', 'XL', 'None', '{}', 'None'), 
('Test Student Account 8', 'Test Account 8', 'teststudent8@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Female', 'she/her', 'XS', 'Peanuts', '{}', 'None'), 
('Test Student Account 9', 'Test Account 9', 'teststudent9@example.com', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'Non-binary', 'they/them', 'M', 'None', '{}', 'Wheelchair Access'); -- password is 'pleasechange'

INSERT INTO students (user_id, university_id, student_id)
VALUES 
(8, 1, '1234567'),
(9, 1, '7654321'),
(10, 1, '1231231'),
(11, 2, '1231232'),
(12, 2, '1231233'),
(13, 2, '1231234'),
(14, 5, '1231235'),
(15, 5, '1231236'),
(16, 5, '1231237');

-- Competitions
INSERT INTO competitions (name, team_size, early_reg_deadline, general_reg_deadline, code)
VALUES 
('Test Competition 1', 3, '204-10-20 00:00:00', '2024-10-15 00:00:00', 'TSTC1'),
('Test Competition 2', 3, '204-10-25 00:00:00', '2024-10-20 00:00:00', 'TSTC2'),
('Test Competition 3', 3, '204-11-10 00:00:00', '2024-11-01 00:00:00', 'TSTC3');

-- Competition Sites
INSERT INTO competition_sites (competition_id, university_id, name, address, capacity, default_site)
VALUES 
(1, 1, 'Library', '2 Parkville St.', 100, TRUE),
(1, 1, 'Anywhere but the Library', 'Somewhere', 1000, FALSE),
(2, 2, 'Computer Science Building', '3 Homeville Rd.', 150, TRUE),
(2, 2, 'Home', 'Home', 3, FALSE),
(3, 5, 'K7', '1 Light Rail St.', 300, TRUE),
(3, 5, 'Law Library', '2 Light Rail St.', 200, FALSE);

-- Competition Admins
INSERT INTO competition_admins (staff_id, competition_id)
VALUES 
(1, 1),
(1, 2),
(1, 3);

-- Competition Coaches
INSERT INTO competition_coaches (staff_id, competition_id)
VALUES 
(3, 1),
(4, 2),
(3, 3),
(4, 3);

-- Competition Site Coordinators
INSERT INTO competition_site_coordinators (staff_id, competition_id, site_id)
VALUES 
(5, 1, 1),
(6, 2, 3),
(7, 3, 5);

-- Competition Teams
INSERT INTO competition_teams (competition_coach_id, name, competition_id, site_id, university_id)
VALUES 
(1, 'Team Alpha', 1, 1,1),
(1, 'Team Beta', 2, 3, 2),
(1, 'Team Gamma', 3, 5, 5);

-- Competition Participants
INSERT INTO competition_participants (user_id, competition_id, competition_team_id)
VALUES 
(8, 1, 1),
(9, 1, 1),
(10, 1, 1),
(11, 2, 2),
(12, 2, 2),
(13, 2, 2),
(14, 3, 3),
(15, 3, 3),
(16, 3, 3);