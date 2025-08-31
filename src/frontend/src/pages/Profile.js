import React, { useState } from 'react';
import './Profile.css';

function Profile({ userEmail, onLogout }) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Client-side validation
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('http://localhost:3000/users', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify({
          user: {
            current_password: currentPassword,
            password: newPassword,
            password_confirmation: confirmPassword
          }
        }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.errors ? Object.values(data.errors).join(', ') : 'Password change failed');
        return;
      }

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('jwtToken');
      const res = await fetch('http://localhost:3000/users', {
        method: 'DELETE',
        headers: {
          'Authorization': token,
        },
        credentials: 'include',
      });

      if (res.ok) {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userEmail');
        onLogout();
      } else {
        setError('Failed to delete account');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>User Profile</h1>
        <div className="user-info">
          <p><strong>Email:</strong> {userEmail}</p>
          <p><strong>Account Status:</strong> Active</p>
        </div>
      </div>

      <div className="profile-sections">
        <section className="password-section">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength="6"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </button>
          </form>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </section>

        <section className="danger-section">
          <h2>Danger Zone</h2>
          <div className="danger-content">
            <p>Once you delete your account, there is no going back. Please be certain.</p>
            <button 
              onClick={handleDeleteAccount}
              className="btn btn-danger"
              disabled={loading}
            >
              {loading ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Profile;
