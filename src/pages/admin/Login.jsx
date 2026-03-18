import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Lock } from 'lucide-react';
import './Login.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Connect to our express server
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Login Successful!');
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    }
  };

  // console.log(email, password);

  return (
    <div className="admin-login-container">
      <div className="admin-login-card glass-panel">
        <Lock size={40} className="text-gradient" style={{ margin: '0 auto 1.5rem auto' }} />
        <h2>CodeFox <span className="text-gradient">Admin</span></h2>
        <p>Enter your CRM credentials to access the panel</p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="admin@codefoxit.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary login-btn">Sign In to Dashboard</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
