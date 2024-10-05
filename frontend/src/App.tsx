import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Landing } from './screens/login/Landing';
import { Login } from './screens/login/Login';
import { SignUp } from './screens/login/SignUp';
import { Dashboard } from './screens/Dashboard';
import { Profile } from './screens/Profile';
import { RoleRegistration } from './screens/login/RoleRegistration';
import { TeamsView } from './screens/staff/TeamsView';


function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/roleregistration" element={<RoleRegistration />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* coach page should be split up subrouted TeamsView and StudentsView in the future */}
        <Route path="/coach/page" element={<TeamsView />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
