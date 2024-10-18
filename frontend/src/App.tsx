/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './screens/login/Landing';
// import { Login } from './screens/login/Login';
// import { SignUp } from './screens/login/SignUp';
import { Dashboard } from './screens/Dashboard/Dashboard';
import { Account } from './screens/Account';
import { RoleRegistration } from './screens/login/RoleRegistration';
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
import { EmailRecoverForm, EmailSuccess, PasswordCodeRecoverForm, PasswordRecovery } from './screens/login/PasswordRecovery';
import { CompetitionPage } from './screens/staff/CompetitionPage/CompetitionPage';
import { CompIdNavigate } from './screens/staff/CompetitionPage/CompIdNavigate';
import { SidebarLayout } from './screens/SidebarLayout';
import { useDashInfo } from './screens/Dashboard/useDashInfo';
import { CompetitionInformation } from './screens/competition/CompInformation';
import { CompetitionIndividual } from './screens/competition/CompIndividual';
import { MultiStepCompRegoFormProvider } from './screens/competition/MultiStepCompRegoForm';
import { CompetitionExperience } from './screens/competition/CompExperience';

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

  const [dashInfo, setDashInfo] = useDashInfo();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div style={{ background: isDarkTheme ? darkTheme.background : defaultTheme.background}}>

        </div>
        <Routes>
          <Route path="/" element={<Landing />} />

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
          <Route path='/password/recovery' element={<PasswordRecovery />}>
            <Route path='email' element={ <EmailRecoverForm /> } />
            <Route path='email/success' element={ <EmailSuccess /> } />
            <Route path='reset/:code' element={ <PasswordCodeRecoverForm /> } />
          </Route>

          <Route element={<SidebarLayout cropState={false} sidebarInfo={dashInfo} />}>
            <Route path='/competition/page/:compId' element={ <CompIdNavigate route='/competition/page/teams' /> } />
            <Route path='/competition/page' element={ <Navigate to='/dashboard' /> } />
            <Route path='/competition/page/' element={ <CompetitionPage /> }>
              <Route index element={ <Navigate to='/dashboard' /> } />
              <Route path='teams/:compId' element={<TeamDisplay />} />
              <Route path='students/:compId' element={<StudentDisplay />} />
              <Route path='staff/:compId' element={<div>Staff</div>} />
              <Route path='site/:compId' element={<div>Site</div>} />
            </Route>

            <Route path="/dashboard" element={<Dashboard dashInfo={dashInfo} />} />
            <Route path="/account" element={<Account setDashInfo={setDashInfo} />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/competition/:compId/:role" element={<Competition />} />
            <Route path="/competition/participant" element={<TeamProfile />} />
          </Route>

          <Route path="/competition/create" element={<CompetitionDetails />} />
          <Route path="/competition/confirmation" element={<CompetitionConfirmation />} />
          <Route path="/competition/information" element={
            <MultiStepCompRegoFormProvider>
              <CompetitionInformation />
            </MultiStepCompRegoFormProvider>} />
          <Route path="/competition/individual" element={
            <MultiStepCompRegoFormProvider>
              <CompetitionIndividual />
            </MultiStepCompRegoFormProvider>} />
          <Route path="/competition/experience" element={
          <MultiStepCompRegoFormProvider>
            <CompetitionExperience />
          </MultiStepCompRegoFormProvider>} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
