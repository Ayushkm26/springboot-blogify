import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Key } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ username: '', password: '' });
  const [changePasswordForm, setChangePasswordForm] = useState({ 
    oldPassword: '', 
    newPassword: '' 
  });

  const API_BASE = 'http://localhost:8081/api/auth'; // Adjust based on your backend URL

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json();

      if (response.ok) {
        setToken(data.token);
        localStorage.setItem('token', data.token); // Store token in localStorage
        setIsLoggedIn(true);
        setMessage('Login successful!');
        setActiveTab('changePassword');
        navigate('/blog'); // Redirect to blog page
      } else {
        setMessage(typeof data === 'string' ? data : 'Login failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerForm)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Registration successful! Welcome ${data.username}`);
        setActiveTab('login');
        setRegisterForm({ username: '', password: '' });
      } else {
        setMessage(typeof data === 'string' ? data : 'Registration failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE}/change-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(changePasswordForm)
      });

      const data = await response.text();

      if (response.ok) {
        setMessage('Password changed successfully!');
        setChangePasswordForm({ oldPassword: '', newPassword: '' });
      } else {
        setMessage(data || 'Password change failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setIsLoggedIn(false);
    setActiveTab('login');
    setMessage('Logged out successfully');
    setLoginForm({ username: '', password: '' });
    setChangePasswordForm({ oldPassword: '', newPassword: '' });
  };

  const PasswordInput = ({ value, onChange, placeholder, show, toggleShow, icon: Icon }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        placeholder={placeholder}
        required
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center"
        onClick={toggleShow}
      >
        {show ? (
          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        ) : (
          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">Authentication</h1>
          <p className="text-blue-100 mt-2">Secure access to your account</p>
        </div>

        {/* Message Display */}
        {message && (
          <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${
            message.includes('successful') || message.includes('Welcome') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : 'bg-red-100 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        {/* Logout Button for Logged In Users */}
        {isLoggedIn && (
          <div className="px-6 pt-4">
            <button
              onClick={logout}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mx-6 mt-6">
          {['login', 'register', 'changePassword'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              disabled={tab === 'changePassword' && !isLoggedIn}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              } ${tab === 'changePassword' && !isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {tab === 'login' && 'Sign In'}
              {tab === 'register' && 'Sign Up'}
              {tab === 'changePassword' && 'Change Password'}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Login Form */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Username"
                  required
                />
              </div>

              <PasswordInput
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="Password"
                show={showPassword}
                toggleShow={() => setShowPassword(!showPassword)}
                icon={Lock}
              />

              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Choose username"
                  required
                />
              </div>

              <PasswordInput
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                placeholder="Create password"
                show={showPassword}
                toggleShow={() => setShowPassword(!showPassword)}
                icon={Lock}
              />

              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          )}

          {/* Change Password Form */}
          {activeTab === 'changePassword' && (
            <div className="space-y-4">
              <PasswordInput
                value={changePasswordForm.oldPassword}
                onChange={(e) => setChangePasswordForm({...changePasswordForm, oldPassword: e.target.value})}
                placeholder="Current password"
                show={showOldPassword}
                toggleShow={() => setShowOldPassword(!showOldPassword)}
                icon={Lock}
              />

              <PasswordInput
                value={changePasswordForm.newPassword}
                onChange={(e) => setChangePasswordForm({...changePasswordForm, newPassword: e.target.value})}
                placeholder="New password"
                show={showNewPassword}
                toggleShow={() => setShowNewPassword(!showNewPassword)}
                icon={Key}
              />

              <button
                onClick={handleChangePassword}
                disabled={loading || !isLoggedIn}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Changing password...' : 'Change Password'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;