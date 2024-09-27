
DROP DATABASE IF EXISTS capstone_db;
CREATE DATABASE capstone_db;

\c capstone_db;

-- sql schema goes here:


CREATE TABLE universities (
  id SERIAL PRIMARY KEY
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

  -- any data specific to a Non_Student here

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

CREATE TABLE competition_admins (
  user_id INT REFERENCES users (id),
  competition_id INT REFERENCES competitions (id),

  PRIMARY KEY (user_id, competition_id)
);

CREATE TABLE competition_coaches (
  user_id INT,
  competition_id INT,

  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (competition_id) REFERENCES competitions (id),
  PRIMARY KEY (user_id, competition_id)
);

CREATE TABLE competition_teams (
  id SERIAL PRIMARY KEY,

  -- TODO: add constraints to the name
  name TEXT NOT NULL,
  
  competition_id INT NOT NULL REFERENCES competitions (id),

  university_id INT REFERENCES universities (id)
);

CREATE TABLE competition_participants (
  user_id INT REFERENCES users (id),
  competition_id INT REFERENCES competitions (id),

  -- TENTATIVE: Score ranking student
  qualification_score INT,

  -- The team they are in if they are in one.
  competition_team_id INT REFERENCES competition_Teams (id),

  PRIMARY KEY (user_id, competition_id)
);
