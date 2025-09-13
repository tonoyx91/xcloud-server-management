import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ServerList from './components/ServerList';

function PrivateRoute({ children }){
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/" element={<PrivateRoute><ServerList/></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
