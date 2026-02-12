import React, { useState, useEffect } from 'react';
import { auth } from "./services/firebase";
// Fixed: Capital 'C' and dot './' to match your explorer
import Login from './Components/Login';
import HQLayout from './Components/HQLayout';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Engaging in the moment: showing a loader instead of a white screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center">
        <div className="text-red-600 font-black tracking-widest animate-pulse">
          FAB SYSTEMS LOADING...
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {user ? (
        <HQLayout user={user} />
      ) : (
        <Login onLoginSuccess={(u) => setUser(u)} />
      )}
    </div>
  );
}

export default App;