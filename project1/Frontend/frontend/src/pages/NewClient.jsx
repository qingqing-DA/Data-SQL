// frontend/src/pages/NewClient.jsx
import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:6767';

export default function NewClient() {
  // account form state
  const [acc, setAcc] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });
  const [accountMsg, setAccountMsg] = useState('');
  const [generatedUsername, setGeneratedUsername] = useState('');

  // request form state
  const [req, setReq] = useState({
    client_id: '',
    service_address: '',
    cleaning_type: 'basic',
    rooms: 1,
    preferred_datetime: '',
    budget: '',
    notes: '',
  });
  const [reqMsg, setReqMsg] = useState('');

  // 1) create account
  async function handleAccountSubmit(e) {
    e.preventDefault();
    setAccountMsg('');
    try {
      const { data } = await axios.post(`${API}/api/auth/register-basic`, acc);
      if (data.ok) {
        setAccountMsg(`Account created! Your username is: ${data.username}`);
        setGeneratedUsername(data.username);
        // also store client_id if you want to submit by id later
        setReq((r) => ({
          ...r,
          client_id: data.client_id ?? '',
        }));
      } else {
        setAccountMsg(data.error || 'Registration failed');
      }
    } catch (err) {
      setAccountMsg(
        err?.response?.data?.details ||
          err?.response?.data?.error ||
          'Registration failed'
      );
    }
  }

  // 2) submit cleaning request
  async function handleRequestSubmit(e) {
    e.preventDefault();
    setReqMsg('');

    // we allow either client_id (preferred) or username (in a real app you’d resolve username -> id)
    const fd = new FormData();
    fd.append('client_id', req.client_id || ''); // your backend is okay with this
    fd.append('service_address', req.service_address);
    fd.append('cleaning_type', req.cleaning_type);
    fd.append('rooms', req.rooms);
    fd.append('preferred_datetime', req.preferred_datetime);
    fd.append('budget', req.budget);
    fd.append('notes', req.notes);

    // photos
    if (e.target.photos && e.target.photos.files.length) {
      const files = e.target.photos.files;
      for (let i = 0; i < files.length; i++) {
        fd.append('photos', files[i]);
      }
    }

    try {
      const { data } = await axios.post(`${API}/api/requests`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (data.ok) {
        setReqMsg(
          `Request submitted. ${
            data.auto_quote ? 'Auto quote: $' + data.auto_quote : ''
          }`
        );
        // reset request form except client_id
        setReq((r) => ({
          ...r,
          service_address: '',
          cleaning_type: 'basic',
          rooms: 1,
          preferred_datetime: '',
          budget: '',
          notes: '',
        }));
        e.target.photos.value = ''; // clear file input
      } else {
        setReqMsg(data.error || 'Could not create request');
      }
    } catch (err) {
      setReqMsg(
        err?.response?.data?.details ||
          err?.response?.data?.error ||
          'Could not create request'
      );
    }
  }

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      {/* CREATE ACCOUNT */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 4,
          padding: 16,
        }}
      >
        <h2>Create Client Account</h2>
        <form onSubmit={handleAccountSubmit} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
          <input
            placeholder="Full name"
            value={acc.name}
            onChange={(e) => setAcc({ ...acc, name: e.target.value })}
          />
          <input
            placeholder="Email"
            type="email"
            value={acc.email}
            onChange={(e) => setAcc({ ...acc, email: e.target.value })}
          />
          <input
            placeholder="Phone"
            value={acc.phone}
            onChange={(e) => setAcc({ ...acc, phone: e.target.value })}
          />
          <input
            placeholder="Address"
            value={acc.address}
            onChange={(e) => setAcc({ ...acc, address: e.target.value })}
          />
          <input
            placeholder="Create a password"
            type="password"
            value={acc.password}
            onChange={(e) => setAcc({ ...acc, password: e.target.value })}
          />
          <button
            type="submit"
            style={{ background: '#0f5d7f', color: '#fff', border: 'none', padding: 8 }}
          >
            Create account
          </button>
        </form>
        {accountMsg && (
          <p
            style={{
              marginTop: 10,
              color: accountMsg.startsWith('Account created!') ? 'green' : 'red',
            }}
          >
            {accountMsg}
          </p>
        )}
      </div>

      {/* SUBMIT REQUEST */}
      <div
        style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: 4,
          padding: 16,
        }}
      >
        <h2>Submit Cleaning Request</h2>
        <p style={{ fontSize: 13, color: '#555' }}>
          (Create your account above first — we need your client id.)<br />
          You can upload up to 5 photos.
        </p>
        <form onSubmit={handleRequestSubmit} style={{ display: 'grid', gap: 10, maxWidth: 520 }}>
          {/* show / allow client id */}
          <input
            placeholder="client_id (filled after signup)"
            value={req.client_id}
            onChange={(e) => setReq({ ...req, client_id: e.target.value })}
          />

          <input
            placeholder="Service address"
            value={req.service_address}
            onChange={(e) => setReq({ ...req, service_address: e.target.value })}
          />

          <label>
            Cleaning type{' '}
            <select
              value={req.cleaning_type}
              onChange={(e) => setReq({ ...req, cleaning_type: e.target.value })}
              style={{ marginLeft: 6 }}
            >
              <option value="basic">Basic</option>
              <option value="deep">Deep cleaning</option>
              <option value="move-out">Move-out</option>
            </select>
          </label>

          <input
            type="number"
            min="1"
            placeholder="Number of rooms"
            value={req.rooms}
            onChange={(e) => setReq({ ...req, rooms: e.target.value })}
          />

          <input
            type="datetime-local"
            value={req.preferred_datetime}
            onChange={(e) => setReq({ ...req, preferred_datetime: e.target.value })}
          />

          <input
            placeholder="Proposed budget ($)"
            value={req.budget}
            onChange={(e) => setReq({ ...req, budget: e.target.value })}
          />

          <textarea
            placeholder="Notes / special instructions (pet friendly, etc.)"
            rows={3}
            value={req.notes}
            onChange={(e) => setReq({ ...req, notes: e.target.value })}
          />

          <label>
            Photos (max 5)
            <input name="photos" type="file" accept="image/*" multiple />
          </label>

          <button
            type="submit"
            style={{ background: '#0f5d7f', color: '#fff', border: 'none', padding: 8 }}
          >
            Submit request
          </button>
        </form>
        {reqMsg && (
          <p style={{ marginTop: 8, color: reqMsg.startsWith('Request submitted') ? 'green' : 'red' }}>
            {reqMsg}
          </p>
        )}
      </div>
    </div>
  );
}
