import React from 'react'

export default function ButtonBack({event}) {
    return (
        <div className='button-back' onClick={event}>
            <span className="material-icons">arrow_back</span>
            <p>Voltar</p>
        </div>
    )
}
