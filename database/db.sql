
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
  
  -- Enforces EXACTLY 60 length hashed_password (bcrypt hashed pass is always 60 chars)
  hashed_password CHAR(60) NOT NULL,

  -- Maximum email address length is 320 chars set by IETF
  email VARCHAR(320) NOT NULL UNIQUE,

  tshirt_size TEXT NOT NULL,

  -- Optional field
  pronouns TEXT,
  allergies TEXT,
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

-- TEST DATA
-- TODO: This is hard code for some university, we will delete it later when we get into Admin and University api
INSERT INTO universities (name) 
VALUES 
('University of Melbourne'),
('Monash University'),
('RMIT University'),
('University of Sydney'),
('University of New South Wales');

-- Hardcoded data for users
INSERT INTO users (name, hashed_password, email, tshirt_size, pronouns, allergies, accessibility_reqs)
VALUES 
('System Admin', '$2a$10$xeAb1BWjYheI6OIcv07RJOmFRvQtV0cTnbrmt2thWO.RWL7OwEbhO', 'admin@examplecom', 'L', 'he/him', 'Peanuts', 'None'), -- password is 'admin'
('Staff Account', '$2y$10$abcdefgh1234567890abcdefgh1234567890abcdefgh', 'bob@examplecom', 'M', 'he/him', 'None', 'None'),
('Test Staff Account', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'teststaff@examplecom', 'M', 'he/him', 'None', 'None'), -- password is 'pleasechange'
('Student Account', '$2y$10$abcdefgh1234567890abcdefgh1234567890abcdefgh', 'charlie.brown@examplecom', 'S', 'they/them', 'None', 'Wheelchair Access'),
('Student Account 2', '$2y$10$abcdefgh1234567890abcdefgh1234567890abcdefgh', 'daniel.brown@examplecom', 'S', 'they/them', 'None', 'None'),
('Test Student Account', '$2a$10$VHQb71WIpNdtvAEdp9RJvuEPEBs/ws3XjcTLMkMwt7ACszLTGJMC.', 'teststudent@examplecom', 'S', 'they/them', 'None', 'None'); -- password is 'pleasechange'

-- Hardcoded data for staff
INSERT INTO staffs (user_id, university_id)
VALUES 
(1, 1),
(2, 2),
(3, 1);

-- Hardcoded data for system admins
INSERT INTO system_admins (staff_id)
VALUES 
(1);

-- Hardcoded data for students
INSERT INTO students (user_id, university_id, student_id)
VALUES 
(2, 1, '1234567'),
(4, 2, '7654321'),
(5, NULL, '1231231'),
(6, 1, '1698432');