import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { currentUser } = useAuth();

  return (
    <section>
      <h1>Settings</h1>
      <p>Welcome, {currentUser?.name}</p>
      <p>This page requires login.</p>
    </section>
  );
}