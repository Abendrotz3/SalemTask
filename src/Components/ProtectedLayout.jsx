// src/Components/ProtectedLayout.jsx
import React from "react";
import { NavBar } from "./NavBar";
import { Outlet } from "react-router-dom";

export const ProtectedLayout = () => (
  <div className="flex">
    <NavBar />
    <main className="ml-64 flex-1 p-6">
      <Outlet />
    </main>
  </div>
);
