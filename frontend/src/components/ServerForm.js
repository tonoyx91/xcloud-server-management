import { useState, useEffect } from 'react';
import api from '../utils/api';

const empty = {
  name:'', ip_address:'', provider:'aws', status:'inactive',
  cpu_cores:1, ram_mb:512, storage_gb:10
};

export default function ServerForm({ onSaved, editing }){
  const [form,setForm]=useState(empty);
  const [error,setError]=useState('');

  useEffect(()=>{ setForm(editing || empty); },[editing]);

  function set(k,v){ setForm(prev=>({ ...prev, [k]: v })); }

  async function submit(e){
    e.preventDefault();
    setError('');
    try{
      if (editing?._id) await api.put(`/servers/${editing._id}`, form);
      else await api.post('/servers', form);
      onSaved(); setForm(empty);
    }catch(e){
      setError(e.response?.data?.message || e.response?.data?.error || 'Save failed');
    }
  }

  return (
    <form onSubmit={submit} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
      {['name','ip_address'].map(k=>(
        <input key={k} value={form[k]} onChange={e=>set(k,e.target.value)} placeholder={k} required/>
      ))}
      <select value={form.provider} onChange={e=>set('provider', e.target.value)}>
        <option>aws</option><option>digitalocean</option><option>vultr</option><option>other</option>
      </select>
      <select value={form.status} onChange={e=>set('status', e.target.value)}>
        <option>inactive</option><option>active</option><option>maintenance</option>
      </select>
      <input type="number" value={form.cpu_cores} onChange={e=>set('cpu_cores', Number(e.target.value))} placeholder="cpu_cores" min="1" max="128"/>
      <input type="number" value={form.ram_mb} onChange={e=>set('ram_mb', Number(e.target.value))} placeholder="ram_mb" min="512"/>
      <input type="number" value={form.storage_gb} onChange={e=>set('storage_gb', Number(e.target.value))} placeholder="storage_gb" min="10"/>
      <button style={{gridColumn:'1 / -1'}}>{editing?._id?'Update':'Create'}</button>
      {error && <div style={{gridColumn:'1 / -1', color:'crimson'}}>{error}</div>}
    </form>
  );
}
