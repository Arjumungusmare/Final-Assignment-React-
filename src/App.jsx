import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AuthGuard from "./components/AuthGuard";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:userId" element={<Profile />} />

        <Route element={<AuthGuard />}>
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
}