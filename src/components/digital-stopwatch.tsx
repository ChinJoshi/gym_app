import React from "react";

interface DigitalStopwatchProps {
    /** Extra Tailwind classes */
    className?: string;
    /** Milliseconds elapsed */
    elapsedMs: number;
    label?: string;
}

const DigitalStopwatch: React.FC<DigitalStopwatchProps> = React.memo(
    ({ label = "", className = "", elapsedMs = 0 }) => {
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
                <div className="flex flex-col bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg font-mono text-lg font-bold tracking-wider min-w-max">
                    <span className="tabular-nums text-center">
                        {formatTime(minutes)}:{formatTime(seconds)}.
                        {formatTime(milliseconds, 3)}
                    </span>
                    {label && (
                        <div className="text-sm text-center">{label}</div>
                    )}
                </div>
            </div>
        );
    }
);

DigitalStopwatch.displayName = "DigitalStopwatch";

export { DigitalStopwatch };
