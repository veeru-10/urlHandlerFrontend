import Header from "../components/Header";
import { Navigate } from "react-router";
import { useSelector } from "react-redux";

const Home = () => {
  const { isAuthenticated, isChecking } = useSelector((state) => state.auth);

  if (isChecking) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Header />;
};

export default Home;
