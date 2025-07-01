import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import Toast from '../components/Toast';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [description, setDescription] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDescription(response.data.description || '');
        setPreview(response.data.photo || '');
      } catch (error) {
        console.error('Error fetching user details:', error.response || error.message);
        setToastMessage('Failed to fetch user details.');
      }
    };

    fetchUserDetails();
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    setToastMessage(darkMode ? 'Dark mode disabled.' : 'Dark mode enabled.');
  };

  const updateDescription = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/users/me',
        { description },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDescription(response.data.user.description);
      setToastMessage('Description updated successfully!');
    } catch (error) {
      console.error('Error updating description:', error.response || error.message);
      setToastMessage('Failed to update description.');
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const savePhoto = async () => {
    if (!photo) {
      setToastMessage('Please select a photo to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/users/me/photo', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setToastMessage('Photo updated successfully!');
    } catch (error) {
      console.error('Error uploading photo:', error.response || error.message);
      setToastMessage('Failed to upload photo.');
    }
  };

  return (
    <div className="card">
      <h1>Settings</h1>
      <p>Adjust your preferences below:</p>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage('')} />}

      <div style={{ marginTop: '20px' }}>
        <label>
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          Enable Dark Mode
        </label>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>
          <p>Update Your Description:</p>
          <textarea
            placeholder="Write about yourself or your skills..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            style={{ width: '100%', border: '1px solid #ddd', borderRadius: '5px', padding: '10px' }}
          />
        </label>
        <button className="btn" style={{ marginTop: '10px' }} onClick={updateDescription}>
          Save Description
        </button>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3>Upload Your Photo:</h3>
        {preview && (
          <img
            src={preview}
            alt="Profile Preview"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              objectFit: 'cover',
              marginBottom: '10px',
            }}
          />
        )}
        <input type="file" accept="image/*" onChange={handlePhotoUpload} />
        <button className="btn" style={{ marginTop: '10px' }} onClick={savePhoto}>
          Save Photo
        </button>
      </div>
    </div>
  );
};

export default Settings;
