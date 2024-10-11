import { Pool } from 'pg';

// Establish a connection with the test database
const pool = new Pool({
  user: 'postgres',
  password: 'ab',
  host: 'localhost',
  port: 5433, // Test DB port
  database: 'capstone_db_test',
});

// Code to clean up the database (deleting all records in all tables)
export const deleteAllRecords = async () => {
  const client = await pool.connect();
  try {
    // Disable foreign key checks temporarily
    await client.query('SET session_replication_role = replica;');

    // Get all table names in the public schema
    const result = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public';
    `);

    // Delete from each table
    for (const row of result.rows) {
      const tableName = row.tablename;
      await client.query(`DELETE FROM "${tableName}";`);
    }

    // Enable foreign key checks again
    await client.query('SET session_replication_role = origin;');
  } finally {
    client.release();
  }
};

export default pool;
