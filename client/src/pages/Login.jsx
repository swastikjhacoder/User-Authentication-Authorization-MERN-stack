import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signInStart, signInSuccess, signInFailure } from "../redux/userSlice";
import Cookies from "js-cookie";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart);
      const res = await axios.post(
        "http://localhost:8000/user/login",
        formData
      );
      const data = await res.data;
      const { token } = await res.data;
      if (res.status === 500 || !data) {
        dispatch(signInFailure(data.message));
        setError(data.message);
        setLoading(false);
        return;
      } else {
        dispatch(signInSuccess(data));
        console.log(data._id);
        Cookies.set("auth_token", token);
        setError(null);
        setLoading(false);
        e.target.reset();
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
      console.log(error.message);
      dispatch(signInFailure(error.message));
    }
  };
  return (
    <div className="login-container">
      <div className="card">
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          Login
        </h1>
        <form method="POST" onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            id="email"
            placeholder="Email"
            autoComplete="on"
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
          <button type="submit" className="login-btn">
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
        <p>
          Dont have an account? <NavLink to="/register">Register</NavLink>
        </p>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default Login;
