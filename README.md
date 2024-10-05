
# ICPC Builder

ICPC Builder is a comprehensive solution designed for building, managing, and optimizing ICPC (International Collegiate Programming Contest) tasks and competitions. This project leverages modern technologies to ensure efficient development, deployment, and management of competition environments.

## Table of Contents
1. [Getting Started](#getting-started)
2. [Development Environment Setup](#development-environment-setup)
3. [Production Environment Setup](#production-environment-setup)
4. [Database Queries](#database-queries)
5. [Tech Stack](#tech-stack)
6. [Node Version](#node-version)
7. [License](#license)

## Getting Started

To get the project up and running, clone the repository using the following command:

```bash
git clone git@github.com:unsw-cse-comp99-3900/capstone-project-2024-t3-3900w18agooglegurlies.git
```

Ensure you have the necessary environment setup as described below. The ICPC Builder provides a seamless experience for both developers and users through its Docker-based containerization.

## Development Environment Setup

To set up the development environment, you can use the following commands:

1. **Option 1**:  
   Run the following script to launch the development environment:
   ```bash
   ./dev_run_docked.sh
   ```
   
2. **Option 2**:  
   Alternatively, you can use Docker Compose:
   ```bash
   docker compose -f docker-compose.dev.yml up --build
   ```

- **Backend** will be accessible at:  
  `http://localhost:8000`
  
- **Frontend** will be accessible at:  
  `http://localhost:5173`

## Production Environment Setup

For deploying in the production environment, you can use:

1. **Option 1**:  
   Run the following script:
   ```bash
   ./prod_run_docked.sh
   ```

2. **Option 2**:  
   Alternatively, use Docker Compose:
   ```bash
   docker compose up --build
   ```

- **Backend** will be accessible at:  
  `http://localhost:8000`
  
- **Frontend** will be accessible at:  
  `http://localhost:4173`

## Database Queries

To interact with the PostgreSQL database, open a new terminal and use the following commands:

1. Enter the PostgreSQL container:
   ```bash
   docker exec -it capstone_db_container psql -U postgres -d capstone_db
   ```

2. **View list of tables**:
   ```bash
   \dt
   ```

3. **View list of users**:
   ```bash
   SELECT * FROM users;
   ```

## Tech Stack

ICPC Builder utilizes the following technologies:

- **Frontend**:  
  Vite + React + TypeScript
  
- **Backend**:  
  Node.js + Express
  
- **Database**:  
  PostgreSQL (managed within Docker)

## Node Version

Ensure you're running Node.js version `20.9.0` or any version greater than or equal to `20` for compatibility.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
