import { useEffect, useState } from 'react';
import api from '../utils/api';
import ServerForm from './ServerForm';

export default function ServerList(){
  const [data,setData]=useState([]);
  const [page,setPage]=useState(1);
  const [pages,setPages]=useState(1);
  const [search,setSearch]=useState('');
  const [editing,setEditing]=useState(null);
  const [selected,setSelected]=useState(new Set());

  async function load(p=page){
    const { data } = await api.get('/servers', { params:{ page:p, limit:10, search }});
    setData(data.data); setPages(data.pagination.pages); setPage(p);
    setSelected(new Set());
  }

  useEffect(()=>{ load(1); },[]);

  async function remove(id){ await api.delete(`/servers/${id}`); load(); }
  async function bulkDelete(){
    if(selected.size===0) return;
    await api.post('/servers/bulk-delete', { ids: Array.from(selected) });
    load();
  }

  return (
    <div style={{maxWidth:1000, margin:'20px auto', fontFamily:'sans-serif'}}>
      <h2>Cloud Servers</h2>

      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <input placeholder="search name/ip" value={search} onChange={e=>setSearch(e.target.value)} />
        <button onClick={()=>load(1)}>Search</button>
        <button onClick={bulkDelete} disabled={selected.size===0}>Bulk Delete ({selected.size})</button>
        <button onClick={()=>{ localStorage.removeItem('token'); location.reload(); }}>Logout</button>
      </div>

      <ServerForm onSaved={()=>{ setEditing(null); load(); }} editing={editing}/>

      <table style={{width:'100%', marginTop:16, borderCollapse:'collapse'}}>
        <thead>
          <tr>
            <th></th><th>Name</th><th>IP</th><th>Provider</th><th>Status</th><th>CPU</th><th>RAM(MB)</th><th>Storage(GB)</th><th></th>
          </tr>
        </thead>
        <tbody>
          {data.map(s=>(
            <tr key={s._id} style={{borderTop:'1px solid #ddd'}}>
              <td><input type="checkbox" checked={selected.has(s._id)} onChange={e=>{
                const copy=new Set(selected);
                e.target.checked?copy.add(s._id):copy.delete(s._id);
                setSelected(copy);
              }}/></td>
              <td>{s.name}</td><td>{s.ip_address}</td><td>{s.provider}</td><td>{s.status}</td>
              <td>{s.cpu_cores}</td><td>{s.ram_mb}</td><td>{s.storage_gb}</td>
              <td>
                <button onClick={()=>setEditing(s)}>Edit</button>{' '}
                <button onClick={()=>remove(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{marginTop:12}}>
        <button disabled={page<=1} onClick={()=>load(page-1)}>Prev</button>
        <span style={{margin:'0 8px'}}>Page {page}/{pages}</span>
        <button disabled={page>=pages} onClick={()=>load(page+1)}>Next</button>
      </div>
    </div>
  );
}
