import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';

import LandingPage from './components/views/LandingPage/LandingPage'
import LoginPage from './components/views/LoginPage/LoginPage';
import SignUp from './components/views/SignUp/SignUp';

function App() {
  return (
    <Router>
    <div>
      <Routes>
        <Route  path="/" element={<LandingPage />} />
        <Route  path="/login" element={<LoginPage />} />
        <Route  path="/signUp" element={<SignUp />} />
      </Routes>
    </div>
  </Router>
  );
}

export default App;
