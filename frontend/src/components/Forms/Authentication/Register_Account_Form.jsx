import React, { useState } from 'react';
import Input_Text from '../../Input_Fields/Input_Text';
import Input_Password from '../../Input_Fields/Input_Password';
import Button from '../../Buttons/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axios';

export default function Register_Account_Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    pin_code: '',
  });

  const [loading, setLoading] = useState(false);

  const isFormValid =
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.email.trim() &&
    formData.password.trim() &&
    formData.pin_code.trim();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Send registration data to backend
      const response = await axiosInstance.post('/users/register', {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        pin_code: formData.pin_code
      });

      if (response.data.success) {
        toast.success('Account created successfully! Please login.');
        // Redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
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
              Create REIMS Account
            </h2>
            <p className="text-green-100">
              Please all the fields to create your account
            </p>
          </div>
        </header>

        <form className="space-y-5 " onSubmit={handleSubmit}>
          <Input_Text
            label="First Name"
            id="first_name"
            name="first_name"
            placeholder="Enter your first name"
            required
            type="text"
            value={formData.first_name}
            onChange={handleChange}
            className="font-semibold"
            text_ClassName={loading ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={loading}
          />

          <Input_Text
            label="Last Name"
            id="last_name"
            name="last_name"
            placeholder="Enter your user last name"
            required
            type="text"
            value={formData.last_name}
            onChange={handleChange}
            className="font-semibold"
            text_ClassName={loading ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={loading}
          />
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

          <Input_Password
            label="Password"
            id="password"
            name="password"
            placeholder="Enter new password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="font-semibold"
          />
          <Input_Text
            label="PIN Code"
            id="pin_code"
            name="pin_code"
            placeholder="Enter 6-digit PIN code"
            required
            type="text"
            maxLength={6}
            value={formData.pin_code}
            onChange={handleChange}
            className="font-semibold"
            text_ClassName={loading ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-2 text-center">
            <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              <strong>Important:</strong> Keep your PIN code secure and remember it  for password reset functionality.
            </span>
          </p>

          <Button
            label={'Register Account'}
            isLoading={loading}
            loadingText="Saving ......"
            type="submit"
            className={`bg-gradient-to-r from-green-500 to-emerald-600 w-full text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 ${
              (!isFormValid || loading) ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            style={{ cursor: (!isFormValid || loading) ? 'not-allowed' : 'pointer' }}
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
