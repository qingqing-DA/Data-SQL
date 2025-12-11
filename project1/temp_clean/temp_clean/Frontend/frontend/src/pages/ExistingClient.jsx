// frontend/src/pages/ExistingClient.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:6767';

export default function ExistingClient() {
  const [user, setUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [requests, setRequests] = useState([]);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    const fd = new FormData(e.target);
    const username = fd.get('username');
    const password = fd.get('password');

    try {
      const { data } = await axios.post(`${API}/api/auth/login`, {
        username,
        password,
      });
      if (data?.ok) {
        setUser(data.user);
        loadRequests(data.user.id);
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (err) {
      setLoginError(err?.response?.data?.error || 'Login failed');
    }
  }

  async function loadRequests(clientId) {
    const { data } = await axios.get(`${API}/api/requests`, {
      params: { client_id: clientId },
    });
    setRequests(data);
  }

  // client accepts Anna's quote
  async function acceptQuote(id) {
    await axios.post(`${API}/api/requests/${id}/client`, {
      action: 'accept',
    });
    loadRequests(user.id);
  }

  // client sends a counter / negotiation
  async function counterQuote(id) {
    const note = prompt('What would you like to tell Anna? (e.g. lower price, different time)') || '';
    await axios.post(`${API}/api/requests/${id}/client`, {
      action: 'counter',
      client_note: note,
    });
    loadRequests(user.id);
  }

  return (
    <div>
      {!user && (
        <div style={{ background: '#fff', padding: 16, border: '1px solid #ddd', marginBottom: 16 }}>
          <h2>Client Login</h2>
          <form onSubmit={handleLogin} style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
            <input name="username" placeholder="Username or email" />
            <input name="password" type="password" placeholder="Password" />
            <button type="submit">Log in</button>
          </form>
          {loginError && <p style={{ color: 'red', marginTop: 8 }}>{loginError}</p>}
        </div>
      )}

      {user && (
        <div style={{ background: '#fff', padding: 16, border: '1px solid #ddd' }}>
          <h2>Your requests</h2>
          {requests.length === 0 && <p>No requests yet.</p>}
          {requests.map((r) => (
            <div key={r.id} style={{ border: '1px solid #eee', padding: 10, marginBottom: 8 }}>
              <p>
                <strong>Request #{r.id}</strong> – {r.status || 'submitted'}
              </p>
              <p>
                <strong>Address:</strong> {r.service_address}
              </p>
              <p>
                <strong>Anna quote:</strong>{' '}
                {r.quote_price ? `$${r.quote_price}` : '—'} {r.quote_time_window ? `(${r.quote_time_window})` : ''}
              </p>
              <p>
                <strong>Admin note:</strong> {r.admin_note || '—'}
              </p>
              <p>
                <strong>Your note:</strong> {r.client_note || '—'}
              </p>

              {/* only show buttons if Anna already quoted OR status is counter */}
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => acceptQuote(r.id)}>Accept</button>
                <button onClick={() => counterQuote(r.id)}>Send counter note</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
