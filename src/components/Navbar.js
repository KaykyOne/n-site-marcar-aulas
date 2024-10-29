import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav style={styles.navbar}>
            <Link to="/home" style={styles.link}>Home</Link>
            <Link to="/perfil" style={styles.link}>Perfil</Link>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-around',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        position: 'fixed',
        bottom: 0,
        width: '100%',
    },
    link: {
        textDecoration: 'none',
        color: 'blue',
    },
};

export default Navbar;
