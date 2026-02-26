import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import Input_Text from '../../Input_Fields/Input_Text';
import Button from '../../Buttons/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axios';

export default function Forgot_Password_Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    pin_code: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [loading, setLoading] = useState(false);

  const isFormValid = formData.email.trim() && formData.pin_code.trim();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Send forgot password request to backend
      const response = await axiosInstance.post('/users/forgot-password', {
        email: formData.email,
        pin_code: formData.pin_code
      });

      if (response.data.success) {
        toast.success('Password reset instructions sent to your email!');
        // Store the reset token for development (in production, this would come from email)
        if (response.data.resetToken) {
          // Navigate to reset page with token only on success
          setTimeout(() => {
            navigate(`/reset_password?token=${response.data.resetToken}`);
          }, 2000);
        }
      } else {
        // Show specific error message and stay on forgot password form
        toast.error(response.data.message || 'Failed to process request');
        // Don't navigate to reset password form if PIN is incorrect
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to process request. Please try again.');
      // Stay on forgot password form on error
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
              Forgot Password
            </h2>
            <p className="text-green-100">
              Please fill all required fields to verify your account
            </p>
          </div>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input_Text
            label="Email"
            id="email"
            name="email"
            placeholder="Enter your email address"
            required
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="font-semibold"
            text_ClassName={loading ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={loading}
          />
          <Input_Text
            label="PIN Code"
            id="pin_code"
            name="pin_code"
            placeholder="Enter your 6-digit PIN code"
            required
            type="text"
            maxLength={6}
            value={formData.pin_code}
            onChange={handleChange}
            className="font-semibold"
            text_ClassName={loading ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={loading}
          />

          <Button
            label={'Veriy Account'}
            isLoading={loading}
            loadingText="Verifying...."
            type="submit"
            className={`bg-gradient-to-r from-green-500 to-emerald-600 w-full text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 ${
              !isFormValid || loading
                ? 'opacity-70 cursor-not-allowed'
                : ''
            }`}
            disabled={!isFormValid || loading}
          />

          <p className="text-center text-sm text-gray-500 mt-4">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-green-600 hover:text-green-800 hover:underline font-medium transition-colors"
            >
              Back to Login
            </button>
          </p>
        </form>
      </div>
    </section>
  );
}
