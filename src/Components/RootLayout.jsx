// src/Components/RootLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "./NavBar";

export const RootLayout = () => (
  <div className="flex">
    <NavBar />
    {/* Aquí es donde irá Dashboard, Product, etc. */}
    <main className="ml-64 flex-1 p-6">
      <Outlet />
    </main>
  </div>
);
