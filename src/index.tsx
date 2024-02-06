import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter } from 'react-router-dom';

import App from './app'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="904361218828-9iva1dgj3dce9eku248e3l71spa5ho3d.apps.googleusercontent.com">
        <App />
    </GoogleOAuthProvider>
  </BrowserRouter>
);
