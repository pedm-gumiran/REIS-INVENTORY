import React, { useState } from 'react';
import Input_Text from '../../Input_Fields/Input_Text';
import Input_Password from '../../Input_Fields/Input_Password';
import Button from '../../Buttons/Button';
//import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
//import { supabase } from '../../supabaseClient';
export default function Register_Account_Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [loading] = useState(false);

  const isFormValid =
    formData.user_id.trim() &&
    formData.first_name.trim() &&
    formData.last_name.trim() &&
    formData.email.trim() &&
    formData.password.trim();

  return (
    <section className="md:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 md:px-10 border border-gray-300">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral">
            Register Account
          </h2>
          <p className="text-sm text-gray-500">
            Please fill all the required fields to register your account.
          </p>
        </header>

        <form className="space-y-5 ">
          <Input_Text
            label="User ID"
            id="user_id"
            name="user_id"
            placeholder="Enter your user id"
            required
            type="text"
            value={formData.user_id}
            onChange={handleChange}
            className="font-semibold"
            text_ClassName={loading ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={loading}
          />
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

          <Button
            label={'Register Account'}
            isLoading={loading}
            loadingText="Saving ......"
            type="submit"
            className={`bg-green-700 w-full text-white ${
              loading && !isFormValid ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={!isFormValid || loading}
          />

          <p className="text-center text-sm text-gray-500 mt-4">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-medium"
            >
              Back to Login
            </button>
          </p>
        </form>
      </div>
    </section>
  );
}
