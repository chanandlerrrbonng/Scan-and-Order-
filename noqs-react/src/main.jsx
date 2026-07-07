import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

import LoginPage from './admin/LoginPage.jsx';
import RequireRole from './admin/RequireRole.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import MenuAdmin from './admin/MenuAdmin.jsx';
import OrdersAdmin from './admin/OrdersAdmin.jsx';
import AnalyticsAdmin from './admin/AnalyticsAdmin.jsx';
import InboxAdmin from './admin/InboxAdmin.jsx';

import './styles.css';

function Storefront() {
  return (
    <CartProvider>
      <App />
    </CartProvider>
  );
}

const router = createBrowserRouter([
  { path: '/', element: <Storefront /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <RequireRole roles={['owner', 'staff']} />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <MenuAdmin /> },
          { path: 'menu', element: <MenuAdmin /> },
          { path: 'orders', element: <OrdersAdmin /> },
          { path: 'inbox', element: <InboxAdmin /> },
          {
            path: 'analytics',
            element: <RequireRole roles={['owner']} />,
            children: [{ index: true, element: <AnalyticsAdmin /> }]
          }
        ]
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
