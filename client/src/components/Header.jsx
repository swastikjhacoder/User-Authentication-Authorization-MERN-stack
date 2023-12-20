import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  signOutStart,
  signOutSuccess,
  signOutFailure,
} from "../redux/userSlice";
import axios from "axios";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      dispatch(signOutStart());
      const res = await axios.post("http://localhost:8000/user/logout");
      const data = await res.data;
      if (!data || res.status === 500) {
        dispatch(signOutFailure(data.message));
        return;
      }
      localStorage.clear();
      dispatch(signOutSuccess(data));
      navigate("/login");
    } catch (error) {
      dispatch(signOutFailure(error.message));
    }
  };
  return (
    <header>
      <div className="logo">
        <NavLink to="/">
          <h1>Sequelstring - Test</h1>
        </NavLink>
      </div>
      <div className="menu-items">
        {currentUser ? (
          <ul>
            <li>
              <span style={{ cursor: "pointer" }} onClick={handleLogout}>
                Logout
              </span>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <NavLink to="/register">Register</NavLink>
            </li>
            <li>
              <NavLink to="login">Login</NavLink>
            </li>
          </ul>
        )}
      </div>
    </header>
  );
};

export default Header;
