import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import Input_Text from '../../Input_Fields/Input_Text';
import Button from '../../Buttons/Button';
//import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
//import { supabase } from '../../supabaseClient';
export default function Forgot_Password_Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [loading] = useState(false);

  return (
    <section className="md:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 md:px-10 border border-gray-300">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral">
            Forgot Password
          </h2>
          <p className="text-sm text-gray-500">
            Enter your registered user id and email to reset your password.
          </p>
        </header>

        <form className="space-y-5">
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

          <Link to="/reset_password">

            <Button
              label={'Verify'}
              isLoading={loading}
              loadingText="Verifying....."
              type="submit"
              className={`bg-green-700 w-full text-white ${
                !formData.email.trim() || loading
                  ? 'opacity-70 cursor-not-allowed'
                  : ''
              }`}
              disabled={!formData.email.trim() || loading}
            />
          </Link>

          <p className="text-center text-sm text-gray-500 mt-4">
            Remember your password?{' '}
            <button
              type="button"
              onClick={() => navigate('/')}
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
