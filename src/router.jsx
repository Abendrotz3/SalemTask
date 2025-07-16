import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import { Signup } from "./Components/Signup";
import { Signin } from  "./Components/Singin";
import { Dashboard } from "./Components/Dashboard";
import PrivateRoute from "./Components/PrivateRoute";

export const router = createBrowserRouter([
    {path: "/", element: <App/>},
    {path: "/signup", element: <Signup/>},
    {path: "/signin", element: <Signin/>},
    {path: "/dashboard", element: <PrivateRoute><Dashboard/></PrivateRoute> },
])