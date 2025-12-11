// frontend/src/pages/Info.jsx
export default function Info() {
  return (
    <div style={{ background: '#fff', padding: 16, border: '1px solid #ddd' }}>
      <h2>About this app</h2>
      <p>
        This portal lets clients register, submit cleaning requests with photos,
        and lets Anna review, quote, accept, or reject them.
      </p>
      <p>Tabs:</p>
      <ul>
        <li>
          <strong>New Client</strong> – client signs up and gets a generated username
        </li>
        <li>
          <strong>Existing Client</strong> – client can log in / view stuff
        </li>
        <li>
          <strong>Admin / Dashboard</strong> – Anna logs in (
          <code>anna_johnson</code> / <code>2001cleaningserviceAJ</code>)
        </li>
      </ul>
    </div>
  );
}
