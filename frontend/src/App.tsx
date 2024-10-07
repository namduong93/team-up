import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './screens/login/Landing';
import { Login } from './screens/login/Login';
import { SignUp } from './screens/login/SignUp';
import { Dashboard } from './screens/Dashboard';
import { Account } from './screens/Account';
import { RoleRegistration } from './screens/login/RoleRegistration';
import { Settings } from './screens/settings/Settings';
import { Competition } from './screens/competition/Competition';
import { AccountInformation } from './screens/login/AccountInformation';
import { SiteInformation } from './screens/login/SiteInformation';
import { InstitutionInformation } from './screens/login/InstitutionInformation';

function App() {
  const name = "Name";
  const affiliation = "UNSW";
  const competitions = [
    { compName: 'ICPC 2024', location: 'Kazakhstan', compDate: 'Sep 2024', compRole: 'Participant', compCountdown: 25, compId: 'abc1'},
    { compName: 'ICPC 2024', location: 'USA', compDate: 'Nov 2024', compRole: 'Coach', compCountdown: 40, compId: 'abc2'},
    { compName: 'ICPC 2024', location: 'India', compDate: 'Dec 2024', compRole: 'Admin', compCountdown: 15, compId: 'abc9'},
    { compName: 'ICPC 2024', location: 'Kazakhstan', compDate: 'Sep 2024', compRole: 'Participant', compCountdown: 25, compId: 'abc3'},
    { compName: 'ICPC 2024', location: 'USA', compDate: 'Nov 2024', compRole: 'Coach', compCountdown: 40, compId: 'abc4'},
    { compName: 'ICPC 2024', location: 'India', compDate: 'Dec 2024', compRole: 'Admin', compCountdown: 15, compId: 'abc5'},
    { compName: 'ICPC 2024', location: 'Kazakhstan', compDate: 'Sep 2024', compRole: 'Participant', compCountdown: 25, compId: 'abc6'},
    { compName: 'ICPC 2024', location: 'USA', compDate: 'Nov 2024', compRole: 'Site-Coordinator', compCountdown: 40, compId: 'abc7'},
    { compName: 'ICPC 2024', location: 'India', compDate: 'Dec 2024', compRole: 'Admin', compCountdown: 15, compId: 'abc8'},
  ];

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/roleregistration" element={<RoleRegistration />} />
        <Route path="/accountinformation" element={<AccountInformation />} />
        <Route path="/siteinformation" element={<SiteInformation />} />
        <Route path="/institutioninformation" element={<InstitutionInformation />} />
        <Route path="/dashboard" element={<Dashboard name={name} affiliation={affiliation} competitions={competitions} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/competition/:compId/:role" element={<Competition />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
