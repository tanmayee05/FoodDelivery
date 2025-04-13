import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/' className="sidebar-option">
          <HomeIcon fontSize="large" />
          <p>Home</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option">
          <AddBoxIcon fontSize="large" />
          <p>Add Items</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <ListIcon fontSize="large" />
          <p>List Items</p>
        </NavLink>
        <NavLink to='/orders' className="sidebar-option">
          <ShoppingCartIcon fontSize="large" />
          <p>Orders</p>
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
