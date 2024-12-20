import React from 'react';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import ProfileForm from './pages/Index';
import AddPublication from './pages/formulario';
//AWS AMPLIFY
import { Amplify } from "aws-amplify";
import awsExports from './aws-exports';
import Dashboard from './pages/dashboard';

Amplify.configure(awsExports);

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <ProfileForm />,
  },
  {
    path: "/formulario",
    element: <AddPublication />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  }

]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
      </div>
  );
  
}

ReactDOM.createRoot(document.getElementById("root")).render(
    <App />
);
