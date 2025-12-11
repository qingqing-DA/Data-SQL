import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

// Vite style env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function SignupForm() {
  const stripe = useStripe();
  const elements = useElements();

  // ⬅ add password to form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',     // << here
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);

    // 1) create payment method with Stripe
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
      setLoading(false);
      setResult({ error: error.message });
      return;
    }

    // 2) send everything to your backend, including password
    try {
      const resp = await axios.post('http://127.0.0.1:6767/api/register', {
        ...form,
        payment_method: paymentMethod.id,
      });

      // backend should return { ok: true, username: "something" }
      setResult({ ok: true, username: resp.data.username });
    } catch (err) {
      const msg = err?.response?.data?.error || err.message;
      setResult({ error: msg });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 480, display: 'grid', gap: 10 }}>
      <h2>Create Account</h2>

      <input
        placeholder="Full name"
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

      {/* 👇 this is the part you were missing */}
      <input
        placeholder="Create a password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
        required
      />

      <label>Card details</label>
      <div style={{ padding: 8, border: '1px solid #ccc', borderRadius: 6 }}>
        <CardElement options={{ hidePostalCode: false }} />
      </div>

      <button type="submit" disabled={!stripe || loading} style={{ marginTop: 12 }}>
        {loading ? 'Registering...' : 'Register & Save Card'}
      </button>

      {/* 👇 show errors */}
      {result?.error && (
        <div style={{ color: 'red', marginTop: 12 }}>
          {result.error}
        </div>
      )}

      {/* 👇 show the generated username coming from the backend */}
      {result?.ok && result?.username && (
        <div style={{ color: 'green', marginTop: 12 }}>
          Registration complete! Your username is:
          <strong> {result.username}</strong>
          <br />
          Please save this — you will use it to log in.
        </div>
      )}
    </form>
  );
}

export default function RegisterPage() {
  return (
    <Elements stripe={stripePromise}>
      <SignupForm />
    </Elements>
  );
}
