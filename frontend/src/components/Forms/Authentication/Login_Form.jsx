import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Input_Text from '../../Input_Fields/Input_Text';
import Input_Password from '../../Input_Fields/Input_Password';
import Button from '../../Buttons/Button';
//import { useNavigate } from 'react-router-dom';
//import { toast } from 'react-toastify';

//import { signInUser } from '../../context/supabase_auth/sup_LogIn.js';
//import { supabase } from '../../supabaseClient';
//import { useUser } from '../../context/UserContext';

export default function LoginForm() {
  //const navigate = useNavigate();

  //const { setUser } = useUser();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [loading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.email.trim() && formData.password.trim();

  return (
    <section className="md:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 md:px-10 border border-gray-300">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-neutral">
            Welcome
          </h2>
          <p className="text-sm text-gray-500">
            Please log in to access your account
          </p>
        </header>

        <form className="space-y-5">
          <Input_Text
            label="Email"
            id="email"
            name="email"
            placeholder="Please enter your email"
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
            placeholder="Please enter your password"
            required
            value={formData.password}
            onChange={handleChange}
            className="font-semibold"
            password_className={loading ? 'opacity-50 cursor-not-allowed' : ''}
            disabled={loading}
          />
          {/*  Forgot Password link */}
          <div className="text-right -mt-4 ">
            <Link
              to="/forgot_password"
              className="text-sm text-blue-500 hover:underline font-medium"
            >
              Forgot Password?
            </Link>
          </div>

          <Link to="/home_admin">
            {' '}
            <Button
              label={'Log In'}
              isLoading={loading}
              loadingText="Logging in ...."
              type="submit"
              className={`bg-green-700 w-full text-white ${
                !isFormValid || loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={!isFormValid || loading}
            />
          </Link>
        </form>
        <div className="flex justify-center gap-3 mt-4">
          <p>No Account?</p>
          <Link
            to="/register_account"
            className="text-sm text-blue-800 hover:underline font-medium mt-1"
          >
            Register Account
          </Link>
        </div>
      </div>
    </section>
  );
}
