import React, { useState, useEffect } from 'react';
import Input_Password from '../../Input_Fields/Input_Password';
import Button from '../../Buttons/Button';
import { toast } from 'react-toastify';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../../api/axios';

export default function Reset_Password_Form() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') ? decodeURIComponent(searchParams.get('email')) : null;

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailValid, setEmailValid] = useState(null);

  // Password Strength State
  const [strength, setStrength] = useState(0);

  // Password Strength Checker
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 5) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;
    return score;
  };

  // Validate email on component mount
  useEffect(() => {
    if (!email) {
      setError('No email provided');
      setEmailValid(false);
      return;
    }
    setEmailValid(true); // In production, you could validate email format
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Live strength update
    if (name === 'newPassword') {
      setStrength(getPasswordStrength(value));
    }

    // Password match logic
    if (updated.newPassword && updated.confirmPassword) {
      setError(
        updated.newPassword !== updated.confirmPassword
          ? 'Passwords do not match'
          : '',
      );
    } else {
      setError('');
    }
  };

  const isFormValid =
    formData.newPassword.trim() && 
    formData.confirmPassword.trim() && 
    !error && 
    emailValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    try {
      setLoading(true);
      
      // Validate email before sending request
      if (!email || email.trim() === '') {
        toast.error('Email is required for password reset');
        return;
      }
      
      // Send reset password request to backend
      const response = await axiosInstance.post('/users/reset-password', {
        email: email.trim(),
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        toast.success('Password reset successfully! Please login with your new password.');
        // Redirect to login page after successful reset
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Handle specific error cases
        if (response.data.message === 'User not found') {
          toast.error('Account not found. Please check your email or request a new password reset.');
          // Redirect back to forgot password after delay
          setTimeout(() => {
            navigate('/forgot_password');
          }, 3000);
        } else {
          toast.error(response.data.message || 'Failed to reset password');
        }
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="md:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 md:px-10 border border-gray-300">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Reset Password
            </h2>
            <p className="text-green-100">
              Please set and confirm your new password
            </p>
          </div>
        </header>

        {emailValid === false && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              Invalid or missing email. Please request a new password reset.
            </p>
            <button
              type="button"
              onClick={() => navigate('/forgot_password')}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Request New Reset
            </button>
          </div>
        )}

        {emailValid === true && (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input_Password
              label="New Password"
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              required
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
              className="font-semibold"
            />

            {/* Password Strength Bar */}
            {formData.newPassword.length > 0 && (
              <div className="mt-1">
                <div
                  className={`h-2 rounded transition-all ${
                    strength === 0
                      ? 'bg-gray-300 w-1/12'
                      : strength === 1
                        ? 'bg-red-500 w-4/12'
                        : strength === 2
                          ? 'bg-yellow-500 w-7/12'
                          : strength === 3
                            ? 'bg-blue-500 w-10/12'
                            : 'bg-green-600 w-full'
                  }`}
                ></div>

                <p className="text-xs mt-1 font-semibold text-gray-600">
                  {strength === 1 && 'Weak'}
                  {strength === 2 && 'Moderate'}
                  {strength === 3 && 'Strong'}
                  {strength === 4 && 'Very Strong '}
                </p>
              </div>
            )}

            <Input_Password
              label="Confirm Password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm new password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="font-semibold"
            />

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            <Button
              label={'Update Password'}
              isLoading={loading}
              loadingText="Updating Password........."
              type="submit"
              className={`bg-gradient-to-r from-green-500 to-emerald-600 w-full text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 ${
                !isFormValid || loading || error ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={!isFormValid || loading || error}
            />

          
          </form>
        )}
      </div>
    </section>
  );
}
