// Later can make a .env file and use the dotenv package to load
// into process.env
export const dbConfig = {
  DB_HOST: process.env.POSTGRES_HOST || '',
  // host is the name as in the docker compose
  DB_PORT: process.env.POSTGRES_PORT || '',
  DB_NAME: process.env.POSTGRES_DB_NAME || '',
  DB_USER: process.env.POSTGRES_USER || '',
  DB_PASSWORD: process.env.POSTGRES_PASSWORD || '',
};
