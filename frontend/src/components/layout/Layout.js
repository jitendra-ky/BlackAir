import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-8xl mx-auto py-3 px-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
