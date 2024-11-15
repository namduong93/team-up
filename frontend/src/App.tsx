/* eslint-disable @typescript-eslint/no-unused-vars */
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { defaultTheme } from "./themes/defaultTheme";
import { darkTheme } from "./themes/darkTheme";
import { christmasTheme } from "./themes/christmasTheme";
import { colourblindTheme } from "./themes/colourblindTheme";
import { Settings } from "./screens/settings/Settings";

import { TeamProfile } from "./screens/student/TeamProfile";
import { useDashInfo } from "./screens/dashboard/hooks/useDashInfo";
import { Landing } from "./screens/auth/Login/Landing";
import { MultiStepRegoFormProvider } from "./screens/auth/RegisterForm/MultiStepRegoFormContext";
import { RoleRegistration } from "./screens/auth/RegisterForm/subroutes/RoleSelect/RoleRegistration";
import { AccountInformation } from "./screens/auth/RegisterForm/subroutes/AccountDataInput/AccountInformation";
import { SiteInformation } from "./screens/auth/RegisterForm/subroutes/SiteDataInput/SiteInformation";
import { InstitutionInformation } from "./screens/auth/RegisterForm/subroutes/InstitutionDataInput/InstitutionInformation";
import { PasswordCodeRecoverForm, PasswordRecovery } from "./screens/auth/PasswordRecovery/PasswordRecovery";
import { EmailRecoverForm } from "./screens/auth/PasswordRecovery/subroutes/EmailForm/EmailRecoverForm";
import { EmailSuccess } from "./screens/auth/PasswordRecovery/subroutes/EmailSuccess/EmailSuccess";
import { SidebarLayout } from "./screens/SidebarLayout";
import { CompIdNavigate } from "./screens/competition/staff_pages/CompetitionPage/components/CompIdNavigate";
import { CompetitionPage } from "./screens/competition/staff_pages/CompetitionPage/CompetitionPage";
import { TeamDisplay } from "./screens/competition/staff_pages/CompetitionPage/subroutes/TeamPage/TeamDisplay";
import { StudentDisplay } from "./screens/competition/staff_pages/CompetitionPage/subroutes/StudentsPage/StudentDisplay";
import { StaffDisplay } from "./screens/competition/staff_pages/CompetitionPage/subroutes/StaffPage/StaffDisplay";
import { AttendeesDisplay } from "./screens/competition/staff_pages/CompetitionPage/subroutes/AttendeesPage/AttendeesPage";
import { StaffActionCard } from "./screens/competition/staff_pages/CompetitionPage/subroutes/ManagePage/StaffActionCard";
import { TeamDetails } from "./screens/student/subroutes/TeamDetails";
import { TeamManage } from "./screens/student/subroutes/TeamManage";
import { Dashboard } from "./screens/dashboard/Dashboard";
import { StaffAccounts } from "./screens/StaffAccess/StaffAccounts";
import { Account } from "./screens/Account/Account";
import { CompetitionDetails } from "./screens/competition/staff_pages/creation/CompDataInput/CompDetails";
import { CompetitionConfirmation } from "./screens/competition/staff_pages/creation/CompDataConfirmation/CompConfirmation";
import { MultiStepCompRegoFormProvider } from "./screens/competition/register/RegisterForm/MultiStepCompRegoFormProvider";
import { CompetitionInformation } from "./screens/competition/register/RegisterForm/subroutes/CompInformation/CompInformation";
import { CompetitionIndividual } from "./screens/competition/register/RegisterForm/subroutes/CompIndividualInput/CompIndividual";
import { CompetitionExperience } from "./screens/competition/register/RegisterForm/subroutes/CompExperienceInput/CompExperience";
import { StaffRoleRegistration } from "./screens/competition/register/StaffRegisterForm/StaffRoleRegistration";


const themeMap = {
  default: defaultTheme,
  dark: darkTheme,
  christmas: christmasTheme,
  colourblind: colourblindTheme,
} as const;

function App() {
  const [theme, setTheme] = useState<keyof typeof themeMap>("default");
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
        <div style={{ background: currentTheme.background }}></div>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route
            path="/roleregistration"
            element={
              <MultiStepRegoFormProvider>
                <RoleRegistration />
              </MultiStepRegoFormProvider>
            }
          />
          <Route
            path="/accountinformation"
            element={
              <MultiStepRegoFormProvider>
                <AccountInformation />
              </MultiStepRegoFormProvider>
            }
          />
          <Route
            path="/siteinformation"
            element={
              <MultiStepRegoFormProvider>
                <SiteInformation />
              </MultiStepRegoFormProvider>
            }
          />
          <Route
            path="/institutioninformation"
            element={
              <MultiStepRegoFormProvider>
                <InstitutionInformation />
              </MultiStepRegoFormProvider>
            }
          />
          {/* coach page should be split up subrouted TeamsView and StudentsView in the future */}
          <Route path="/password/recovery" element={<PasswordRecovery />}>
            <Route path="email" element={<EmailRecoverForm />} />
            <Route path="email/success" element={<EmailSuccess />} />
            <Route path="reset/:code" element={<PasswordCodeRecoverForm />} />
          </Route>

          <Route
            element={<SidebarLayout cropState={false} sidebarInfo={dashInfo} />}
          >
            <Route
              path="/competition/page/:compId"
              element={<CompIdNavigate route="/competition/page/teams" />}
            />
            <Route
              path="/competition/page"
              element={<Navigate to="/dashboard" />}
            />
            <Route path="/competition/page/" element={<CompetitionPage />}>
              <Route index element={<Navigate to="/dashboard" />} />
              <Route path="teams/:compId" element={<TeamDisplay />} />
              <Route path="students/:compId" element={<StudentDisplay />} />
              <Route path="staff/:compId" element={<StaffDisplay />} />
              <Route path="site/:compId" element={<AttendeesDisplay />} />
              <Route path="manage/:compId" element={<StaffActionCard />} />
            </Route>

            <Route
              path="/competition/participant/:compId/"
              element={<TeamProfile />}
            >
              <Route index element={<TeamDetails />} />
              <Route path="details" element={<TeamDetails />} />
              <Route path="manage" element={<TeamManage />} />
            </Route>

            <Route
              path="/dashboard"
              element={<Dashboard dashInfo={dashInfo} />}
            />
            <Route
              path="/staffAccounts"
              element={<StaffAccounts />}
            />
            <Route
              path="/account"
              element={<Account setDashInfo={setDashInfo} />}
            />
            <Route path="/settings" element={<Settings />} />
          </Route>

          <Route path="/competition/create" element={<CompetitionDetails />} />
          <Route
            path="/competition/confirmation"
            element={<CompetitionConfirmation />}
          />

          <Route
            path="/competition/information/:code?"
            element={
              <MultiStepCompRegoFormProvider>
                <CompetitionInformation />
              </MultiStepCompRegoFormProvider>
            }
          />
          <Route
            path="/competition/individual/:code?"
            element={
              <MultiStepCompRegoFormProvider>
                <CompetitionIndividual />
              </MultiStepCompRegoFormProvider>
            }
          />
          <Route
            path="/competition/experience/:code?"
            element={
              <MultiStepCompRegoFormProvider>
                <CompetitionExperience />
              </MultiStepCompRegoFormProvider>
            }
          />

          <Route
            path="/competition/staff/register/:code?"
            element={<StaffRoleRegistration />}
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
