"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { passwordSchema } from "@/zod-types";
import updatePassword from "@/actions/update-password";

export function UpdatePasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmitSuccess: SubmitHandler<
        z.infer<typeof passwordSchema>
    > = async (data, event) => {
        const formElement = event?.target as HTMLFormElement;
        const formData = new FormData(formElement);
        const result: { error: string } | undefined = await updatePassword(
            undefined,
            formData
        );
        if (result?.error) {
            form.setError("root", { message: result.error });
        }
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Form {...form}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Update Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmitSuccess)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    New Password
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder="super secure passsword"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription></FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="flex flex-col gap-3">
                                    <Button
                                        disabled={form.formState.isSubmitting}
                                        type="submit"
                                        className="w-full"
                                    >
                                        Update Password
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Form>
        </div>
    );
}
