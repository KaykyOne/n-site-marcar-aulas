import React, { useState } from 'react'
import { addDays, format, isSameDay } from 'date-fns';

export default function DatePicker({ dias, onChange }) {
    const [selectedDate, setSelectedDate] = useState();
    const namesForDays = ["Erro", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"];
    const namesForDaysMim = ["Err", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

    function selecionarHoje() {
        const hoje = new Date();
        setSelectedDate(hoje);
        onChange && onChange(hoje);
    }

    function selecionarAmanha() {
        const amanha = addDays(new Date(), 1);
        setSelectedDate(amanha);
        onChange && onChange(amanha);
    }

    function CalendarioInline() {
        let datas = [];
        const hoje = new Date();

        for (let i = 0; i < dias; i++) {
            const data = new Date(hoje);
            data.setDate(hoje.getDate() + i);
            datas.push(data);
        }
        return (
            <div className='flex flex-wrap gap-1 md:gap-2 lg:gap-4'>
                {datas.map(data =>
                (
                    <button className='flex gap-1 w-[60px] flex-col items-center' onClick={() => {setSelectedDate(data); onChange(data)}} key={data}>
                        <h2 className='text-sm'>{namesForDaysMim[format(data, 'i')]}</h2>
                        <div className={`p-1 rounded-full aspect-square w-[40px] h-[40px] ${isSameDay(selectedDate, data) && 'bg-primary text-white'}`}>
                            <h1 className='text-lg font-bold'>{data.getDate()}</h1>
                        </div>
                    </button>
                )
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 items-center relative p-4 border border-gray-200 rounded-lg shadow bg-gray-100 w-full max-w-md">
            {/* Seletor principal com setas */}
            <h1 className='font-medium'>{selectedDate ? namesForDays[format(selectedDate, 'i')] : 'Selecione uma data'}</h1>
            <div className="flex items-center justify-center gap-2 w-full">
                <CalendarioInline />
            </div>

            {/* Botões rápidos */}
            <div className="flex flex-wrap justify-center gap-3 w-full">
                <button
                    onClick={() => selecionarHoje()}
                    className="flex bg-gray-100 border flex-1 border-gray-400 px-4 py-2 rounded-full font-semibold gap-2 justify-center items-center hover:bg-primary hover:text-white transition duration-300">
                    <span className="material-icons">
                        wb_sunny
                    </span>
                    Hoje
                </button>
                <button
                    onClick={() => selecionarAmanha()}
                    className="flex bg-gray-100 border flex-1 border-gray-400 px-4 py-2 rounded-full font-semibold gap-2 justify-center items-center hover:bg-primary hover:text-white transition duration-300">
                    <span className="material-icons">
                        date_range
                    </span>
                    Amanhã
                </button>
            </div>
        </div>
    )
}
