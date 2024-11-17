# Running the Application
We run Docker to build only the database, then start the backend and frontend server in development mode in separate windows through npm:
```bash
# Window 1
docker compose -f docker-compose-db.yaml up --build
```

```bash
# Window 2 (in backend/ directory)
npm run dev
```

```bash
# Window 3 (in frontend/ directory)
npm run dev
```

There are a few notes that one should take notice of:
- Ensure Docker is installed and running on your machine.
- Make sure you have the necessary environment variables set up.
- Check that the required ports are not in use by other applications.
- Backend and Frontend can be run separately without starting the other. However, the database must always be started before running the others.
- Reset the database (running the first string of code above again) to reset the data.


# Tests
Since we are using a test database, we need to run Docker first, then run the tests. However, some tests do not delete data they created and logged into the database. Therefore, if there is any issue, Docker should be restarted because data is cleaned when the database schema is built. The general procedure is to first run the backend server and database as previously instructed. Then we run tests.

```bash
npm test
```

# Chrome Extension - Auto Coach
This section details how to build and use the Chrome Extension to auto-fill participant details into the ICPC Global system.

1. Navigate to chrome_extesion/auto-coach/ from root directory and compile the extension, which should give you a chrome_extesion/auto-coach/dist/ directory :
```bash
# (in chrome_extesion/auto-coach/ directory)
npm run build
```
2. Navigate to chrome://extensions (paste this into your Chrome search bar) and turn on Developer mode. Then click "Load unpacked".
![Chrome Extension](images/image-1.png)

3. "Load unpacked" button will prompt you to select a folder to upload from which to build a Chrome Extension. You should navigate to the location of the recently built dist folder and upload it.
![Loading dist/ folder](images/image-2.png)

4. The Chrome Extension should be functional by now. Here is a [video](https://drive.google.com/file/d/1xJ0_18Eu4yHZIVSpzBAizO9cungVHPIk/view?usp=sharing) demonstrating how to use it.