import React from 'react';
import { FaChartPie, FaChartLine, FaWallet, FaEnvelope, FaCog, FaSignOutAlt } from 'react-icons/fa';
import './styling/sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2 className="logo">CryptX</h2>
      </div>
      <ul className="sidebar-menu">
        <li className="sidebar-item active">
          <FaChartPie />
          <span>Overview</span>
        </li>
        <li className="sidebar-item">
          <FaChartLine />
          <span>Chart</span>
        </li>
        <li className="sidebar-item">
          <FaWallet />
          <span>Wallet</span>
        </li>
        <li className="sidebar-item">
          <FaEnvelope />
          <span>Mail Box</span>
        </li>
        <li className="sidebar-item">
          <FaCog />
          <span>Setting</span>
        </li>
      </ul>
      <div className="sidebar-footer">
        <FaSignOutAlt />
        <span>Logout</span>
      </div>
    </div>
  );
};

export default Sidebar;
