// frontend/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:6767';

export default function AdminDashboard() {
  // auth
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminToken, setAdminToken] = useState('');

  // data
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);

  // error display
  const [clientLoadError, setClientLoadError] = useState('');
  const [requestLoadError, setRequestLoadError] = useState('');

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    const fd = new FormData(e.target);
    const username = fd.get('username');
    const password = fd.get('password');

    try {
      const { data } = await axios.post(`${API}/api/admin/login`, {
        username,
        password,
      });

      setLoggedIn(true);
      setAdminName(data.name || username);
      setAdminToken(data.token || '');
    } catch (err) {
      setLoginError(
        err?.response?.data?.error || 'Admin login failed'
      );
    }
  }

  async function loadClients() {
    setClientLoadError('');
    try {
      const headers = adminToken ? { 'x-admin-token': adminToken } : {};
      const { data } = await axios.get(`${API}/api/clients`, { headers });
      console.log('clients response:', data);
      setClients(data);
    } catch (err) {
      console.error('loadClients error:', err?.response?.data || err.message);
      setClientLoadError(
        err?.response?.data?.error || 'Failed to load clients'
      );
    }
  }

  async function loadRequests() {
    setRequestLoadError('');
    try {
      const headers = adminToken ? { 'x-admin-token': adminToken } : {};
      const { data } = await axios.get(`${API}/api/requests`, { headers });
      console.log('requests response:', data);
      setRequests(data);
    } catch (err) {
      console.error('loadRequests error:', err?.response?.data || err.message);
      setRequestLoadError(
        err?.response?.data?.error || 'Failed to load requests'
      );
    }
  }

  useEffect(() => {
    if (loggedIn) {
      loadClients();
      loadRequests();
    }
  }, [loggedIn]);

  // login view
  if (!loggedIn) {
    return (
      <div
        style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 4,
          padding: 16,
          maxWidth: 520,
        }}
      >
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'grid', gap: 10 }}>
          <input
            name="username"
            defaultValue="anna_johnson"
            placeholder="Admin username"
            style={inputStyle}
          />
          <input
            name="password"
            type="password"
            placeholder="Admin password"
            style={inputStyle}
          />
          <button type="submit" style={btnPrimary}>
            Log in
          </button>
        </form>
        {loginError && (
          <p style={{ color: 'red', marginTop: 8 }}>{loginError}</p>
        )}
        <p style={{ fontSize: 12, color: '#666', marginTop: 6 }}>
          (Use <code>anna_johnson</code> / <code>2001cleaningserviceAJ</code>)
        </p>
      </div>
    );
  }

  // dashboard view
  return (
    <div>
      {/* Clients box */}
      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>
          Admin – Clients {adminName ? `(${adminName})` : ''}
        </h2>
        <button onClick={loadClients} style={btnSmall}>
          Refresh Clients
        </button>
        {clientLoadError && (
          <p style={{ color: 'red', marginTop: 6 }}>{clientLoadError}</p>
        )}
        <table
          style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}
        >
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Username</th>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.id}>
                <td style={td}>{c.id}</td>
                <td style={td}>{c.username}</td>
                <td style={td}>{c.name}</td>
                <td style={td}>{c.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Requests box */}
      <div style={panel}>
        <h2 style={{ marginTop: 0 }}>Admin – Service Requests</h2>
        <button onClick={loadRequests} style={btnSmall}>
          Refresh Requests
        </button>
        {requestLoadError && (
          <p style={{ color: 'red', marginTop: 6 }}>{requestLoadError}</p>
        )}

        {requests.map((r) => (
          <div
            key={r.id}
            style={{
              border: '1px solid #eee',
              borderRadius: 4,
              padding: 10,
              marginTop: 8,
              background: '#fdfdfd',
            }}
          >
            <p>
              <strong>#{r.id}</strong> – {r.cleaning_type || '—'} –{' '}
              {r.status || 'pending'}
            </p>
            <p>
              <strong>Client:</strong> {r.client_name} ({r.client_email})
            </p>
            <p>
              <strong>Address:</strong> {r.service_address}
            </p>
            {r.quote_price && (
              <p>
                <strong>Quote:</strong> ${r.quote_price}{' '}
                {r.quote_time_window ? `(${r.quote_time_window})` : ''}
              </p>
            )}
            <p>
              <strong>Notes:</strong> {r.admin_note || r.notes || '—'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* styles */
const inputStyle = {
  padding: '6px 8px',
  border: '1px solid #ccc',
  borderRadius: 3,
};

const btnPrimary = {
  background: '#0f5d7f',
  color: '#fff',
  border: 'none',
  padding: '7px 12px',
  borderRadius: 3,
  cursor: 'pointer',
};

const panel = {
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: 4,
  padding: 16,
  marginBottom: 16,
};

const th = {
  textAlign: 'left',
  borderBottom: '1px solid #ddd',
  padding: '4px 6px',
};
const td = {
  borderBottom: '1px solid #f4f4f4',
  padding: '4px 6px',
};
const btnSmall = {
  background: '#0f5d7f',
  color: '#fff',
  border: 'none',
  padding: '4px 10px',
  borderRadius: 3,
  cursor: 'pointer',
  fontSize: 12,
};
