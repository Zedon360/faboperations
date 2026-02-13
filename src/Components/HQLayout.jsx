import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

// Ensuring paths are lowercase and relative
import DailyReport from '../portals/station/DailyReport';
import FleetManager from '../portals/fleet/FleetManager';

const HQLayout = ({ user }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <div style={{ backgroundColor: '#0f172a', padding: '40px', borderRadius: '24px', border: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: '800', color: 'white' }}>SYSTEM OVERVIEW</h2>
            <div style={{ height: '2px', width: '60px', background: '#dc2626', margin: '15px 0' }}></div>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
              Welcome back, Master Admin {user?.displayName}.
            </p>
          </div>
        );
      case 'stations':
        return <DailyReport user={user} />;
      case 'fleet':
        return <FleetManager user={user} />;
      default:
        return <div style={{ color: 'white' }}>Select a module from the sidebar.</div>;
    }
  };

  const navButtonStyle = (tabName) => ({
    background: activeTab === tabName ? 'rgba(220, 38, 38, 0.15)' : 'transparent',
    border: 'none',
    borderLeft: activeTab === tabName ? '4px solid #dc2626' : '4px solid transparent',
    color: activeTab === tabName ? 'white' : '#64748b',
    textAlign: 'left',
    padding: '16px 20px',
    marginBottom: '8px',
    borderRadius: '0 12px 12px 0',
    cursor: 'pointer',
    fontWeight: '900',
    fontSize: '14px',
    letterSpacing: '1px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    transition: 'all 0.2s ease',
    width: '100%',
    textTransform: 'uppercase'
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f1a', color: 'white', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ 
        width: isSidebarOpen ? '300px' : '85px', 
        backgroundColor: '#0f172a', 
        borderRight: '1px solid #1e293b',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <div style={{ padding: '30px 25px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ minWidth: '35px', height: '35px', background: '#dc2626', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px' }}>⚡</div>
          {isSidebarOpen && <h1 style={{ color: '#dc2626', fontStyle: 'italic', fontWeight: '900', margin: 0, fontSize: '24px' }}>FAB HQ</h1>}
        </div>
        
        <nav style={{ flex: 1, paddingRight: '10px' }}>
          <button onClick={() => setActiveTab('dashboard')} style={navButtonStyle('dashboard')}>
            <span>📊</span> {isSidebarOpen && 'Dashboard'}
          </button>

          <button onClick={() => setActiveTab('stations')} style={navButtonStyle('stations')}>
            <span>🔌</span> {isSidebarOpen && 'Stations Management'}
          </button>

          <button onClick={() => setActiveTab('fleet')} style={navButtonStyle('fleet')}>
            <span>🚚</span> {isSidebarOpen && 'Fleet Management'}
          </button>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #1e293b' }}>
          <button 
            onClick={handleLogout}
            style={{ 
              backgroundColor: '#dc2626', 
              color: 'white', 
              border: 'none', 
              width: '100%', 
              padding: '14px', 
              borderRadius: '12px', 
              cursor: 'pointer', 
              fontWeight: '900', 
              textTransform: 'uppercase'
            }}
          >
            {isSidebarOpen ? 'Log Out' : 'OFF'}
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        <header style={{ 
          height: '80px', 
          borderBottom: '1px solid #1e293b', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 40px',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            style={{ background: 'transparent', border: '1px solid #334155', color: '#94a3b8', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}
          >
            {isSidebarOpen ? 'COLLAPSE' : 'EXPAND'}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '800' }}>{user?.displayName}</p>
              <p style={{ margin: 0, fontSize: '10px', color: '#dc2626', fontWeight: 'bold' }}>SECURE ACCESS</p>
            </div>
            <img src={user?.photoURL} alt="User" style={{ width: '45px', height: '45px', borderRadius: '12px', border: '2px solid #dc2626' }} />
          </div>
        </header>

        <main style={{ padding: '50px', overflowY: 'auto' }}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default HQLayout;