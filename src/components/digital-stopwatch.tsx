import React from "react";

interface DigitalStopwatchProps {
    /** Extra Tailwind classes */
    className?: string;
    /** Milliseconds elapsed */
    elapsedMs: number;
}

const DigitalStopwatch: React.FC<DigitalStopwatchProps> = React.memo(
    ({ className = "", elapsedMs = 0 }) => {
        const totalSeconds = Math.floor(elapsedMs / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const milliseconds = elapsedMs % 1000;

        const formatTime = (value: number, digits: number = 2) => {
            return value.toString().padStart(digits, "0");
        };

        return (
            <div
                className={`flex items-center justify-center ${className}`}
                role="timer"
                aria-label={`Timer showing ${minutes} minutes, ${seconds} seconds, ${milliseconds} milliseconds`}
            >
                <div className="bg-gray-900 text-white px-6 py-4 rounded-lg shadow-lg font-mono text-4xl font-bold tracking-wider min-w-max">
                    <span className="tabular-nums">
                        {formatTime(minutes)}:{formatTime(seconds)}.
                        {formatTime(milliseconds, 3)}
                    </span>
                </div>
            </div>
        );
    }
);

DigitalStopwatch.displayName = "DigitalStopwatch";

export default DigitalStopwatch;
