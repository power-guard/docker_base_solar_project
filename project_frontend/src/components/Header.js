import React from 'react';
import Logo from '../assets/logo.png'
import { Navbar } from 'react-bootstrap';

export const Header = () => {
  return (
    <Navbar className="header fixed-top">
        <Navbar.Brand href="#home">
          <img src={Logo} alt="Logo" />
        </Navbar.Brand>
    </Navbar>
  );
}
