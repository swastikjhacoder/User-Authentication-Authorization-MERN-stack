import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/user/register", formData);
      const data = await res.data;
      if (res.status === 500 || !data) {
        setError(data.message);
        setLoading(false);
        return;
      } else {
        setError(null);
        setLoading(false);
        e.target.reset();
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          Register
        </h1>
        <form method="POST" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="on"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            autoComplete="on"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirm"
            id="confirm"
            placeholder="Confirm"
            autoComplete="on"
            value={formData.confirm}
            onChange={handleChange}
          />
          <button type="submit" className="register-btn">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <NavLink to="/login">Login</NavLink>
        </p>
        {error && (<p style={{ color: "red", marginTop: "10px" }}>{error}</p>)}
      </div>
    </div>
  );
};

export default Register;
