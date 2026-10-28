import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [name, setName] = useState("");
  const { dispatch } = useAuth();
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    if (!name.trim()) return;

    dispatch({
      type: "LOGIN",
      payload: {
        id: "101",
        name: name.trim(),
      },
    });

    navigate("/settings");
  }

  return (
    <section>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          required
        />

        <button type="submit">Login</button>
      </form>
    </section>
  );
}