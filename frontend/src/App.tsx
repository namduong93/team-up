/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './screens/login/Landing';
// import { Login } from './screens/login/Login';
// import { SignUp } from './screens/login/SignUp';
import { Dashboard } from './screens/Dashboard';
import { Account } from './screens/Account';
import { RoleRegistration } from './screens/login/RoleRegistration';
import { CoachPage } from './screens/staff/CoachPage/CoachPage';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './themes/defaultTheme';
import { darkTheme } from './themes/darkTheme';
import { Settings } from './screens/settings/Settings';
import { Competition } from './screens/competition/Competition';
import { AccountInformation } from './screens/login/AccountInformation';
import { SiteInformation } from './screens/login/SiteInformation';
import { InstitutionInformation } from './screens/login/InstitutionInformation';
import { MultiStepRegoFormProvider } from'./screens/login/MultiStepRegoForm';
import { TeamDisplay } from './screens/staff/CoachPage/TeamDisplay';
import { StudentDisplay } from './screens/staff/CoachPage/StudentDisplay';
import { TeamProfile } from './screens/student/TeamProfile';
import { CompetitionDetails } from './screens/competition/CompDetails';
import { CompetitionConfirmation } from './screens/competition/CompConfirmation';


function App() {
  const [theme, setTheme ] = useState(defaultTheme)
  
  const name = "Name";
  const affiliation = "UNSW";
  const competitions = [
    {
        compName: 'ICPC 2024',
        location: 'Kazakhstan',
        compDate: new Date('2024-09-01').toISOString(),
        roles: ['Participant'],
        compId: 'abc1',
        compCreationDate: new Date('2024-04-01').toISOString(),
    },
    {
        compName: 'ICPC 2024',
        location: 'USA',
        compDate: new Date('2024-11-01').toISOString(),
        roles: ['Coach'],
        compId: 'abc2',
        compCreationDate: new Date('2024-07-01').toISOString(),
    },
    {
        compName: 'ICPC 2024',
        location: 'India',
        compDate: new Date('2024-12-01').toISOString(),
        roles: ['Admin'],
        compId: 'abc9',
        compCreationDate: new Date('2024-08-01').toISOString(),
    },
    {
        compName: 'ICPC 2025',
        location: 'Kazakhstan',
        compDate: new Date('2025-09-01').toISOString(),
        roles: ['Participant'],
        compId: 'abc3',
        compCreationDate: new Date('2024-10-07').toISOString(),
    },
    {
        compName: 'ICPC 2022',
        location: 'USA',
        compDate: new Date('2022-11-01').toISOString(),
        roles: ['Coach', 'Site-Coordinator'],
        compId: 'abc4',
        compCreationDate: new Date('2022-07-01').toISOString(),
    },
    {
        compName: 'ICPC 2023',
        location: 'India',
        compDate: new Date('2023-12-01').toISOString(),
        roles: ['Admin'],
        compId: 'abc5',
        compCreationDate: new Date('2023-08-01').toISOString(),
    },
    {
        compName: 'ICPC 2024',
        location: 'Kazakhstan',
        compDate: new Date('2024-09-01').toISOString(),
        roles: ['Participant'],
        compId: 'abc6',
        compCreationDate: new Date('2024-05-01').toISOString(),
    },
    {
        compName: 'ICPC 2024',
        location: 'USA',
        compDate: new Date('2024-11-01').toISOString(),
        roles: ['Site-Coordinator'],
        compId: 'abc7',
        compCreationDate: new Date('2024-07-01').toISOString(),
    },
    {
        compName: 'ICPC 2024',
        location: 'India',
        compDate: new Date('2024-12-01').toISOString(),
        roles: ['Admin'],
        compId: 'abc8',
        compCreationDate: new Date('2024-08-01').toISOString(),
    }
];

  

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // use local storage for theme preference (change later)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkTheme(savedTheme === "dark" ? true : false);

    // update when settings changes
    const handleStorageChange = () => {
      const updatedTheme = localStorage.getItem("theme");
      setIsDarkTheme(updatedTheme === "dark");
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => setTheme(isDarkTheme ? darkTheme : defaultTheme), [isDarkTheme]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ background: isDarkTheme ? darkTheme.background : defaultTheme.background}}>

        </div>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} /> */}
          {/* coach page should be split up subrouted TeamsView and StudentsView in the future */}
              {/* <Route path="/coach/page" element={<TeamsView />} /> */}

          <Route path="/roleregistration" element={
            <MultiStepRegoFormProvider>
              <RoleRegistration />
            </MultiStepRegoFormProvider>
          } />
          <Route path="/accountinformation" element={
            <MultiStepRegoFormProvider>
              <AccountInformation />
            </MultiStepRegoFormProvider>
          } />
          <Route path="/siteinformation" element={
            <MultiStepRegoFormProvider>
              <SiteInformation />
            </MultiStepRegoFormProvider>
          } />
          <Route path="/institutioninformation" element={
            <MultiStepRegoFormProvider>
              <InstitutionInformation />
            </MultiStepRegoFormProvider>
          } />
          {/* coach page should be split up subrouted TeamsView and StudentsView in the future */}
          <Route path="/coach/page" element={<CoachPage />}>
              <Route index element={ <Navigate to='/coach/page/teams' /> } />
              <Route path='teams' element={ <TeamDisplay /> } />
              <Route path='students' element={ <StudentDisplay /> } />
            </Route>
          <Route path="/dashboard" element={<Dashboard competitions={competitions} />} />
          <Route path="/account" element={<Account />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/competition/:compId/:role" element={<Competition />} />
          <Route path="/competition/participant" element={<TeamProfile />} />

          <Route path="/competitiondetails" element={<CompetitionDetails />} />
          <Route path="/competitionconfirmation" element={<CompetitionConfirmation />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
