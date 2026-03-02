import React, { Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from './components/Layouts/Layout.jsx';
//import PrivateRoute from './components/Layouts/PrivateRoute.jsx';
import { UserProvider } from './components/context/UserContext.jsx';

// Lazy load Page
import LogIn_Page from './pages/Authentication/LogIn_Page.jsx';
import Forgot_Password_Page from './pages/Authentication/Forgot_Password_Page.jsx';
import Reset_Password_Page from './pages/Authentication/Reset_Password_Page.jsx';
import Register_Account from './pages/Authentication/Register_Account_Page.jsx';

const NotFound = React.lazy(
  () => import('./pages/Fallback_Page/Not_Found.jsx'),
);
import LoadingSpinner from './components/Loading_UI/LoadingSpinner.jsx';

// Pages
const Home_Page = React.lazy(() => import('./pages/Dashboard/Home_Page.jsx'));
const Manage_Consumable_Products = React.lazy(
  () => import('./pages/Dashboard/Manage_Consumable_Products.jsx'),
);
const Manage_Non_Consumable_Products = React.lazy(
  () => import('./pages/Dashboard/Manage_Non_Consumable_Products.jsx'),
);

const Transaction_Audit = React.lazy(
  () => import('./pages/Dashboard/Transaction_Audit.jsx'),
);
const Equipment_Audit = React.lazy(
  () => import('./pages/Dashboard/Equipment_Audit.jsx'),
);
const Create_Transaction_Page = React.lazy(
  () => import('./pages/Dashboard/Create_Transaction_Page.jsx'),
);
const Backup_Restore_Page = React.lazy(
  () => import('./pages/Dashboard/Backup_Restore_Page.jsx'),
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        //element: <Navigate to="/login" replace />,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LogIn_Page />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <LogIn_Page />
          </Suspense>
        ),
      },
      {
        path: 'register_account',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Register_Account />
          </Suspense>
        ),
      },
      {
        path: 'forgot_password',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Forgot_Password_Page />
          </Suspense>
        ),
      },
      {
        path: 'reset_password',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Reset_Password_Page />
          </Suspense>
        ),
      },

      // Admin Routes
      {
        path: 'home_admin',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Home_Page />
          </Suspense>
        ),
      },
      {
        path: 'consumable_products',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Manage_Consumable_Products />
          </Suspense>
        ),
      },
      {
        path: 'non_consumable_products',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Manage_Non_Consumable_Products />
          </Suspense>
        ),
      },
 
      {
        path: 'transaction_audit',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Transaction_Audit />
          </Suspense>
        ),
      },
      {
        path: 'equipment_return',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Equipment_Audit />
          </Suspense>
        ),
      },

      {
        path: 'create_transaction',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Create_Transaction_Page />
          </Suspense>
        ),
      },
      {
        path: 'backup_restore',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <Backup_Restore_Page />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <NotFound />
      </Suspense>
    ),
  },
]);

export default function App() {
  return (
    <UserProvider>
      <div className="bg-gray-50 font-sans">
        <RouterProvider router={router} />
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick
          pauseOnHover
          draggable={false}
          theme="colored"
          transition={Slide}
          limit={3}
        />
      </div>
    </UserProvider>
  );
}
