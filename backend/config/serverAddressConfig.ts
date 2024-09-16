// Later can make a .env file and use the dotenv package to load
// HOST and PORT into process.env
export const serverAddress = {
  HOST: process.env.IP || 'localhost',
  PORT: process.env.PORT || '8000'
}
