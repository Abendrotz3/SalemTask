import React from "react";
import { UserAuth } from "../context/AuthContext";
import Product from "./Product";
import { NavBar } from "./NavBar"

export const Dashboard = () => {
  const { session } = UserAuth();
  console.log(session);


  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {session?.user?.email}</h2>
    </div>
  );
};
