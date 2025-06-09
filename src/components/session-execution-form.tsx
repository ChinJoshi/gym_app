// according to: https://news.ycombinator.com/item?id=41978038
// the general pattern seems to be, allow the user to input anything in a field, and show validation issues after
"use client";
import {
    useForm,
    SubmitHandler,
    useFieldArray,
    useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionExecution } from "@/zod-types";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Plus, Minus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import { useTimer, Timer } from "react-use-precision-timer";
import endSession from "@/actions/end-session";
import React, { useState } from "react";

interface StopwatchProps {
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
const Stopwatch: React.FC<StopwatchProps> = ({
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

export default function SessionExecutionForm(props: {
    plan: z.infer<typeof sessionExecution>;
    sessionId: string;
    exercises: {
        id: string;
        name: string;
        muscle_group: string | null;
        equipment: string | null;
        is_custom: boolean | null;
        user_id: string | null;
    }[];
}) {
    const form = useForm<z.infer<typeof sessionExecution>>({
        resolver: zodResolver(sessionExecution),
        defaultValues: props.plan,
    });

    const exercises_field_array = useFieldArray({
        control: form.control,
        name: "exercises",
    });

    const onSubmitSuccess: SubmitHandler<
        z.infer<typeof sessionExecution>
    > = async (data) => {
        await endSession(data, props.sessionId);
    };
    const [elapsedTime, setElapsedTime] = useState(0);
    const timer = useTimer({ delay: 100 }, () => {
        setElapsedTime(timer.getElapsedStartedTime());
    });

    return (
        <Form {...form}>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">
                        {form.watch("plan_name") || "Plan"}
                    </CardTitle>
                    <CardDescription>
                        Executing a session of your &quot;
                        {props.plan.plan_name}
                        &quot; plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmitSuccess)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                {exercises_field_array.fields.map(
                                    (exercise, exercise_index) => (
                                        <FormField
                                            key={exercise.id}
                                            control={form.control}
                                            name={`exercises.${exercise_index}.exercise`}
                                            render={({ field }) => {
                                                return (
                                                    <div>
                                                        <FormItem>
                                                            <div className="flex items-center">
                                                                <FormLabel>
                                                                    Exercise{" "}
                                                                    {exercise_index +
                                                                        1}
                                                                </FormLabel>
                                                            </div>
                                                            <div className="flex flex-row gap-3 my-2">
                                                                <FormControl>
                                                                    <Popover>
                                                                        <PopoverTrigger
                                                                            asChild
                                                                        >
                                                                            <FormControl>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    role="combobox"
                                                                                    className={cn(
                                                                                        "w-[300px] justify-between",
                                                                                        !field.value &&
                                                                                            "text-muted-foreground"
                                                                                    )}
                                                                                >
                                                                                    {field.value
                                                                                        ? field.value
                                                                                        : "Select exercise"}
                                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                                </Button>
                                                                            </FormControl>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-[300px] p-0">
                                                                            <Command>
                                                                                <CommandInput placeholder="Search exercises..." />
                                                                                <CommandList>
                                                                                    <CommandEmpty>
                                                                                        No
                                                                                        exercise
                                                                                        found.
                                                                                    </CommandEmpty>
                                                                                    <CommandGroup>
                                                                                        {props.exercises.map(
                                                                                            (
                                                                                                exercise
                                                                                            ) => (
                                                                                                <CommandItem
                                                                                                    value={
                                                                                                        exercise.name
                                                                                                    }
                                                                                                    key={
                                                                                                        exercise.id
                                                                                                    }
                                                                                                    onSelect={() => {
                                                                                                        form.setValue(
                                                                                                            `exercises.${exercise_index}.exercise`,
                                                                                                            exercise.name
                                                                                                        );
                                                                                                        form.setValue(
                                                                                                            `exercises.${exercise_index}.exerciseId`,
                                                                                                            exercise.id
                                                                                                        );
                                                                                                    }}
                                                                                                >
                                                                                                    {
                                                                                                        exercise.name
                                                                                                    }
                                                                                                    <Check
                                                                                                        className={cn(
                                                                                                            "ml-auto",
                                                                                                            exercise.name ===
                                                                                                                field.value
                                                                                                                ? "opacity-100"
                                                                                                                : "opacity-0"
                                                                                                        )}
                                                                                                    />
                                                                                                </CommandItem>
                                                                                            )
                                                                                        )}
                                                                                    </CommandGroup>
                                                                                </CommandList>
                                                                            </Command>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                    {/* <Input
                                                                        {...field}
                                                                    /> */}
                                                                </FormControl>
                                                                <Button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        exercises_field_array.insert(
                                                                            exercise_index +
                                                                                1,
                                                                            {
                                                                                exercise:
                                                                                    "",
                                                                                exerciseId:
                                                                                    "",
                                                                                sets: [
                                                                                    {
                                                                                        reps: "",
                                                                                        weight: "",
                                                                                        duration:
                                                                                            "",
                                                                                        completed:
                                                                                            "false",
                                                                                    },
                                                                                ],
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    <Plus />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="destructive"
                                                                    onClick={() => {
                                                                        if (
                                                                            exercises_field_array
                                                                                .fields
                                                                                .length >
                                                                            1
                                                                        ) {
                                                                            exercises_field_array.remove(
                                                                                exercise_index
                                                                            );
                                                                        }
                                                                    }}
                                                                >
                                                                    <Minus />
                                                                </Button>
                                                            </div>
                                                        </FormItem>

                                                        <NestedSets
                                                            exercise_index={
                                                                exercise_index
                                                            }
                                                            timer={timer}
                                                            setElapsedTime={
                                                                setElapsedTime
                                                            }
                                                        />
                                                    </div>
                                                );
                                            }}
                                        />
                                    )
                                )}
                                {form.formState.errors.root && (
                                    <FormMessage>
                                        {form.formState.errors.root.message}
                                    </FormMessage>
                                )}
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    disabled={form.formState.isSubmitting}
                                    type="submit"
                                    className="w-full"
                                >
                                    End Session
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
            <div className="flex justify-center my-8">
                <Stopwatch elapsedMs={elapsedTime}></Stopwatch>
            </div>
        </Form>
    );
}

function NestedSets({
    exercise_index,
    timer,
    setElapsedTime,
}: {
    exercise_index: number;
    timer: Timer;
    setElapsedTime: React.Dispatch<React.SetStateAction<number>>;
}) {
    const form = useFormContext<z.infer<typeof sessionExecution>>();
    const sets_field_array = useFieldArray({
        control: form.control,
        name: `exercises.${exercise_index}.sets` as const,
    });

    // const callback = React.useCallback(() => console.log("boom"), []);
    // The callback will be called every 1000 milliseconds.

    return (
        <div>
            {sets_field_array.fields.map((set, set_index) => (
                <div
                    key={set.id}
                    className="flex flex-row gap-3 items-end my-2"
                >
                    <Label className="my-5">Set {set_index + 1}</Label>
                    <FormField
                        control={form.control}
                        name={
                            `exercises.${exercise_index}.sets.${set_index}.reps` as const
                        }
                        render={({ field }) => {
                            return (
                                <div>
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Reps </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input {...field} placeholder="0" />
                                        </FormControl>
                                    </FormItem>
                                </div>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name={`exercises.${exercise_index}.sets.${set_index}.weight`}
                        render={({ field }) => {
                            return (
                                <div>
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Weight </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input {...field} placeholder="0" />
                                        </FormControl>
                                    </FormItem>
                                </div>
                            );
                        }}
                    />

                    <FormField
                        control={form.control}
                        name={`exercises.${exercise_index}.sets.${set_index}.duration`}
                        render={({ field }) => {
                            return (
                                <div>
                                    <FormItem>
                                        <div className="flex items-center">
                                            <FormLabel>Duration </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input {...field} placeholder="0" />
                                        </FormControl>
                                    </FormItem>
                                </div>
                            );
                        }}
                    />
                    <div className="flex flex-row gap-3">
                        <Button
                            type="button"
                            onClick={() => {
                                sets_field_array.insert(set_index + 1, {
                                    reps: "",
                                    weight: "",
                                    duration: "",
                                    completed: "false",
                                });
                            }}
                        >
                            <Plus />
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                if (sets_field_array.fields.length > 1) {
                                    sets_field_array.remove(set_index);
                                }
                            }}
                        >
                            <Minus />
                        </Button>
                        <FormField
                            control={form.control}
                            name={`exercises.${exercise_index}.sets.${set_index}.completed`}
                            render={({ field }) => {
                                return (
                                    <div>
                                        <FormItem>
                                            <FormControl>
                                                <Button
                                                    type="button"
                                                    variant={
                                                        field.value === "true"
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    className={
                                                        field.value === "true"
                                                            ? "bg-green-600 hover:bg-green-600"
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        if (
                                                            field.value ==
                                                            "true"
                                                        ) {
                                                            timer.stop();
                                                            setElapsedTime(0);
                                                        } else {
                                                            setElapsedTime(0);
                                                            timer.start();
                                                        }
                                                        form.setValue(
                                                            `exercises.${exercise_index}.sets.${set_index}.completed`,
                                                            field.value ==
                                                                "true"
                                                                ? "false"
                                                                : "true"
                                                        );
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            field.value ===
                                                                "true"
                                                                ? "opacity-100"
                                                                : "opacity-20"
                                                        )}
                                                    />
                                                </Button>
                                            </FormControl>
                                        </FormItem>
                                    </div>
                                );
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
