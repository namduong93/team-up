import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './screens/login/Landing';
import { Login } from './screens/login/Login';
import { SignUp } from './screens/login/SignUp';
import { Dashboard } from './screens/Dashboard';
import { Account } from './screens/Account';
import { RoleRegistration } from './screens/login/RoleRegistration';
import { Settings } from './screens/settings/Settings';

function App() {
  const name = "Name";
  const affiliation = "UNSW";
  const competitions = [
    { compName: 'ICPC 2024', location: 'Kazakhstan', compDate: 'Sep 2024', compRole: 'Participant', compCountdown: 25 },
    { compName: 'ICPC 2024', location: 'USA', compDate: 'Nov 2024', compRole: 'Coach', compCountdown: 40 },
    { compName: 'ICPC 2024', location: 'India', compDate: 'Dec 2024', compRole: 'Admin', compCountdown: 15 },
    { compName: 'ICPC 2024', location: 'Kazakhstan', compDate: 'Sep 2024', compRole: 'Participant', compCountdown: 25 },
    { compName: 'ICPC 2024', location: 'USA', compDate: 'Nov 2024', compRole: 'Coach', compCountdown: 40 },
    { compName: 'ICPC 2024', location: 'India', compDate: 'Dec 2024', compRole: 'Admin', compCountdown: 15 },
    { compName: 'ICPC 2024', location: 'Kazakhstan', compDate: 'Sep 2024', compRole: 'Participant', compCountdown: 25 },
    { compName: 'ICPC 2024', location: 'USA', compDate: 'Nov 2024', compRole: 'Coach', compCountdown: 40 },
    { compName: 'ICPC 2024', location: 'India', compDate: 'Dec 2024', compRole: 'Admin', compCountdown: 15 },
  ];

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/roleregistration" element={<RoleRegistration />} />
        <Route path="/dashboard" element={<Dashboard name={name} affiliation={affiliation} competitions={competitions} />} />
        <Route path="/account" element={<Account />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
