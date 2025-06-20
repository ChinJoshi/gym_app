"use client";
import {
    useForm,
    SubmitHandler,
    useFieldArray,
    useFormContext,
    SubmitErrorHandler,
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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Ellipsis } from "lucide-react";
import { PlusButton } from "@/components/ui/plus-button";
import { MinusButton } from "@/components/ui/minus-button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import endSession from "@/actions/end-session";
import React, { useRef, useState } from "react";
import StopwatchController, { StopwatchRef } from "./stopwatch-controller";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

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
    // // ✅ This callback runs only once, on the very first render:
    const [initialValues] = useState(() => {
        const saved =
            typeof window !== "undefined" &&
            localStorage.getItem(`sessionExecutionForm-${props.sessionId}`);

        if (saved) {
            return saved;
        } else {
            return undefined;
        }
    });

    const [accordionState, setAccordionState] = useState(["0"]);

    const form = useForm<z.infer<typeof sessionExecution>>({
        resolver: zodResolver(sessionExecution),
        defaultValues: initialValues ? JSON.parse(initialValues) : props.plan,
    });

    const exercises_field_array = useFieldArray({
        control: form.control,
        name: "exercises",
    });

    form.watch((value) => {
        localStorage.setItem(
            `sessionExecutionForm-${props.sessionId}`,
            JSON.stringify(value)
        );
    });

    const onSubmitSuccess: SubmitHandler<
        z.infer<typeof sessionExecution>
    > = async (data) => {
        await endSession(data, props.sessionId);
    };

    const onInvalid: SubmitErrorHandler<
        z.infer<typeof sessionExecution>
    > = async (errors) => {
        errors.exercises?.forEach!((error, error_index) => {
            if (error) {
                if (!accordionState.includes(error_index.toString())) {
                    accordionState.push(error_index.toString());
                    setAccordionState(accordionState);
                }
            }
        });
    };

    const timerRef = useRef<StopwatchRef>(null);

    return (
        <Form {...form}>
            <div className="flex justify-center mb-8">
                <StopwatchController ref={timerRef} />
            </div>
            <Card className="min-w-fit">
                <CardHeader>
                    <CardTitle className="text-2xl wrap-anywhere">
                        {props.plan.plan_name}
                    </CardTitle>
                    <CardDescription className="wrap-anywhere">
                        Executing a session of your &quot;{props.plan.plan_name}
                        &quot; plan
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={form.handleSubmit(onSubmitSuccess, onInvalid)}
                    >
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-6 relative">
                                {/* Hidden reference layout to maintain consistent width */}
                                <div className="invisible max-h-0 -mb-6">
                                    <div className="flex flex-row gap-3 my-2">
                                        <Button
                                            variant="outline"
                                            className="w-40 sm:w-60 justify-between"
                                        >
                                            <span className="truncate">
                                                Sample Exercise Name
                                            </span>
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                        <PlusButton />
                                        <MinusButton />
                                    </div>
                                    <div className="flex flex-row gap-3 items-end my-2">
                                        <div>
                                            <div className="flex items-center">
                                                <FormLabel>Reps </FormLabel>
                                            </div>
                                            <Input placeholder="0" />
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <FormLabel className="text-nowrap">
                                                    Weight (lb){" "}
                                                </FormLabel>
                                            </div>
                                            <Input placeholder="0" />
                                        </div>
                                        <div>
                                            <div className="flex items-center">
                                                <FormLabel className="text-nowrap">
                                                    Duration (s)
                                                </FormLabel>
                                            </div>
                                            <Input placeholder="0" />
                                        </div>
                                        <div className="flex flex-row gap-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                            >
                                                <Check />
                                            </Button>
                                            <Button variant="ghost">
                                                <Ellipsis />
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                <Accordion
                                    type="multiple"
                                    defaultValue={accordionState}
                                    value={accordionState}
                                    onValueChange={(value) => {
                                        setAccordionState(value);
                                        console.log(value);
                                    }}
                                >
                                    {exercises_field_array.fields.map(
                                        (exercise, exercise_index) => (
                                            <div
                                                key={exercise.id}
                                                className="flex flex-col gap-6"
                                            >
                                                <AccordionItem
                                                    key={exercise.id}
                                                    value={exercise_index.toString()}
                                                >
                                                    <FormField
                                                        key={exercise.id}
                                                        control={form.control}
                                                        name={`exercises.${exercise_index}.exercise`}
                                                        render={({ field }) => {
                                                            return (
                                                                <div>
                                                                    <AccordionTrigger>
                                                                        <FormLabel>
                                                                            {field.value ||
                                                                                "Select Exercise"}
                                                                        </FormLabel>
                                                                    </AccordionTrigger>
                                                                    <AccordionContent>
                                                                        <FormItem>
                                                                            <div className="flex flex-row gap-3 my-2">
                                                                                <Popover>
                                                                                    <PopoverTrigger
                                                                                        asChild
                                                                                    >
                                                                                        <Button
                                                                                            variant="outline"
                                                                                            role="combobox"
                                                                                            className={cn(
                                                                                                "w-40 sm:w-60 justify-between",
                                                                                                !field.value &&
                                                                                                    "text-muted-foreground"
                                                                                            )}
                                                                                        >
                                                                                            <FormControl>
                                                                                                <span className="truncate">
                                                                                                    {field.value
                                                                                                        ? field.value
                                                                                                        : "Select exercise"}
                                                                                                </span>
                                                                                            </FormControl>

                                                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                                        </Button>
                                                                                    </PopoverTrigger>

                                                                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
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

                                                                                <PlusButton
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
                                                                                />
                                                                                <MinusButton
                                                                                    onClick={() => {
                                                                                        if (
                                                                                            exercises_field_array
                                                                                                .fields
                                                                                                .length >
                                                                                            1
                                                                                        ) {
                                                                                            let newAccordianState =
                                                                                                accordionState
                                                                                                    .filter(
                                                                                                        (
                                                                                                            item
                                                                                                        ) =>
                                                                                                            item !==
                                                                                                            exercise_index.toString()
                                                                                                    )
                                                                                                    .map(
                                                                                                        (
                                                                                                            item
                                                                                                        ) => {
                                                                                                            if (
                                                                                                                Number(
                                                                                                                    item
                                                                                                                ) >
                                                                                                                exercise_index
                                                                                                            ) {
                                                                                                                return (
                                                                                                                    Number(
                                                                                                                        item
                                                                                                                    ) -
                                                                                                                    1
                                                                                                                ).toString();
                                                                                                            } else {
                                                                                                                return item;
                                                                                                            }
                                                                                                        }
                                                                                                    );
                                                                                            if (
                                                                                                newAccordianState.length <
                                                                                                1
                                                                                            ) {
                                                                                                newAccordianState =
                                                                                                    [
                                                                                                        "0",
                                                                                                    ];
                                                                                            }
                                                                                            setAccordionState(
                                                                                                newAccordianState
                                                                                            );
                                                                                            exercises_field_array.remove(
                                                                                                exercise_index
                                                                                            );
                                                                                        }
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </FormItem>

                                                                        <NestedSets
                                                                            exercise_index={
                                                                                exercise_index
                                                                            }
                                                                            timerRef={
                                                                                timerRef
                                                                            }
                                                                        />
                                                                    </AccordionContent>
                                                                </div>
                                                            );
                                                        }}
                                                    />
                                                </AccordionItem>
                                            </div>
                                        )
                                    )}
                                </Accordion>
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
        </Form>
    );
}

function NestedSets({
    exercise_index,
    timerRef,
}: {
    exercise_index: number;
    timerRef: React.RefObject<StopwatchRef | null>;
}) {
    const form = useFormContext<z.infer<typeof sessionExecution>>();
    const sets_field_array = useFieldArray({
        control: form.control,
        name: `exercises.${exercise_index}.sets` as const,
    });

    return (
        <div>
            {sets_field_array.fields.map((set, set_index) => (
                <div
                    key={set.id}
                    className="flex flex-row gap-3 items-end my-2"
                >
                    {/* <Label className="my-5">Set {set_index + 1}</Label> */}
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
                                            <FormLabel className="text-nowrap">
                                                Weight (lb){" "}
                                            </FormLabel>
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
                                            <FormLabel className="text-nowrap">
                                                Duration (s)
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Input {...field} placeholder="0" />
                                        </FormControl>
                                    </FormItem>
                                </div>
                            );
                        }}
                    />
                    <div className="flex flex-row gap-1">
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
                                                            field.value ===
                                                            "true"
                                                        ) {
                                                            timerRef.current?.stop();
                                                        } else {
                                                            timerRef.current?.stop();
                                                            timerRef.current?.start();
                                                        }
                                                        form.setValue(
                                                            `exercises.${exercise_index}.sets.${set_index}.completed`,
                                                            field.value ===
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost">
                                    <Ellipsis />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem
                                    onClick={() => {
                                        sets_field_array.insert(set_index + 1, {
                                            reps: "",
                                            weight: "",
                                            duration: "",
                                            completed: "false",
                                        });
                                    }}
                                >
                                    Insert Set Below
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        if (
                                            sets_field_array.fields.length > 1
                                        ) {
                                            sets_field_array.remove(set_index);
                                        }
                                    }}
                                    disabled={
                                        sets_field_array.fields.length <= 1
                                    }
                                >
                                    Remove Set
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            ))}
        </div>
    );
}
