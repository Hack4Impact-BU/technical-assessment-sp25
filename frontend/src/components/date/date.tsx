import "./date.css";
import React, { useState } from "react";

const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`
};

const DateNavigator: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const [isCurrentDate, setDateStatus] = useState(true);

    const PrevDay = (): void => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 1);
        setCurrentDate(newDate);
        toggleDateStatus(false);
    };

    const NextDay = (): void => {
        if (formatDate(currentDate) !== formatDate(new Date())) {
            const newDate = new Date(currentDate);
            newDate.setDate(newDate.getDate() + 1);
            setCurrentDate(newDate);
        }else{
            toggleDateStatus(true);
        }
    };

    const toggleDateStatus = (newStatus: boolean): void => {
        setDateStatus(newStatus);
    }

    return (
        <div className="date-container">
            <button className="nav-button" onClick={PrevDay}>Previous Day</button>
            <span className="date-text">{formatDate(currentDate)}</span>
            {!isCurrentDate && (
                <button className="nav-button" onClick={NextDay}>Next Day</button>
            )}
        </div>
    );
};

export default DateNavigator;