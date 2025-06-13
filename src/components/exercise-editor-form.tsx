"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exerciseEditor } from "@/zod-types";
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
import { updateExercise } from "@/actions/update-exercise";

type ExerciseEditorFormProps = {
    exercise: z.infer<typeof exerciseEditor> & { id: string };
};

export default function ExerciseEditorForm({
    exercise,
}: ExerciseEditorFormProps) {
    const form = useForm<z.infer<typeof exerciseEditor>>({
        resolver: zodResolver(exerciseEditor),
        defaultValues: {
            name: exercise.name,
            muscle_group: exercise.muscle_group,
            equipment: exercise.equipment,
        },
    });

    const onSubmitSuccess: SubmitHandler<
        z.infer<typeof exerciseEditor>
    > = async (data) => {
        await updateExercise(data, exercise.id);
    };

    return (
        <Form {...form}>
            <Card className="min-w-fit">
                <CardHeader>
                    <CardTitle className="text-2xl wrap-anywhere">
                        {form.watch("name") || "Exercise"}
                    </CardTitle>
                    <CardDescription>Edit your exercise</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={form.handleSubmit(onSubmitSuccess)}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Exercise Name</FormLabel>
                                            <FormControl className="max-w-lg">
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
                                            <FormControl className="max-w-lg">
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
                                            <FormControl className="max-w-lg">
                                                <Input {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    disabled={form.formState.isSubmitting}
                                    type="submit"
                                    className="w-fit"
                                >
                                    Update Exercise
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </Form>
    );
}
