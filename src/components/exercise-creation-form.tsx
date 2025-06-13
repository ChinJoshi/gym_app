"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseCreator } from "@/zod-types";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
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
import createExerciseAction from "@/actions/create-exercise";

export default function ExerciseCreationForm() {
    const form = useForm<z.infer<typeof exerciseCreator>>({
        resolver: zodResolver(exerciseCreator),
        defaultValues: {
            name: "",
            muscle_group: "",
            equipment: "",
        },
    });

    const onSubmitSuccess: SubmitHandler<
        z.infer<typeof exerciseCreator>
    > = async (data) => {
        await createExerciseAction(data);
        form.reset();
    };

    return (
        <Form {...form}>
            <Card className="min-w-fit">
                <CardHeader>
                    <CardTitle className="text-2xl wrap-anywhere">
                        Create a new exercise
                    </CardTitle>
                    <CardDescription>
                        Add a custom exercise to your library
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmitSuccess)}>
                        <div className="flex flex-col gap-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Exercise Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="muscle_group"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Muscle Group</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="equipment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Equipment</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                disabled={form.formState.isSubmitting}
                                type="submit"
                                className="w-fit"
                            >
                                Create Exercise
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Form>
    );
}
