/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClinicalSupport from './pages/ClinicalSupport';
import FieldReport from './pages/FieldReport';
import Logistics from './pages/Logistics';
import AICenter from './pages/AICenter';
import MapModule from './pages/MapModule';
import VolunteerSystem from './pages/VolunteerSystem';
import PublicHealth from './pages/PublicHealth';
import Reports from './pages/Reports';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Scanner from './pages/Scanner';
import './lib/i18n';

import { useAppContext } from './context/AppContext';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="clinical" element={<ClinicalSupport />} />
            <Route path="field" element={<FieldReport />} />
            <Route path="logistics" element={<Logistics />} />
            <Route path="ai" element={<AICenter />} />
            <Route path="map" element={<MapModule />} />
            <Route path="volunteer" element={<VolunteerSystem />} />
            <Route path="public-health" element={<PublicHealth />} />
            <Route path="reports" element={<Reports />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="scanner" element={<Scanner />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
