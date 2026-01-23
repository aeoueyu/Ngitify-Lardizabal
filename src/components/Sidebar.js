import React from "react";
import whitelogo from "../assets/logo-white.svg";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css"

export default function Sidebar() {
  return (
    <div className="sidebar">
      <img src={whitelogo} className="sidebar-logo" alt="logo" />
      <nav className="sidebar-nav">
        <NavLink to="/overview" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          OVERVIEW
        </NavLink>
        <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          DASHBOARD
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          SETTINGS
        </NavLink>
      </nav>
    </div>
  );
}