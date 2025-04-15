import React from 'react'

export default function ButtonBack({event}) {
    return (
        <div className='flex  justify-start align-middle gap-1 cursor-pointer' onClick={event}>
            <span className="material-icons">arrow_back</span>
            <p>Voltar</p>
        </div>
    )
}
