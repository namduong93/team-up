import { Pool } from 'pg';

describe('Postgres Test DB Connection', () => {
  test('should establish a successful pg db connection', async () => {
    // Create a new connection pool
    const pool = new Pool({
      user: 'postgres',
      password: 'ab',
      host: 'localhost',
      port: 5433,
      database: 'capstone_db_test',
    });

    // Attempt to connect to the database
    const client = await pool.connect();

    // Verify the connection
    expect(client).toBeTruthy();

    // Release the client
    client.release();
  });
});