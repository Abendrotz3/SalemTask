import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();
  console.log(session);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signOut();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Welcome, {session?.user?.email}</h2>
      <div>
        <p
          onClick={handleSignUp}
          className="hover:cursor-pointer border inline-block px-4 py-3 mt-4"
        >
          Sign out
        </p>
      </div>
    </div>
  );
};
