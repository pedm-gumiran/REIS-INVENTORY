import React from 'react';
import System_Logo from '../Logo/System_Logo';

export default function Branding_Aside() {
  return (
    <aside className="md:w-1/2 bg-green-700 flex flex-col items-center justify-center p-8 sm:p-10 md:p-12 text-white">
      <header className="flex items-center space-x-3 mb-6">
        <System_Logo />
        <h1 className="text-3xl md:text-7xl font-extrabold tracking-tight">
          <span className="text-white">RE</span>
          <span className="text-yellow-400">IMS</span>
        </h1>
      </header>
      <p className="text-center max-w-md text-sm md:text-base leading-relaxed">
        A modern
        <span className="font-semibold mr-1 ml-1">
          Inventory Management System
        </span>
        for Research Extension and Training.
      </p>
    </aside>
  );
}
