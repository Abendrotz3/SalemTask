import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Signup } from "./Components/Signup";
import { Signin } from  "./Components/Singin";
import { Dashboard } from "./Components/Dashboard";
import  Product from "./Components/Product";
import PrivateRoute from "./Components/PrivateRoute";
import { ProtectedLayout } from "./Components/ProtectedLayout";

export const router = createBrowserRouter([
  // Rutas públicas
  { path: "/",       element: <App /> },
  { path: "/signup", element: <Signup /> },
  { path: "/signin", element: <Signin /> },

  // Agrupamos aquí las rutas protegidas bajo el mismo layout + NavBar
  {
    element: (
      <PrivateRoute>
        <ProtectedLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/product",   element: <Product />   },
    ],
  },
]);