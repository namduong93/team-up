// dbUtils.ts
import { Pool } from 'pg';
import fs from 'fs';
import path, { join } from 'path';

// connect to postgres
const pool = new Pool({
  user: 'postgres',
  password: 'ab',
  host: 'localhost',
  port: 5432, // Test DB port
  database: 'capstone_db',

  /*user: 'postgres',
  host: 'localhost',
  password: 'Jackofspades948',
  port: 5432,
  connectionTimeoutMillis: 20000,*/
});

// deletes test database 
export const dropTestDatabase = async (pool: Pool) => {
  await pool.end()
};

export default pool;
