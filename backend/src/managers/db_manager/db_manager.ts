import { Pool } from "pg";
import { dbConfig } from "../../../config/dbConfig.js";

const pool = new Pool({
  user: dbConfig.DB_USER,
  host: dbConfig.DB_HOST,
  database: dbConfig.DB_NAME,
  password: dbConfig.DB_PASSWORD,
  port: Number(dbConfig.DB_PORT),
  max: 10,
});

// this db_manager namespace can handle the queries to the db.
export namespace db_manager {
  export function insertStudent() {
    // stub
  };

  export function insertStaff() {
    // stub
  };

  // Add more as needed.
};