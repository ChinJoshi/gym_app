"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useTimer } from "react-use-precision-timer";
import DigitalStopwatch from "@/components/digital-stopwatch";

export interface StopwatchRef {
    start: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
}

const StopwatchController = forwardRef<StopwatchRef>((_, ref) => {
    const [elapsedTime, setElapsedTime] = useState(0);

    const timer = useTimer(
        { delay: 10 },
        () => {
            setElapsedTime(timer.getElapsedStartedTime());
        }
    );

    useImperativeHandle(ref, () => ({
        start: timer.start,
        stop: timer.stop,
        pause: timer.pause,
        resume: timer.resume,
    }));

    return <DigitalStopwatch elapsedMs={elapsedTime} />;
});

StopwatchController.displayName = "StopwatchController";

export default StopwatchController;
