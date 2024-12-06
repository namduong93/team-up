// Later can make a .env file and use the dotenv package to load
// HOST and PORT into process.env
export const serverAddress = {
  HOST: '0.0.0.0',
  PORT: process.env.BACKEND_PORT || ''
};
