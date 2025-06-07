import React, { useEffect, useState } from 'react';
import useInstrutor from '../../hooks/useInstrutor';
import { useNavigate } from 'react-router-dom';

export default function SelectAutoescola() {
    const { GetAutoescolas } = useInstrutor();
    const [autoescolas, setAutoescolas] = useState([]);
    const navigate = useNavigate();
    const instrutor_id = 1;

    useEffect(() => {
        async function fetchAutoescolas() {
            const autoescolasSearch = await GetAutoescolas(instrutor_id);
            setAutoescolas(autoescolasSearch);
        }

        fetchAutoescolas();
    }, [GetAutoescolas, instrutor_id]);

    const selecionarAutoescola = (id) => {
        sessionStorage.setItem('autoescola_id', id);
        navigate('/homeinstrutor');
    };

    return (
        <div className="flex flex-col gap-4 justify-center p-4">
            {autoescolas.map((autoescola) => (
                <div className='flex-1 p-2 rounded-md bg-white shadow-md' key={autoescola.autoescola_id}>
                    <h1 className='text-2xl font-bold'>{autoescola.nome}</h1>
                    <h1 className='font-medium'>{autoescola.endereco}</h1>
                    <button
                        onClick={() => selecionarAutoescola(autoescola.autoescola_id)}
                        className="bg-primary text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 w-full max-w-sm text-center"
                    >
                        Selecionar
                    </button>
                </div>

            ))}
        </div>
    );
}
