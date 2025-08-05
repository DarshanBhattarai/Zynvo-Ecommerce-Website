import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext.jsx";

import AppRoutes from "./routers/AppRoutes.jsx";

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="light"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <GoogleOAuthProvider clientId="728027270401-qdo9l75vkeihvf3tjsvovqm6r24rjhtb.apps.googleusercontent.com">
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
