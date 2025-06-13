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
import { emailSchema } from "@/zod-types";

import { resetPassword } from "@/actions/reset-password";

export function ResetPasswordForm({
    className,
    ...props
}: React.ComponentProps<"div">) {
    console.log("reset pwd form loading");
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmitSuccess: SubmitHandler<z.infer<typeof emailSchema>> = async (
        data,
        event
    ) => {
        const formElement = event?.target as HTMLFormElement;
        const formData = new FormData(formElement);
        const result: { error: string } | undefined = await resetPassword(
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
                            Reset Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={form.handleSubmit(onSubmitSuccess)}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="your@email.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    {/* Enter your email */}
                                                </FormDescription>
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
                                        Send Reset Password Link
                                    </Button>

                                    {/* <Button variant="outline" className="w-full">
                                    Login with Google
                                </Button> */}
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </Form>
        </div>
    );
}
