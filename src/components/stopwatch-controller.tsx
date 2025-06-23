"use client";

import React, { useState, forwardRef, useImperativeHandle } from "react";
import { useTimer } from "react-use-precision-timer";
import { DigitalStopwatch } from "@/components/digital-stopwatch";

export interface StopwatchRef {
    start: () => void;
    stop: () => void;
    pause: () => void;
    resume: () => void;
}

export type StopwatchControllerProps = {
    label?: string;
    initialTime: number;
    localStorageLocation?: string;
    saveRate?: number;
};

const StopwatchController = forwardRef<StopwatchRef, StopwatchControllerProps>(
    (props, ref) => {
        const [elapsedTime, setElapsedTime] = useState(0);
        const [lastSaveTime, setLastSaveTime] = useState(0);

        const timer = useTimer({ delay: 10 }, () => {
            const newElapsedTime =
                timer.getElapsedStartedTime() + props.initialTime;
            if (
                props.localStorageLocation &&
                props.saveRate &&
                newElapsedTime - lastSaveTime >= props.saveRate
            ) {
                localStorage.setItem(
                    props.localStorageLocation,
                    newElapsedTime.toString()
                );
                setLastSaveTime(newElapsedTime);
            }
            setElapsedTime(newElapsedTime);
        });

        useImperativeHandle(ref, () => ({
            start: timer.start,
            stop: timer.stop,
            pause: timer.pause,
            resume: timer.resume,
        }));

        return <DigitalStopwatch elapsedMs={elapsedTime} label={props.label} />;
    }
);

StopwatchController.displayName = "StopwatchController";

export default StopwatchController;
