
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
  email VARCHAR(320) NOT NULL,

  -- Optional field
  pronouns TEXT
);

CREATE TABLE non_students (
  -- Foreign Key Primary Key of their user id
  user_id INT PRIMARY KEY,

  university_id INT NOT NULL REFERENCES universities (id),


  FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE students (
  -- Foreign Key Primary Key of their user id
  user_id INT PRIMARY KEY,
  
  -- Foreign Key id of university they attend (null if they do not attend university (unofficial))
  university_id INT,

  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (university_id) REFERENCES universities (id)

);

CREATE TABLE competitions (
  id SERIAL PRIMARY KEY,

  -- TODO: add constraints to name
  name TEXT NOT NULL,

  team_size INT NOT NULL

);

CREATE TABLE sites (
  id SERIAL PRIMARY KEY,

  competition_id INT NOT NULL REFERENCES competitions (id),

  address TEXT NOT NULL,

  capacity INT NOT NULL,

  CONSTRAINT unique_site_competition UNIQUE (competition_id, address)
);


CREATE TABLE competition_admins (
  id SERIAL PRIMARY KEY,
  
  non_student_id INT NOT NULL REFERENCES non_students (user_id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  CONSTRAINT unique_admin UNIQUE (non_student_id, competition_id)
);

CREATE TABLE competition_coaches (
  id SERIAL PRIMARY KEY,

  non_student_id INT NOT NULL REFERENCES non_students (user_id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  CONSTRAINT unique_coach UNIQUE (non_student_id, competition_id)
);

CREATE TABLE competition_site_coordinators (
  id SERIAL PRIMARY KEY,

  non_student_id INT NOT NULL REFERENCES non_students (user_id),
  competition_id INT NOT NULL REFERENCES competitions (id),
  site_id INT NOT NULL REFERENCES sites (id),

  CONSTRAINT unique_site_coordinator UNIQUE (non_student_id, competition_id)
);

CREATE TABLE competition_teams (
  id SERIAL PRIMARY KEY,

  competition_coach_id INT REFERENCES competition_coaches (id),

  -- TODO: add constraints to the name
  name TEXT NOT NULL,
  
  competition_id INT NOT NULL REFERENCES competitions (id),
  site_id INT NOT NULL REFERENCES sites (id),
  university_id INT REFERENCES universities (id)
);

CREATE TABLE competition_participants (
  id SERIAL PRIMARY KEY,

  user_id INT NOT NULL REFERENCES users (id),
  competition_id INT NOT NULL REFERENCES competitions (id),

  -- -- TENTATIVE: Score ranking student
  -- qualification_score INT,

  -- The team they are in if they are in one.
  competition_team_id INT REFERENCES competition_Teams (id),

  CONSTRAINT unique_participant UNIQUE (user_id, competition_id)

);

INSERT INTO users (name, hashed_password, email, pronouns) VALUES
('Nam', '012345678901234567890123456789012345678901234567890123456789', 'nam@gmail.com', 'he/him');
