import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import Toast from '../components/Toast';

const Profile = () => {
  const [users, setUsers] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const defaultProfilePic = '/default-profile.jpg'; // Path to the default profile picture

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setToastMessage('Authentication token not found. Please log in again.');
          return;
        }

        const response = await axios.get('/users', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setToastMessage('Users fetched successfully!');
        } else {
          setToastMessage('No users found.');
        }
      } catch (error) {
        console.error('Error fetching users:', error.response || error.message);
        setToastMessage('Error fetching users.');
      }
    };

    fetchUsers();
  }, []);

  const contactUser = (user) => {
    window.location.href = `mailto:${user.email}?subject=Contact%20from%20SkillShare&body=Hi%20${user.name},`;
  };

  return (
    <div className="card">
      <h1>Profile</h1>
      <p>
        go back to<a href="/Dashboard"> dashboard!</a>
      </p>
      <p>Here are all the registered users:</p>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <ul className="profile-list">
        {users.length > 0 ? (
          users.map((user) => (
            <li className="profile-card" key={user._id} style={{ marginBottom: '20px', listStyle: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <img className="profile-image"
                  src={user.photo || defaultProfilePic} // Use defaultProfilePic if photo is not set
                  alt="Profile"
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    marginRight: '10px',
                  }}
                />
                <div className="profile-details">
                  <strong>{user.name}</strong> ({user.email})
                  <p>
                    <i>{user.description || 'No description available.'}</i>
                  </p>
                  <ul className="skills-list">
                    {user.skills.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <button className="btn" onClick={() => contactUser(user)}>
                Contact
              </button>
            </li>
          ))
        ) : (
          <p>No users found.</p>
        )}
      </ul>
    </div>
  );
};

export default Profile;
