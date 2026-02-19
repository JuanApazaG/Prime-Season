import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/admin/Login';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import WeekManager from './pages/admin/WeekManager';
import GoalEditor from './pages/admin/GoalEditor';
import ProtectedRoute from './router/ProtectedRoute';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="semanas" element={<WeekManager />} />
        <Route path="metas" element={<GoalEditor />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
