
DROP DATABASE IF EXISTS capstone_db;
CREATE DATABASE capstone_db;

\c capstone_db;

-- sql schema goes here:


CREATE OR REPLACE University (
  id SERIAL PRIMARY KEY,
);

CREATE OR REPLACE TABLE User (
  id SERIAL PRIMARY KEY,

  -- Don't know if there should be constraints on name lol
  name TEXT NOT NULL,
  
  -- Enforces EXACTLY 60 length hashed_password (bcrypt hashed pass is always 60 chars)
  hashed_password CHAR(60) NOT NULL,

  -- Maximum email address length is 320 chars set by IETF
  email VARCHAR(320) NOT NULL,

  -- Optional field
  pronouns TEXT,
);

CREATE OR REPLACE TABLE Non_Student (
  -- Foreign Key Primary Key of their user id
  user_id INT PRIMARY KEY,

  -- any data specific to a Non_Student here

  FOREIGN KEY (user_id) REFERENCES User (id)
);

CREATE OR REPLACE TABLE Student (
  -- Foreign Key Primary Key of their user id
  user_id INT PRIMARY KEY,
  
  -- Foreign Key id of university they attend (null if they do not attend university (unofficial))
  university_id INT,

  FOREIGN KEY (user_id) REFERENCES User (id),
  FOREIGN KEY (university_id) REFERENCES University (id)

);

CREATE OR REPLACE TABLE Competition (
  id SERIAL PRIMARY KEY,

  -- TODO: add constraints to name
  name TEXT NOT NULL,

  team_size INT NOT NULL

);

CREATE OR REPLACE TABLE Competition_Admin (
  user_id INT REFERENCES User (id),
  competition_id INT REFERENCES Competition (id),

  PRIMARY KEY (user_id, competition_id)
);

CREATE OR REPLACE TABLE Competition_Coach (
  user_id INT,
  competition_id INT,

  FOREIGN KEY (user_id) REFERENCES User (id),
  FOREIGN KEY (competition_id) REFERENCES Competition (id)
  PRIMARY KEY (user_id, competition_id)
);

CREATE OR REPLACE TABLE Competition_Team (
  id SERIAL PRIMARY KEY,

  -- TODO: add constraints to the name
  name TEXT NOT NULL,
  
  competition_id INT NOT NULL REFERENCES Competition (id),

  university_id INT REFERENCES University (id)
);

CREATE OR REPLACE TABLE Competition_Participant (
  user_id INT NOT NULL REFERENCES User (id),
  competition_id INT NOT NULL REFERENCES Competition (id),

  -- TENTATIVE: Score ranking student
  qualification_score INT,

  -- The team they are in if they are in one.
  competition_team_id INT REFERENCES Competition_Team (id)

  PRIMARY KEY (user_id, competition_id),
);
