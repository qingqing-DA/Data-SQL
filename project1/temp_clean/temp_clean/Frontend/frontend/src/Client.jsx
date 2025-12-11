// src/Clients.jsx
import React, { useEffect, useState } from 'react';
import api from './api';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

export default function Clients() {
  // --------- your old list + create ----------
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });

  async function load() {
    try {
      const { data } = await api.get('/api/clients');
      setRows(data);
    } catch (err) {
      console.log('could not load clients (this is ok if you don’t have /api/clients yet)');
    }
  }

  async function createClient(e) {
    e.preventDefault();
    await api.post('/api/clients', form);
    setForm({ name: '', email: '', phone: '', address: '' });
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Clients</h2>
      <form onSubmit={createClient} style={{ display: 'grid', gap: 8, maxWidth: 420 }}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Address" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
        <button>Save Client</button>
      </form>

      <table border="1" cellPadding="6" style={{ marginTop: 20 }}>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td>{r.id}</td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------- NEW SECTION: register with card + password + show username ---------- */}
      <RegisterClientWithCard />
    </div>
  );
}

// separate component so it can use Stripe hooks
function RegisterClientWithCard() {
  const stripe = useStripe();
  const elements = useElements();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleRegister(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    // 1) create payment method
    const card = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card,
      billing_details: {
        name: form.name,
        email: form.email,
        phone: form.phone,
      },
    });

    if (error) {
      setResult({ error: error.message });
      setLoading(false);
      return;
    }

    // 2) send to backend
    try {
      const resp = await api.post('/api/register', {
        ...form,
        payment_method: paymentMethod.id,
      });

      setResult({ ok: true, username: resp.data.username });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setResult({ error: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ marginTop: 40, maxWidth: 420 }}>
      <h2>Register Client (with payment)</h2>
      <form onSubmit={handleRegister} style={{ display: 'grid', gap: 8 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          placeholder="Phone"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />

        {/* 👇 THIS is the password box you’re missing */}
        <input
          placeholder="Create password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />

        <label>Card details</label>
        <div style={{ border: '1px solid #ccc', borderRadius: 4, padding: 8 }}>
          <CardElement />
        </div>

        <button type="submit" disabled={!stripe || loading}>
          {loading ? 'Registering...' : 'Register & Save Card'}
        </button>
      </form>

      {/* show response */}
      {result?.error && (
        <div style={{ color: 'red', marginTop: 10 }}>{result.error}</div>
      )}
      {result?.ok && (
        <div style={{ color: 'green', marginTop: 10 }}>
          Registration complete! Your username is:
          <strong> {result.username}</strong>
          <br />
          Please save this to log in.
        </div>
      )}
    </div>
  );
}
