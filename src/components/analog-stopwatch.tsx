interface AnalogStopwatchProps {
    /** Milliseconds elapsed */
    elapsedMs: number;
    /** Diameter of clock face in pixels (defaults to 240) */
    size?: number;
    /** Extra Tailwind classes */
    className?: string;
}

/**
 * A lightweight, purely‑computational analog stopwatch.
 * It draws minute, second and millisecond hands positioned
 * directly from the `elapsedMs` prop – no animation libs required.
 */
const AnalogStopwatch: React.FC<AnalogStopwatchProps> = ({
    elapsedMs,
    size = 240,
    className = "",
}) => {
    const radius = size / 2;
    const ticks = Array.from({ length: 60 });

    // Break the elapsed time down
    const ms = elapsedMs % 1000;
    const totalSeconds = Math.floor(elapsedMs / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60) % 60;

    // Convert to angles (degrees)
    const minuteAngle = minutes * 6; // 360 / 60
    const secondAngle = seconds * 6 + ms * 0.006; // one rotation per minute

    /** Returns inline‑style for a hand. */
    const handStyle = (
        deg: number,
        width: number,
        length: number,
        color: string
    ) => ({
        width: `${width}px`,
        height: `${length}px`,
        backgroundColor: color,
        position: "absolute" as const,
        bottom: radius,
        left: `calc(50% - ${width / 2}px)`,
        borderRadius: "9999px",
        transformOrigin: "bottom",
        transform: `rotate(${deg}deg)`,
    });

    return (
        <div
            className={`relative select-none ${className}`}
            style={{ width: size, height: size }}
            role="img"
            aria-label={`Stopwatch showing ${minutes} minutes, ${seconds} seconds, ${ms} milliseconds`}
        >
            {/* Dial background */}
            <div className="absolute inset-0 rounded-full bg-white shadow-2xl flex items-center justify-center">
                {/* Dial + tick marks */}
                <svg
                    width={size}
                    height={size}
                    viewBox={`0 0 ${size} ${size}`}
                    className="absolute inset-0"
                >
                    <defs>
                        <linearGradient
                            id="grad"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                        >
                            <stop offset="0%" stopColor="#f9fafb" />
                            <stop offset="100%" stopColor="#e5e7eb" />
                        </linearGradient>
                    </defs>
                    <circle
                        cx={radius}
                        cy={radius}
                        r={radius - 4}
                        fill="url(#grad)"
                        strokeWidth="4"
                        className="stroke-gray-300"
                    />
                    {/* 60 tick marks */}
                    {ticks.map((_, i) => {
                        const angle = (i * 6 * Math.PI) / 180;
                        const inner = radius - (i % 5 === 0 ? 16 : 8);
                        const outer = radius - 4;
                        const x1 =
                            Math.round(
                                (radius + inner * Math.sin(angle)) * 1000
                            ) / 1000;
                        const y1 =
                            Math.round(
                                (radius - inner * Math.cos(angle)) * 1000
                            ) / 1000;
                        const x2 =
                            Math.round(
                                (radius + outer * Math.sin(angle)) * 1000
                            ) / 1000;
                        const y2 =
                            Math.round(
                                (radius - outer * Math.cos(angle)) * 1000
                            ) / 1000;
                        return (
                            <line
                                key={i}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke="#6b7280"
                                strokeWidth={i % 5 === 0 ? 3 : 1.5}
                                strokeLinecap="round"
                            />
                        );
                    })}
                </svg>

                {/* Hands */}
                <div
                    style={handStyle(minuteAngle, 4, radius - 32, "#374151")}
                />
                <div
                    style={handStyle(secondAngle, 6, radius - 20, "#111827")}
                />
                {/* <div style={handStyle(milliAngle, 2, radius - 12, "#ef4444")} /> */}

                {/* Center cap */}
                <div className="absolute w-3 h-3 rounded-full bg-gray-800"></div>
            </div>
        </div>
    );
};

export default AnalogStopwatch;
