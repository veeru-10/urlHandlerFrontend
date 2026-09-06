import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
// import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router";
const Login = lazy(()=> import("./pages/Login.jsx"))
const SignUp = lazy(()=> import("./pages/SignUp.jsx"))
const Home = lazy(()=> import("./pages/Home.jsx"))
const Dashboard = lazy(()=> import("./pages/Dashboard.jsx"))
import Layout from "./Layout.jsx";
// import Home from "./pages/Home.jsx";
// import Login from "./pages/Login.jsx";
// import SignUp from "./pages/SignUp.jsx";
// import Dashboard from "./pages/Dashboard.jsx";
import ErrorPage from "./pages/Error.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Suspense fallback={<div>Loading...</div>}><Home/></Suspense> },
      { path: "/dashboard", element: <Suspense><Dashboard/></Suspense> },
      { path: "/login", element: <Suspense><Login/></Suspense> },
      { path: "/signup", element: <Suspense><SignUp/></Suspense> },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
