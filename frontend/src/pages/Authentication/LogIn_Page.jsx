import React ,{useEffect, useState}from 'react';
import Branding_Aside from '../../components/Branding/Branding_Aside';
import Login_Form from '../../components/Forms/Authentication/Login_Form';
import LoadingSpinner from '../../components/Loading_UI/LoadingSpinner';
export default function LoginPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Simulate loading or waiting for data (500–800ms feels natural)
      const timer = setTimeout(() => {
        setLoading(false);
      }, 800);

      return () => clearTimeout(timer);
    }, []);

    if (loading) {
      return <LoadingSpinner />;
    }

  return (
    <main className=" mx-4 w-full border flex bg-white border-gray-300 max-w-6xl  shadow-3xl rounded-3xl overflow-hidden  flex-col md:flex-row">
      <Branding_Aside />
      <Login_Form />
    </main>
  );
}
