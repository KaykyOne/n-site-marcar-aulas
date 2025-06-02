import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { addDays } from 'date-fns';

export default function DateTimePicker({ onChange, className }) {
    const [data, setDate] = useState(null);

    const handleDateChange = (date) => {
        setDate(date);
        if (onChange) onChange(date); // avisa o pai toda vez que mudar
    }

    return (
        <>
            {new Date() && (
                <DatePicker
                    selected={data}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    maxDate={addDays(new Date(), 7)}
                    dateFormat="dd/MM/yyyy"
                    className={`h-[50px] p-3 text-lg w-full bg-white border border-gray-300 rounded-lg shadow-sm shadow-sm${className} cursor-pointer`}
                />
            )}
        </>
    );
}

