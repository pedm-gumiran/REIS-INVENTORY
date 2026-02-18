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
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Reset Password
            </h2>
            <p className="text-green-100">
              REIMS Password Recovery
            </p>
          </div>
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
              className={`bg-gradient-to-r from-green-500 to-emerald-600 w-full text-white hover:from-green-600 hover:to-emerald-700 transition-all duration-300 ${
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
