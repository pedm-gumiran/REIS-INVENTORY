import React, { useState, useEffect } from 'react';
import Register_Account_Form from '../../components/Forms/Authentication/Register_Account_Form';
import BrandingAside from '../../components/Branding/Branding_Aside';
import LoadingSpinner from '../../components/Loading_UI/LoadingSpinner';

export default function Register_Account_Page() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading or waiting for data (500–800ms feels natural)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="mx-4 w-full border flex bg-white border-gray-300 max-w-6xl shadow-3xl rounded-3xl overflow-hidden flex-col md:flex-row">
      <BrandingAside />
      <Register_Account_Form />
    </main>
  );
}
