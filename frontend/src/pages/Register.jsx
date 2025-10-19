import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../utils/api";
import "./Auth.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/users/register`, {
        name: username,
        email,
        password,
      });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        alert("User registered successfully!");
        navigate("/dashboard");
      } else {
        alert("Registration failed");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-wrapper">
      <form className="form" onSubmit={handleRegister}>
        <p className="title">Register</p>
        <p className="message">Signup now and get full access to our app.</p>

        <label>
          <input
            required
            type="text"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <span>Username</span>
        </label>

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
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="signin">
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
  
export default Register;
