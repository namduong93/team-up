// dbUtils.ts
import { Pool } from 'pg';
import fs from 'fs';
import path, { join } from 'path';

// connect to postgres
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  password: 'Jackofspades948',
  port: 5432,
  connectionTimeoutMillis: 20000,
});

//creates a new test database
export const createTestDatabase = async (testDbName: string) => {
  try {
    await pool.query(`CREATE DATABASE "${testDbName}";`);

    const pathname = join(__dirname, '../../../../../database/db.sql');
    const sqlFile = fs.readFileSync(path.resolve(pathname), 'utf8');
    const lines = sqlFile.split('\n');
    const startIndex = lines.findIndex(line => line.trim() === '\\c capstone_db;');

    const newPool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: testDbName,
      password: 'Jackofspades948',
      port: 5432,
      connectionTimeoutMillis: 20000,
    });

    if (startIndex !== -1) {
      const sqlToExecute = lines.slice(startIndex + 1).join('\n');
      await newPool.query(sqlToExecute);
    } else {
      console.error('Could not find \\c command in the SQL file.');
    }

    return newPool;
  } catch (error) {
    console.error('Error creating database:', error);
  }
};

// deletes test database 
export const dropTestDatabase = async (testDbName: string) => {
  await pool.query(`DROP DATABASE IF EXISTS "${testDbName}";`);
};
