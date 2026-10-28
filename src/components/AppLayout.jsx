import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { isAuthenticated, currentUser, dispatch } = useAuth();

  return (
    <div style={{ display: "flex", gap: 30, padding: 20 }}>
      <aside>
        <h2>TweetApp</h2>

        <nav style={{ display: "grid", gap: 12 }}>
          <Link to="/">Feed</Link>
          <Link to="/profile/101">Profile</Link>
          <Link to="/settings">Settings</Link>
          <Link to="/login">Login</Link>
        </nav>

        {isAuthenticated && (
          <>
            <p>{currentUser.name}</p>
            <button onClick={() => dispatch({ type: "LOGOUT" })}>
              Logout
            </button>
          </>
        )}
      </aside>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}