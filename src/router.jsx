import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Layout from "./Layout.jsx";
import ErrorPage from "./pages/Error.jsx";

const lazyRoute = (importer) => {
  const Page = lazy(importer);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: lazyRoute(() => import("./pages/Home.jsx")) },
      {
        path: "/dashboard",
        element: lazyRoute(() => import("./pages/Dashboard.jsx")),
      },
      { path: "/login", element: lazyRoute(() => import("./pages/Login.jsx")) },
      { path: "/signup", element: lazyRoute(() => import("./pages/SignUp.jsx")) },
    ],
  },
]);

export default router;