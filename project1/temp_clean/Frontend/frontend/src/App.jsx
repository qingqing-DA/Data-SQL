// src/App.jsx
import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import ExistingClient from './pages/ExistingClient';
import AdminDashboard from './pages/AdminDashboard';
import NewClient from './pages/NewClient';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

export default function App() {
  const [tab, setTab] = useState('new');

 let content;
if (tab === 'info') {
  content = <Info />;
} else if (tab === 'new') {
  content = <NewClient />;
} else if (tab === 'existing') {
  content = <ExistingClient />;
} else if (tab === 'admin') {
  content = <AdminDashboard />;
} else {
  content = <Info />; // fallback just in case
}


  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <header style={{ background: '#0f5d7f', color: '#fff', padding: '14px 22px' }}>
        <h1 style={{ margin: 0 }}>Welcome to Anna Cleaning Service</h1>
        <p style={{ margin: 0, fontSize: 14 }}>Anna Johnson Cleaning Service</p>
      </header>

      <nav
        style={{
          display: 'flex',
          gap: 8,
          padding: '10px 22px',
          background: '#fff',
          borderBottom: '1px solid #ddd',
        }}
      >
        <button onClick={() => setTab('new')} style={btnStyle(tab === 'new')}>
          New Client
        </button>
        <button onClick={() => setTab('existing')} style={btnStyle(tab === 'existing')}>
          Existing Client
        </button>
        <button onClick={() => setTab('admin')} style={btnStyle(tab === 'admin')}>
          Admin / Dashboard
        </button>
        <button onClick={() => setTab('info')} style={btnStyle(tab === 'info')}>
          Info
        </button>
      </nav>

      <main style={{ padding: '20px 22px' }}>
        {tab !== 'admin' && stripePromise ? (
          <Elements stripe={stripePromise}>{content}</Elements>
        ) : (
          content
        )}
      </main>
    </div>
  );
}

function btnStyle(active) {
  return {
    padding: '6px 12px',
    border: active ? '1px solid #0f5d7f' : '1px solid transparent',
    background: active ? '#e9f4f9' : 'transparent',
    borderRadius: 4,
    cursor: 'pointer',
  };
}
