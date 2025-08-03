import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Signup } from "./Components/Signup";
import { Signin } from "./Components/Singin";
import { Dashboard } from "./Components/Dashboard";
import Product from "./Components/Product"; // Renombrado de Product.jsx a Producto.jsx
import Ventas from "./Components/Ventas"; // Nuevo componente
import NuevaVenta from "./Components/NuevaVenta"; // Nuevo componente
import PrivateRoute from "./Components/PrivateRoute";
import { ProtectedLayout } from "./Components/ProtectedLayout";

export const router = createBrowserRouter([
  // Rutas públicas
  { path: "/",       element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },

  // Rutas protegidas
  {
    element: (
      <PrivateRoute>
        <ProtectedLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/productos", element: <Product /> }, // Cambiado de "product" a "productos"
      { path: "/ventas",     element: <Ventas /> },     // Nueva ruta
      { path: "/nueva-venta", element: <NuevaVenta /> } // Nueva ruta
    ],
  },
]);