import React, { useState } from 'react';
import Input_Password from '../../Input_Fields/Input_Password';
import Button from '../../Buttons/Button';
//import { toast } from 'react-toastify';
//import { supabase } from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Reset_Password_Form() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading] = useState(false);
  //const [sessionReady, setSessionReady] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    //  ADDED – Live strength update
    if (name === 'newPassword') {
      setStrength(getPasswordStrength(value));
    }

    // Your existing password match logic
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
    formData.newPassword.trim() && formData.confirmPassword.trim();

  return (
    <section className="md:w-1/2 flex items-center justify-center px-4 py-8 sm:px-6 md:px-10 border border-gray-300">
      <div className="w-full max-w-sm">
        <header className="text-center mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Set New Password
            </h2>
            <p className="text-green-100">
              Complete REIMS Password Reset
            </p>
          </div>
        </header>

        <form className="space-y-5">
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
