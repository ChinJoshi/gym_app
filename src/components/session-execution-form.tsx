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
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";

import endSession from "@/actions/end-session";

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
                            {/* <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="plan_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Plan Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div> */}

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
                                                                                    },
                                                                                ],
                                                                            }
                                                                        );
                                                                    }}
                                                                >
                                                                    +
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
                                                                    -
                                                                </Button>
                                                            </div>
                                                        </FormItem>

                                                        <NestedSets
                                                            exercise_index={
                                                                exercise_index
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
        </Form>
    );
}

function NestedSets({ exercise_index }: { exercise_index: number }) {
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
                    <div className="flex flex-row gap-3 my-2">
                        <Button
                            type="button"
                            onClick={() => {
                                sets_field_array.insert(set_index + 1, {
                                    reps: "",
                                    weight: "",
                                    duration: "",
                                });
                            }}
                        >
                            +
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
                            -
                        </Button>
                        <Button type="button" variant="outline">
                            <Check />
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    );
}
