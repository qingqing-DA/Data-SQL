import { useEffect, useState } from 'react';
import api from './api';

export default function Requests() {
  const [clients, setClients] = useState([]);
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({
    client_id:'', service_address:'', cleaning_type:'basic', rooms:1,
    preferred_start:'', preferred_end:'', proposed_budget:'', notes:''
  });

  async function load() {
    const [c, r] = await Promise.all([
      api.get('/api/clients'),
      api.get('/api/requests'),
    ]);
    setClients(c.data); setRows(r.data);
  }
  async function createReq(e) {
    e.preventDefault();
    const payload = { ...form, rooms:Number(form.rooms) };
    await api.post('/api/requests', payload);
    setForm({ client_id:'', service_address:'', cleaning_type:'basic', rooms:1, preferred_start:'', preferred_end:'', proposed_budget:'', notes:'' });
    load();
  }

  useEffect(()=>{ load(); }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Service Requests</h2>
      <form onSubmit={createReq} style={{ display:'grid', gap:8, maxWidth:520 }}>
        <select value={form.client_id} onChange={e=>setForm({...form,client_id:e.target.value})}>
          <option value="">-- choose client --</option>
          {clients.map(c=>(<option key={c.id} value={c.id}>{c.name}</option>))}
        </select>
        <input placeholder="Service address" value={form.service_address} onChange={e=>setForm({...form,service_address:e.target.value})}/>
        <select value={form.cleaning_type} onChange={e=>setForm({...form,cleaning_type:e.target.value})}>
          <option value="basic">basic</option>
          <option value="deep">deep</option>
          <option value="move_out">move_out</option>
        </select>
        <input type="number" min="1" placeholder="Rooms" value={form.rooms} onChange={e=>setForm({...form,rooms:e.target.value})}/>
        <input placeholder="Preferred start (YYYY-MM-DD hh:mm:ss)" value={form.preferred_start} onChange={e=>setForm({...form,preferred_start:e.target.value})}/>
        <input placeholder="Preferred end (YYYY-MM-DD hh:mm:ss)" value={form.preferred_end} onChange={e=>setForm({...form,preferred_end:e.target.value})}/>
        <input placeholder="Proposed budget" value={form.proposed_budget} onChange={e=>setForm({...form,proposed_budget:e.target.value})}/>
        <input placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/>
        <button>Create Request</button>
      </form>

      <table border="1" cellPadding="6" style={{ marginTop:20 }}>
        <thead><tr><th>ID</th><th>Client</th><th>Type</th><th>Rooms</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id}>
              <td>{r.id}</td><td>{r.client_name}</td><td>{r.cleaning_type}</td><td>{r.rooms}</td><td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
