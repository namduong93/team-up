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
import { christmasTheme } from './themes/christmasTheme';
import { colourblindTheme } from './themes/colourblindTheme';
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
import { StaffManage } from './screens/competition_staff_page/manage_page/StaffManage';
import { AttendeesDisplay } from './screens/competition_staff_page/attendees_page/AttendeesPage';

const themeMap = {
  default: defaultTheme,
  dark: darkTheme,
  christmas: christmasTheme,
  colourblind: colourblindTheme,
} as const;

function App() {
  const [theme, setTheme ] = useState<keyof typeof themeMap>("default");
  const currentTheme = themeMap[theme];

  // use local storage for theme preference (change later)
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme && savedTheme in themeMap) {
      setTheme(savedTheme as keyof typeof themeMap);
    } else {
      setTheme("default"); // Fallback to default if not found
    }
    
    // Add event listener for storage changes
    const handleStorageChange = () => {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme && savedTheme in themeMap) {
        setTheme(savedTheme as keyof typeof themeMap);
      } else {
        setTheme("default"); // Fallback to default if not found
      }
    };

    // Attach event listener
    window.addEventListener("storage", handleStorageChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []); 

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [dashInfo, setDashInfo] = useDashInfo();

  return (
    <ThemeProvider theme={currentTheme}>
      <Router>
        <div style={{ background: currentTheme.background}}>

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
              <Route path='site/:compId' element={<AttendeesDisplay />} />
              <Route path='manage/:compId' element={<StaffManage />} />
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
