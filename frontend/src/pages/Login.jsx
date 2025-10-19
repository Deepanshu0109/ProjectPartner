import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/api";
import "./Auth.css";

function Login({ setIsLoggedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setIsLoggedIn?.(true);
        navigate("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form className="form" onSubmit={handleLogin}>
        <p className="title">Login</p>
        <p className="message">Access your account and projects.</p>

        <label>
          <input
            required
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span>Email</span>
        </label>

        <label>
          <input
            required
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span>Password</span>
        </label>

        <button className="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="signin">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;
