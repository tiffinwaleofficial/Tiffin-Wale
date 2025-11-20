import { useEffect, useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Partners from '@/pages/Partners';
import Customers from '@/pages/Customers';
import Orders from '@/pages/Orders';
import Subscriptions from '@/pages/Subscriptions';
import Support from '@/pages/Support';
import Menu from '@/pages/Menu';
import Revenue from '@/pages/Revenue';
import Profile from '@/pages/Profile';
import Configuration from '@/pages/Configuration';
import Payments from '@/pages/Payments';
import Reviews from '@/pages/Reviews';
import Feedback from '@/pages/Feedback';
import Layout from '@/components/Layout';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="partners" element={<Partners />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="support" element={<Support />} />
            <Route path="menu" element={<Menu />} />
            <Route path="revenue" element={<Revenue />} />
            <Route path="profile" element={<Profile />} />
            <Route path="configuration" element={<Configuration />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="feedback" element={<Feedback />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;