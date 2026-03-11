import React, { useState, useEffect } from 'react';
import Button from '../Buttons/Button';
import Input_Password from '../Input_Fields/Input_Password';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';

export default function ChangePasswordModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  //  ADDED – Password Strength State
  const [strength, setStrength] = useState(0);

  //  ADDED – Password Strength Checker
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 5) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;
    return score;
  };

  // Disable scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => (document.body.style.overflow = '');
  }, [isOpen]);

  // Reset fields when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ newPassword: '', confirmPassword: '' });
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    //  ADDED – Live strength update
    if (name === 'newPassword') {
      setStrength(getPasswordStrength(value));
    }

    // Check passwords match in real time
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


  // -------For Inputs that trigger the submit button to be disabled------

  const isFormValid = formData.newPassword.trim() && formData.confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid || error) {
      toast.error('Please fix all errors before submitting');
      return;
    }

    try {
      setLoading(true);
      
      // Get current user from localStorage
      const currentUser = JSON.parse(localStorage.getItem('user'));
      if (!currentUser || !currentUser.email) {
        toast.error('User not found. Please login again.');
        onClose();
        return;
      }
      
      // Update password using current user's email
      const response = await axiosInstance.post('/users/reset-password', {
        email: currentUser.email,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        toast.success('Password updated successfully!');
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error(error.response?.data?.message || 'Failed to update password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] flex flex-col m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold">Change Password</h2>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form className="space-y-3" onSubmit={handleSubmit}>
            <Input_Password
              label="New Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password"
            />
            {/*  Password Strength Bar — only show if user types */}
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
              label="Confirm New Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
            />

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                label="Cancel"
                type="button"
                onClick={onClose}
                disabled={loading}
                variant="modal-secondary"
              />
              <Button
                label={loading ? 'Saving...' : 'Save'}
                type="submit"
                disabled={loading || !isFormValid || error}
                variant="modal-primary"
                isLoading={loading}
                loadingText="Saving..."
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
