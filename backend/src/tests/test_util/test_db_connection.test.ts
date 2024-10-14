import { Pool } from 'pg';

describe('Postgres DB Connection', () => {
  test('should establish a successful pg db connection', async () => {
    // Create a new connection pool
    const pool = new Pool({
      user: 'postgres',
      password: 'ab',
      host: 'localhost',
      port: 5432,
      database: 'capstone_db',
    });

    try {
      // Attempt to connect to the database
      const client = await pool.connect();

      // Verify the connection
      expect(client).toBeTruthy();

      // Release the client back to the pool
      client.release();
    } finally {
      // Ensure the pool is closed
      await pool.end();
    }
  });
});