import React from 'react';

export default function Count({ num }) {
    const stylesArray = [];

    switch (num) {
        case 1:
            stylesArray[0] = 'darkgray';
            break;
        case 2:
            stylesArray[0] = 'darkgray';
            stylesArray[1] = 'darkgray';
            break;
        case 3:
            stylesArray[0] = 'darkgray';
            stylesArray[1] = 'darkgray';
            stylesArray[2] = 'darkgray';
            break;
        case 4:
            stylesArray[0] = 'darkgray';
            stylesArray[1] = 'darkgray';
            stylesArray[2] = 'darkgray';
            stylesArray[3] = 'darkgray';
            break;
        default:
            stylesArray[0] = 'lightgray';
            stylesArray[1] = 'lightgray';
            stylesArray[2] = 'lightgray';
            stylesArray[3] = 'lightgray';

    }
    return (
        <div style={styles.contador}>
            <div style={{
                ...styles.circle,
                ...(stylesArray[0] === 'darkgray' ? styles.blue : styles.lightgray)
            }} />
            <div style={{
                ...styles.circle,
                ...(stylesArray[1] === 'darkgray' ? styles.blue : styles.lightgray)
            }} />
            <div style={{
                ...styles.circle,
                ...(stylesArray[2] === 'darkgray' ? styles.blue : styles.lightgray)
            }} />
            <div style={{
                ...styles.circle,
                ...(stylesArray[3] === 'darkgray' ? styles.blue : styles.lightgray)
            }} />
        </div>
    )
}

const styles = {
    circle: {
        width: 15,
        height: 15,
        borderRadius: '50%',
        margin: 2,
    },
    blue: {
        backgroundColor: '#595959',
    },
    lightgray: {
        backgroundColor: 'lightgray',
    },
    contador: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
    },
};