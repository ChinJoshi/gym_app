"use client";
import {
    useForm,
    SubmitHandler,
    useFieldArray,
    useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { planEditor } from "@/zod-types";
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
import { updatePlan } from "@/actions/update-plan";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Minus, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";

type PlanEditorFormProps = {
    exercises: {
        id: string;
        name: string;
        muscle_group: string | null;
        equipment: string | null;
        is_custom: boolean | null;
        user_id: string | null;
    }[];
    plan: z.infer<typeof planEditor> & { id: string };
};

export default function PlanEditorForm({
    exercises,
    plan,
}: PlanEditorFormProps) {
    const form = useForm<z.infer<typeof planEditor>>({
        resolver: zodResolver(planEditor),
        defaultValues: {
            plan_name: plan.plan_name,
            exercises: plan.exercises,
        },
    });

    const exercises_field_array = useFieldArray({
        control: form.control,
        name: "exercises",
    });

    const onSubmitSuccess: SubmitHandler<z.infer<typeof planEditor>> = async (
        data
    ) => {
        await updatePlan(data, plan.id);
    };

    return (
        <Form {...form}>
            <Card className="min-w-fit">
                <CardHeader>
                    <CardTitle className="text-2xl wrap-anywhere">
                        {form.watch("plan_name") || "Plan"}
                    </CardTitle>
                    <CardDescription>Edit your plan</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmitSuccess)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="plan_name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Plan Name</FormLabel>
                                            <FormControl className="max-w-lg">
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col gap-6">
                                {exercises_field_array.fields.map(
                                    (exercise, exercise_index) => (
                                        <div
                                            key={exercise.id}
                                            className="flex flex-col gap-6"
                                        >
                                            <FormField
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
                                                                    <Popover>
                                                                        <PopoverTrigger
                                                                            asChild
                                                                        >
                                                                            <FormControl>
                                                                                <Button
                                                                                    variant="outline"
                                                                                    role="combobox"
                                                                                    className={cn(
                                                                                        "w-40 sm:w-60 justify-between",
                                                                                        !field.value &&
                                                                                            "text-muted-foreground"
                                                                                    )}
                                                                                >
                                                                                    <span className="truncate">
                                                                                        {field.value
                                                                                            ? field.value
                                                                                            : "Select exercise"}
                                                                                    </span>
                                                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                                                </Button>
                                                                            </FormControl>
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
                                                                                        {exercises.map(
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
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() => {
                                                                            exercises_field_array.insert(
                                                                                exercise_index +
                                                                                    1,
                                                                                {
                                                                                    id: `new-exercise-${Date.now()}`,
                                                                                    exercise:
                                                                                        "",
                                                                                    exerciseId:
                                                                                        "",
                                                                                    sets: [
                                                                                        {
                                                                                            id: `new-set-${Date.now()}`,
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
                                                            />
                                                        </div>
                                                    );
                                                }}
                                            />
                                            <hr />
                                        </div>
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
                                    className="w-fit"
                                >
                                    Update Plan
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
    const form = useFormContext<z.infer<typeof planEditor>>();
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
                                        <FormControl className="max-w-20">
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
                                        <FormControl className="max-w-20">
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
                                        <FormControl className="max-w-20">
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
                                    id: `new-set-${Date.now()}`,
                                    reps: "",
                                    weight: "",
                                    duration: "",
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
                    </div>
                </div>
            ))}
        </div>
    );
}
