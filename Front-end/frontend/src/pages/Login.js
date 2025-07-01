import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);

      setMessage('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      setMessage(
        'Error: ' + (error.response?.data?.message || 'Something went wrong.')
      );
    }
  };

  return (
    <div className="card">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="btn">Login</button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Don't have a user yet? <a href="/signup">Signup here!</a>
      </p>
      <p>
        go back to<a href="/"> home!</a>
      </p>
    </div>
  );
};

export default Login;
