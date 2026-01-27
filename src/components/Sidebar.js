import React from "react";
import { NavLink } from "react-router-dom";
import { HiOutlineHome , HiOutlineUsers , HiOutlineCog , HiOutlineLogout } from "react-icons/hi";
import { LuTrendingUp } from "react-icons/lu";
import "../styles/Sidebar.css";

export default function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <nav className="sidebar-nav">
                    <NavLink to="/home" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                        <HiOutlineHome size={24}/>
                    </NavLink>
                    <NavLink to="/dashboard" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                        <LuTrendingUp size={24}/>
                    </NavLink>
                    <NavLink to="/patientprofile" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                        <HiOutlineUsers size={24}/>
                    </NavLink>
                    <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
                        <HiOutlineCog size={24}/>
                    </NavLink>
                </nav>
            </div>
            <div className="sidebar-bottom">
                <NavLink to="/logout" className="nav-item">
                    <HiOutlineLogout size={24}/>
                </NavLink>
            </div>
        </div>
    )
}