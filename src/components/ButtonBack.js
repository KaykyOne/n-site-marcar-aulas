import React from 'react'

export default function ButtonBack({event, className = null}) {
    return (
        <div className={`flex justify-start align-middle gap-1 cursor-pointer ${className}`} onClick={event}>
            <span className="material-icons">arrow_back</span>
            <p>Voltar</p>
        </div>
    )
}
