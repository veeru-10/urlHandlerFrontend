import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  ArrowUpRight,
  LayoutDashboard,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../store/stores/authSlice";
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { isAuthenticated, user, status } = useSelector((state) => state.auth);
  const isLoggingOut = status === "loggingOut";
  const logout = async () => {
    await dispatch(logoutUser());
    setShowLogoutDialog(false);
    navigate("/");
  };

  useEffect(() => {
    if (!showLogoutDialog) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setShowLogoutDialog(false);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [showLogoutDialog]);

  const openNewLink = (event) => {
    if (location.pathname !== "/dashboard") return;

    event.preventDefault();
    window.history.replaceState(null, "", "/dashboard#new-link");
    const input = document.querySelector("#new-link input");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus();
  };

  return (
    <nav className="mx-auto flex max-w-7xl items-center justify-between border-b border-[#ded6ca] px-5 py-5 sm:px-8">
      <Link to="/" className="text-2xl font-bold tracking-tight text-[#b6533d]">
        url<span className="text-[#202523]">handler</span>
        <span className="ml-2 align-top font-sans text-[10px] text-[#b6533d]">
          .io
        </span>
      </Link>
      <div className="flex items-center gap-2 sm:gap-5">
        {isAuthenticated ? (
          <>
            <Link
              to="/dashboard"
              className={`hidden items-center gap-2 font-sans text-sm sm:flex ${location.pathname === "/dashboard" ? "text-[#b6533d]" : "text-[#5f665f]"}`}
            >
              <LayoutDashboard size={16} />
              Workspace
            </Link>
            <Link
              to="/dashboard#new-link"
              onClick={openNewLink}
              className="ink-button px-3 py-2 text-sm"
            >
              <Plus size={16} />{" "}
              <span className="hidden sm:inline">New link</span>
            </Link>
            <button
              onClick={() => setShowLogoutDialog(true)}
              title="Sign out"
              className="outline-button border-0 p-2"
            >
              <LogOut size={17} />
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hidden font-sans text-sm text-[#5f665f] sm:block"
            >
              Sign in
            </Link>
            <Link to="/signup" className="ink-button px-4 py-2 text-sm">
              Start free <ArrowUpRight size={15} />
            </Link>
          </>
        )}
        {isAuthenticated && (
          <span
            title={user?.name || "Account"}
            className="hidden rounded-full bg-[#e7c66c] p-2 text-[#202523] sm:block"
          >
            <UserRound size={16} />
          </span>
        )}
      </div>
      {showLogoutDialog && (
        <div
          role="presentation"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setShowLogoutDialog(false);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#202523]/35 px-5 backdrop-blur-sm"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-title"
            className="w-full max-w-sm rounded-sm border border-[#ded6ca] bg-[#fffdf8] p-6 shadow-[0_20px_60px_rgba(32,37,35,.2)]"
          >
            <div className="mb-4 flex items-center gap-3 text-[#b6533d]">
              <span className="rounded-full bg-[#f6e5df] p-2">
                <LogOut size={18} />
              </span>
              <h2 id="logout-title" className="text-xl font-bold text-[#202523]">
                Sign out?
              </h2>
            </div>
            <p className="font-sans text-sm leading-6 text-[#687069]">
              You will need to sign in again to access your workspace.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutDialog(false)}
                className="outline-button px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={logout}
                disabled={isLoggingOut}
                className="ink-button cursor-pointer bg-[#b6533d] px-4 py-2 text-sm hover:bg-[#202523] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "Logging out..." : "Sign out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
