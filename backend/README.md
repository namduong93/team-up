# Running Backend Server and Database
We run Docker to build only the database, then start the backend server in development mode through npm:

```bash
# Window 1
docker compose -f docker-compose-db.yaml up --build
```

```bash
# Window 2 (in backend/ directory)
npm run dev
```

# Tests
Since we are using a test database, we need to run Docker first, then run the tests. However, some tests do not delete data they created and logged into the database. Therefore, if there is any issue, Docker should be restarted because data is cleaned when the database schema is built. The general procedure is to first run the backend server and database as previously instructed. Then we run tests.

```bash
npm test
```