import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: ""
  });

  const { session, signInUser } = UserAuth();
  const navigate = useNavigate();
  console.log(session);

  const validateForm = () => {
    const errors = {};
    let isValid = true;
    
    // Validación de email
    if (!email.trim()) {
      errors.email = "El email es requerido";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email no válido";
      isValid = false;
    }
    
    // Validación de contraseña
    if (!password.trim()) {
      errors.password = "La contraseña es requerida";
      isValid = false;
    } else if (password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres";
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    
    // Validar campos antes de enviar
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const result = await signInUser(email, password);

      if (result.success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError("Credenciales incorrectas. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ 
        backgroundColor: 'var(--color-shark-950)', 
        color: 'var(--color-polar-100)'
      }}
    >
      <div 
        className="w-full max-w-md rounded-xl overflow-hidden"
        style={{
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div 
          className="p-8 text-center"
          style={{
            backgroundColor: 'var(--color-shark-900)',
            borderBottom: '1px solid var(--color-shark-700)'
          }}
        >
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: 'var(--color-polar-200)' }}
          >
            Sign In
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-polar-300)' }}>
            Don't have an account?{' '}
            <Link 
              to="/signup" 
              className="font-medium hover:underline"
              style={{ color: 'var(--color-blue-chill-400)' }}
            >
              Sign Up!
            </Link>
          </p>
        </div>
        
        <form 
          onSubmit={handleSignin}
          className="p-8"
          style={{
            backgroundColor: 'var(--color-shark-800)',
            borderTop: '1px solid var(--color-shark-700)'
          }}
        >
          <div className="mb-6">
            <label 
              htmlFor="email" 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-polar-300)' }}
            >
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={`w-full p-3 rounded-lg ${
                fieldErrors.email ? "border-red-500" : "border-shark-600"
              }`}
              type="email"
              style={{ 
                backgroundColor: 'var(--color-shark-700)',
                border: '1px solid',
                borderColor: fieldErrors.email 
                  ? 'var(--color-red-500)' 
                  : 'var(--color-shark-600)',
                color: 'var(--color-polar-100)'
              }}
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.email}</p>
            )}
          </div>
          
          <div className="mb-6">
            <label 
              htmlFor="password" 
              className="block text-sm font-medium mb-2"
              style={{ color: 'var(--color-polar-300)' }}
            >
              Password
            </label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={`w-full p-3 rounded-lg ${
                fieldErrors.password ? "border-red-500" : "border-shark-600"
              }`}
              type="password"
              style={{ 
                backgroundColor: 'var(--color-shark-700)',
                border: '1px solid',
                borderColor: fieldErrors.password 
                  ? 'var(--color-red-500)' 
                  : 'var(--color-shark-600)',
                color: 'var(--color-polar-100)'
              }}
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-sm mt-1">{fieldErrors.password}</p>
            )}
          </div>
          
          {error && (
            <div 
              className="mb-4 p-3 rounded-lg text-center"
              style={{ 
                backgroundColor: 'rgba(220, 38, 38, 0.2)', 
                color: 'var(--color-red-400)',
                border: '1px solid var(--color-red-700)'
              }}
            >
              {error}
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg font-bold transition-colors"
            style={{ 
              backgroundColor: 'var(--color-blue-chill-700)',
              color: 'var(--color-polar-100)',
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-600)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'var(--color-blue-chill-700)'}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;