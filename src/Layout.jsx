import { Outlet } from "react-router";
import { Provider } from "react-redux";
import store from "./store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "./store/stores/authSlice";
import Navbar from "./components/Navbar";

const AuthBootstrap = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return children;
};

const Layout = () => {
  return (
    <Provider store={store}>
      <AuthBootstrap>
        <div className="app-shell">
          <Navbar />
          <main className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
            <Outlet />
          </main>
        </div>
      </AuthBootstrap>
    </Provider>
  );
};

export default Layout;
