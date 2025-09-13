import { useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [usernameOrEmail,setU]=useState('admin');
  const [password,setP]=useState('admin123');
  const [err,setErr]=useState('');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr('');
    try{
      const { data } = await api.post('/auth/login',{ usernameOrEmail, password });
      localStorage.setItem('token', data.token);
      nav('/');
    }catch(e){ setErr(e.response?.data?.error || 'Login failed'); }
  }

  return (
    <div style={{maxWidth:360, margin:'80px auto', fontFamily:'sans-serif'}}>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input value={usernameOrEmail} onChange={e=>setU(e.target.value)} placeholder="username or email" style={{width:'100%',padding:8,marginBottom:8}}/>
        <input value={password} onChange={e=>setP(e.target.value)} type="password" placeholder="password" style={{width:'100%',padding:8,marginBottom:8}}/>
        <button style={{padding:'8px 12px'}}>Login</button>
      </form>
      {err && <p style={{color:'crimson'}}>{err}</p>}
    </div>
  );
}
