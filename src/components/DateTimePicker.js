import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { PegarData } from '../controller/ControllerDataEHora';
import { addDays } from 'date-fns';

export default function DateTimePicker({ onChange, className }) {
    const [data, setDate] = useState(null);
    const [currentDate, setCurrentDate] = useState(null);

    const atualizarDataInicial = async () => {
        const now = new Date(await PegarData());
        setCurrentDate(now);
        setDate(now);
        if (onChange) onChange(now); // avisa o pai assim que carregar a data inicial
    }

    useEffect(() => {
        atualizarDataInicial();
    }, []);

    const handleDateChange = (date) => {
        setDate(date);
        if (onChange) onChange(date); // avisa o pai toda vez que mudar
    }

    return (
        <>
            {currentDate && (
                <DatePicker
                    selected={data}
                    onChange={handleDateChange}
                    minDate={currentDate}
                    maxDate={addDays(currentDate, 7)}
                    dateFormat="dd/MM/yyyy"
                    className={`h-[50px] p-3 text-lg w-full bg-white border border-gray-300 rounded-lg shadow-sm shadow-sm${className} cursor-pointer`}
                />
            )}
        </>
    );
}

