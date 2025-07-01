import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, []);
  

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    if (storedUserId && token) {
      setUserId(storedUserId);
      fetchUserDetails(storedUserId, token);
    } else {
      setMessage('User ID not found. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  const fetchUserDetails = async (userId, token) => {
    try {
      const response = await axios.get(`/auth/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserName(response.data.name);
    } catch (error) {
      console.error('Error fetching user details:', error.response?.data?.message || error.message);
      setMessage('Error fetching user details.');
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      if (!userId) return;

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/skills', {
          headers: { Authorization: `Bearer ${token}` },
          params: { userId },
        });
        setSkills(response.data.skills);
      } catch (error) {
        console.error('Error fetching skills:', error.response?.data?.message || error.message);
        setMessage('Error fetching skills.');
      }
    };

    fetchSkills();
  }, [userId]);

  const addSkill = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/skills/add-skill',
        { userId, skill: newSkill },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSkills(response.data.skills);
      setNewSkill('');
      setMessage('Skill added successfully!');
    } catch (error) {
      console.error('Error adding skill:', error.response || error.message);
      setMessage('Error: ' + (error.response?.data?.message || 'Something went wrong.'));
    }
  };

  const deleteSkill = async (skill) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete('/skills/delete-skill', {
        headers: { Authorization: `Bearer ${token}` },
        data: { userId, skill },
      });
      setSkills(response.data.skills);
      setMessage('Skill deleted successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error.response || error.message);
      setMessage('Error: ' + (error.response?.data?.message || 'Something went wrong.'));
    }
  };

  const searchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/skills/search', {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId, query: searchQuery },
      });
      setSkills(response.data.skills);
    } catch (error) {
      console.error('Error searching skills:', error.response?.data?.message || error.message);
      setMessage('Error searching skills.');
    }
  };

  const showAllSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/skills', {
        headers: { Authorization: `Bearer ${token}` },
        params: { userId },
      });
      setSkills(response.data.skills);
      setMessage('All skills fetched successfully!');
    } catch (error) {
      console.error('Error fetching all skills:', error.response?.data?.message || error.message);
      setMessage('Error fetching all skills.');
    }
  };

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <p><strong>User Logged In:</strong> {userName}</p>
        <button onClick={logout} className="btn">Logout</button>
      </div>

      {/* Navigation to new pages */}
      <div style={{ margin: '20px 0' }}>
        <button onClick={() => navigate('/profile')} className="btn">Go to Profiles</button>
        <button onClick={() => navigate('/settings')} className="btn" style={{ marginLeft: '10px' }}>
          Go to Settings
        </button>
      </div>

      {/* Existing functionality */}
      <input
        type="text"
        placeholder="Search skills"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={searchSkills}>Search</button>
      <button onClick={showAllSkills}>Show All Skills</button>
      <ul>
        {skills.map((skill, index) => (
          <li key={index}>
            {skill} <button onClick={() => deleteSkill(skill)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        placeholder="Add a new skill"
        value={newSkill}
        onChange={(e) => setNewSkill(e.target.value)}
      />
      <button onClick={addSkill}>Add Skill</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;
