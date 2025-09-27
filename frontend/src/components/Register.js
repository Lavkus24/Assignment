import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    location: '',
    bio: '',
    skills: '',
    experience: 'Entry Level'
  });
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setValidationErrors({});
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length > 50) {
      errors.firstName = 'First name cannot exceed 50 characters';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length > 50) {
      errors.lastName = 'Last name cannot exceed 50 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.phone && !/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (7-15 digits)';
    }
    
    if (formData.location && formData.location.length > 100) {
      errors.location = 'Location cannot exceed 100 characters';
    }
    
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'Bio cannot exceed 500 characters';
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors({});

    // Client-side validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setLoading(false);
      return;
    }

    // Prepare data for API
    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      location: formData.location,
      bio: formData.bio,
      skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()) : [],
      experience: formData.experience
    };

    const result = await register(userData);
    
    if (result.success) {
      navigate('/profile');
    } else {
      console.log('Registration failed:', result); // Debug log
      setError(result.message);
      if (result.errors) {
        const errors = {};
        result.errors.forEach(error => {
          errors[error.param] = error.msg;
        });
        setValidationErrors(errors);
      }
    }
    
    setLoading(false);
  };  

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4">
      <div className="max-w-2xl">
        <div className="card">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-600">Join our recruitment platform</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-red-800 text-sm font-semibold" style={{
                color : 'red'
              }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.firstName ? 'error' : ''}`}
                  required
                  placeholder="First name"
                />
                {validationErrors.firstName && (
                  <p className="error-message">{validationErrors.firstName}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.lastName ? 'error' : ''}`}
                  required
                  placeholder="Last name"
                />
                {validationErrors.lastName && (
                  <p className="error-message">{validationErrors.lastName}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${validationErrors.email ? 'error' : ''}`}
                required
                placeholder="Enter your email"
              />
              {validationErrors.email && (
                <p className="error-message">{validationErrors.email}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.password ? 'error' : ''}`}
                  required
                  placeholder="Enter your password"
                />
                {validationErrors.password && (
                  <p className="error-message">{validationErrors.password}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.confirmPassword ? 'error' : ''}`}
                  required
                  placeholder="Confirm your password"
                />
                {validationErrors.confirmPassword && (
                  <p className="error-message">{validationErrors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.phone ? 'error' : ''}`}
                  placeholder="Enter your phone number"
                />
                {validationErrors.phone && (
                  <p className="error-message">{validationErrors.phone}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="location" className="form-label">Location (Optional)</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className={`form-input ${validationErrors.location ? 'error' : ''}`}
                  placeholder="Enter your location"
                />
                {validationErrors.location && (
                  <p className="error-message">{validationErrors.location}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="experience" className="form-label">Experience Level</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior Level">Senior Level</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="skills" className="form-label">Skills (Optional)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter skills separated by commas"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio" className="form-label">Bio (Optional)</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className={`form-input ${validationErrors.bio ? 'error' : ''}`}
                rows="3"
                placeholder="Tell us about yourself"
              />
              {validationErrors.bio && (
                <p className="error-message">{validationErrors.bio}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

