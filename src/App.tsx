import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WelcomeScreen } from './components/welcome/WelcomeScreen';
import { PhoneInput } from './components/auth/PhoneInput';
import { ServicesScreen } from './components/services/ServicesScreen';
import { CalendarScreen } from './components/booking/CalendarScreen';
import { ConfirmationScreen } from './components/booking/ConfirmationScreen';
import { AppointmentsList } from './components/appointments/AppointmentsList';
import { useAuthStore } from './store/auth';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/phone" element={<PhoneInput />} />
        <Route 
          path="/appointments" 
          element={
            isAuthenticated ? (
              <AppointmentsList />
            ) : (
              <Navigate to="/phone" replace />
            )
          } 
        />
        <Route 
          path="/services" 
          element={
            isAuthenticated ? (
              <ServicesScreen />
            ) : (
              <Navigate to="/phone" replace />
            )
          } 
        />
        <Route 
          path="/calendar/:serviceId" 
          element={
            isAuthenticated ? (
              <CalendarScreen />
            ) : (
              <Navigate to="/phone" replace />
            )
          } 
        />
        <Route 
          path="/confirm" 
          element={
            isAuthenticated ? (
              <ConfirmationScreen />
            ) : (
              <Navigate to="/phone" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;