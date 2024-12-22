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
import Welcome from './pages/Bienvenida';
import ImageDetail from './pages/ImageDetail';

Amplify.configure(awsExports);

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Welcome />,
  },
  {
    path: "/nuevo-usuario",
    element: <ProfileForm />,
  },
  {
    path: "/formulario",
    element: <AddPublication />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/image/:imageId",
    element: <ImageDetail />
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
