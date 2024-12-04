import { useState, useEffect } from 'react';

export default function useDate(date: Date = new Date()) {
    const [ currentDate, setCurrentDate ] = useState(date);
    const [ incrementDisabled, setIncrementDisabled ] = useState(false);

    useEffect(() => {
        if (currentDate.getDate() === new Date().getDate()) {
            setIncrementDisabled(true);
        } else {
            setIncrementDisabled(false);
        }
    }, [currentDate]);

    const incrementDate = () => {
        if (incrementDisabled) {
            return;
        }
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 1);
        setCurrentDate(newDate);
    };

    const decrementDate = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
    }

    return { currentDate, incrementDate, decrementDate, incrementDisabled };
}