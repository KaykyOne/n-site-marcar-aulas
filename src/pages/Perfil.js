import React from 'react';
import Navbar from '../components/Navbar';

export default function Perfil() {
    return (
        <div style={styles.container}>
            <div>Perfil</div>
            <Navbar />
        </div>
    )
}

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        height: '100vh',
    },
    welcomeText: {
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    },
    fullWidthButton: {
        width: '100%',
        backgroundColor: 'blue',
        borderRadius: '8px',
        color: '#fff',
        fontWeight: 'bold',
        padding: '15px',
        cursor: 'pointer',
        marginBottom: '10px',
    },
    fullWidthButton2: {
        width: '100%',
        backgroundColor: '#FFC601',
        borderRadius: '8px',
        color: 'black',
        fontWeight: 'bold',
        padding: '15px',
        cursor: 'pointer',
        marginBottom: '10px',
    },
    buttonBack: {
        width: '40%',
        backgroundColor: 'gray',
        borderRadius: '8px',
        color: '#fff',
        fontWeight: 'bold',
        padding: '10px',
        cursor: 'pointer',
        marginTop: '20px',
    },
    modalContent: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: 'blue',
        color: '#fff',
        padding: '10px 20px',
        marginTop: '10px',
        cursor: 'pointer',
        borderRadius: '5px',
    },
};