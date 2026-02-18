import React,{useEffect,useState}from 'react';
import Branding_Aside from '../../components/Branding/Branding_Aside';
import Forgot_Password_Form from '../../components/Forms/Authentication/Forgot_Password_Form';
import LoadingSpinner from '../../components/Loading_UI/LoadingSpinner';
export default function Forgot_Password_Page() {
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
    <main className=" mx-4 w-full border flex bg-white border-gray-300 max-w-6xl  shadow-3xl rounded-3xl overflow-hidden  flex-col md:flex-row">
      <Branding_Aside />
      <Forgot_Password_Form/>
    </main>
  );
}
