import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const local_domain = 'http://localhost:8000'

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    setProfileData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
    setValidationErrors({});
    setMessage('');
  };
  const [skillsInput, setSkillsInput] = useState('');
  const handleSkillsChange = (e) => {
    const value = e.target.value;
    setSkillsInput(value);
    setValidationErrors({});
    setMessage('');

    const skills = value
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill);

    setProfileData({
      ...profileData,
      skills,
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!profileData.firstName?.trim()) {
      errors.firstName = 'First name is required';
    } else if (profileData.firstName.trim().length > 50) {
      errors.firstName = 'First name cannot exceed 50 characters';
    }
    
    if (!profileData.lastName?.trim()) {
      errors.lastName = 'Last name is required';
    } else if (profileData.lastName.trim().length > 50) {
      errors.lastName = 'Last name cannot exceed 50 characters';
    }
    
    if (profileData.phone && !/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(profileData.phone)) {
      errors.phone = 'Please enter a valid phone number (7-15 digits)';
    }
    
    if (profileData.location && profileData.location.length > 100) {
      errors.location = 'Location cannot exceed 100 characters';
    }
    
    if (profileData.bio && profileData.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setValidationErrors({});

    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.put(`${local_domain}/api/users/profile`, profileData);
      updateUser(response.data.user);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.log('Profile update error:', error.response?.data); // Debug log
      setMessage(error.response?.data?.message || 'Failed to update profile');
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(error => {
          serverErrors[error.param] = error.msg;
        });
        setValidationErrors(serverErrors);
      }
    }

    setLoading(false);
  };

  const handleCancel = () => {
    setProfileData(user);
    setIsEditing(false);
    setMessage('');
    setValidationErrors({});
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
              <p className="text-gray-600 mt-2">Manage your account information</p>
            </div>
            <button
              onClick={logout}
              className="btn btn-outline"
            >
              Logout
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully')
                ? 'bg-green-50 border border-green-200 text-green-600'
                : 'bg-red-50 border border-red-200 text-red-600'
              }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="card">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user.firstName} {user.lastName}
                  </h2>
                  <p className="text-gray-600">{user.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {user.experience}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-primary"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="form-group">
                        <label htmlFor="firstName" className="form-label">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName || ''}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="lastName" className="form-label">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName || ''}
                          onChange={handleChange}
                          className="form-input"
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={profileData.phone || ''}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="location" className="form-label">Location</label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        value={profileData.location || ''}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="experience" className="form-label">Experience Level</label>
                      <select
                        id="experience"
                        name="experience"
                        value={profileData.experience || 'Entry Level'}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="Entry Level">Entry Level</option>
                        <option value="Mid Level">Mid Level</option>
                        <option value="Senior Level">Senior Level</option>
                        <option value="Executive">Executive</option>
                      </select>
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="skills" className="form-label">Skills</label>
                      <input
                        type="text"
                        id="skills"
                        value={skillsInput}
                        onChange={handleSkillsChange}
                        className="form-input"
                        placeholder="Enter skills separated by commas"
                      />

                    </div>

                    <div className="form-group mb-6">
                      <label htmlFor="bio" className="form-label">Bio</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio || ''}
                        onChange={handleChange}
                        className="form-input"
                        rows="4"
                        placeholder="Tell us about yourself"
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">First Name</label>
                        <p className="text-gray-900">{user.firstName}</p>
                      </div>
                      <div>
                        <label className="form-label">Last Name</label>
                        <p className="text-gray-900">{user.lastName}</p>
                      </div>
                    </div>

                    <div>
                      <label className="form-label">Email</label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>

                    {user.phone && (
                      <div>
                        <label className="form-label">Phone</label>
                        <p className="text-gray-900">{user.phone}</p>
                      </div>
                    )}

                    {user.location && (
                      <div>
                        <label className="form-label">Location</label>
                        <p className="text-gray-900">{user.location}</p>
                      </div>
                    )}

                    <div>
                      <label className="form-label">Experience Level</label>
                      <p className="text-gray-900">{user.experience}</p>
                    </div>

                    {user.skills && user.skills.length > 0 && (
                      <div>
                        <label className="form-label">Skills</label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {user.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {user.bio && (
                      <div>
                        <label className="form-label">Bio</label>
                        <p className="text-gray-900 whitespace-pre-wrap">{user.bio}</p>
                      </div>
                    )}

                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <label className="form-label">Member Since</label>
                          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <label className="form-label">Last Updated</label>
                          <p>{new Date(user.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

