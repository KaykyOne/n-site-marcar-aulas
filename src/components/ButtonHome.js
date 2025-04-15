import React from 'react'

export default function ButtonBack({event}) {
    return (
        <div className='flex justify-end align-middle gap-1 cursor-pointer' onClick={event}>
            <span className="material-icons">home</span>
            <p>Início</p>
        </div>
    )
}
