import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AddLocations from './pages/AddLocation';
import PendingLocations from './pages/PendingLocations';
import LocationFull from './pages/LocationFull';
import Banner from './components/Banner';

export default function App() {
  const [user, setUser] = useState(null);

  async function fetchUser() {
    const res = await fetch('http://localhost:4000/api/auth/me', {
      credentials: 'include',
    });
    if (res.ok) {
      const data = await res.json();
      setUser(data);
    } else {
      setUser(null);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  const handleLogout = async () => {
    await fetch('http://localhost:4000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
  };

  return (
    <>
      <Banner />
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} fetchUser={fetchUser} />} />
        <Route path="/login" element={<Login onAuth={handleLogin} />} />
        <Route path="/signup" element={<Signup onAuth={handleLogin} />} />
        <Route path="/profile" element={<Profile user={user} fetchUser={fetchUser} />} />
        <Route path="/AddLocation" element={<AddLocations user={user} />} />
        <Route path="/pendingLocations" element={<PendingLocations user={user} />} />
        <Route path="/location/:id" element={<LocationFull user={user} refreshUser={fetchUser} />} />
      </Routes>
    </>
  );
}
