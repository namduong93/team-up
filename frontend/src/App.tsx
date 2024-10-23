/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './screens/authentication/login/Landing';
import { Dashboard } from './screens/dashboard/Dashboard';
import { Account } from './screens/account/Account';
import { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { defaultTheme } from './themes/defaultTheme';
import { darkTheme } from './themes/darkTheme';
import { Settings } from './screens/settings/Settings';
import { MultiStepRegoFormProvider } from'./screens/authentication/registration/hooks/useMultiStepRegoForm';

import { TeamProfile } from './screens/student/TeamProfile';
import { CompetitionDetails } from './screens/competition/creation/CompDetails';
import { CompetitionConfirmation } from './screens/competition/creation/CompConfirmation';
import { EmailRecoverForm, EmailSuccess, PasswordCodeRecoverForm, PasswordRecovery } from './screens/authentication/recovery/PasswordRecovery';
import { CompetitionPage } from './screens/competition_staff_page/CompetitionPage';
import { CompIdNavigate } from './screens/competition_staff_page/components/CompIdNavigate';
import { SidebarLayout } from './screens/SidebarLayout';
import { TeamDetails } from './screens/student/TeamDetails';
import { TeamManage } from './screens/student/TeamManage';
import { CompetitionInformation } from './screens/competition/register/CompInformation';
import { CompetitionIndividual } from './screens/competition/register/CompIndividual';
import { MultiStepCompRegoFormProvider } from './screens/competition/register/hooks/useMultiStepCompRegoForm';
import { CompetitionExperience } from './screens/competition/register/CompExperience';
import { StaffDisplay } from './screens/competition_staff_page/staff_page/StaffDisplay';
import { useDashInfo } from './screens/dashboard/hooks/useDashInfo';
import { RoleRegistration } from './screens/authentication/registration/RoleRegistration';
import { AccountInformation } from './screens/authentication/registration/AccountInformation';
import { SiteInformation } from './screens/authentication/registration/SiteInformation';
import { InstitutionInformation } from './screens/authentication/registration/InstitutionInformation';
import { TeamDisplay } from './screens/competition_staff_page/teams_page/TeamDisplay';
import { StudentDisplay } from './screens/competition_staff_page/students_page/StudentDisplay';

function App() {
  const [theme, setTheme ] = useState(defaultTheme)
  
  // TODO: remove this hardcoding after demo pls
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
              <Route path='staff/:compId' element={<StaffDisplay />} />
              <Route path='site/:compId' element={<div>Site</div>} />
              <Route path='manage/:compId' element={<TeamManage />} />
            </Route>

            <Route path='/competition/participant/:compId/' element={<TeamProfile />}>
              <Route index element={<TeamDetails />} />
              <Route path='details' element={<TeamDetails />} />
              <Route path='manage' element={<TeamManage />} />
            </Route>

            <Route path="/dashboard" element={<Dashboard dashInfo={dashInfo} />} />
            <Route path="/account" element={<Account setDashInfo={setDashInfo} />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="/competition/create" element={<CompetitionDetails />} />
          <Route path="/competition/confirmation" element={<CompetitionConfirmation />} />
          
          <Route path="/competition/information/:code?" element={
            <MultiStepCompRegoFormProvider>
              <CompetitionInformation />
            </MultiStepCompRegoFormProvider>} />
          <Route path="/competition/individual/:code?" element={
            <MultiStepCompRegoFormProvider>
              <CompetitionIndividual />
            </MultiStepCompRegoFormProvider>} />
          <Route path="/competition/experience/:code?" element={
          <MultiStepCompRegoFormProvider>
            <CompetitionExperience />
          </MultiStepCompRegoFormProvider>} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
