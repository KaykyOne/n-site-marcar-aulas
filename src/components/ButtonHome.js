import React from 'react'

export default function ButtonBack({event}) {
    return (
        <div className='button-home' onClick={event}>
            <span className="material-icons">home</span>
            <p>Início</p>
        </div>
    )
}
