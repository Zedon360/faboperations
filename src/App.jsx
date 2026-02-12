import React, { useState, useEffect } from 'react';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Login from './components/Login';
import HQLayout from './components/HQLayout'; // Tutaihamishia kodi ya Dashboard hapa

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="bg-[#0b0f1a] h-screen flex items-center justify-center text-red-600 font-black">FAB LOADING...</div>;

  return (
    <>
      {!user ? (
        <Login onLoginSuccess={(u) => setUser(u)} />
      ) : (
        <HQLayout user={user} />
      )}
    </>
  );
}

export default App;