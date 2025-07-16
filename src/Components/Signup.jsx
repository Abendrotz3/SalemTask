import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const { session, singUpNewUser } = UserAuth();
  const navigate = useNavigate();
  console.log(session);

  const handleSigup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await singUpNewUser(email, password);

      if (result.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("an error ocurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSigup} className="max-w-md m-auto pt-24">
        <h2 className="font-bold pb-2">Signup Today</h2>
        <p>
          Already have an account?
          <Link to="/signin">Sign In!</Link>
        </p>
        <div className="flex flex-col py-4">
          <input
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 mt-6"
            type="email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="p-3 mt-6"
            type="password"
          />
          <button type="submit" disabled={loading} className="mt-6 w-full">
            Sign Up
          </button>
          {error && <p className="text-red-600 text-center pt-4">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default Signup;
