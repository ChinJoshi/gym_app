// TODO: use react-hook-form with zod
"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { routineBuilder } from "@/zod_types";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RoutineBuilderForm() {
    const form = useForm<z.infer<typeof routineBuilder>>({
        resolver: zodResolver(routineBuilder),
    });
    return (
        // <Form {...form}>
        //     <Card>
        //         <CardHeader>
        //             <CardTitle className="text-2xl">Login</CardTitle>
        //             {/* <CardDescription>
        //                     Enter your email below to login to your account
        //                 </CardDescription> */}
        //         </CardHeader>
        //         <CardContent>
        //             <form onSubmit={form.handleSubmit(onSubmitSuccess)}>
        //                 <div className="flex flex-col gap-6">
        //                     <div className="grid gap-3">
        //                         <FormField
        //                             control={form.control}
        //                             name="email"
        //                             render={({ field }) => (
        //                                 <FormItem>
        //                                     <FormLabel>Email</FormLabel>
        //                                     <FormControl>
        //                                         <Input
        //                                             placeholder="your@email.com"
        //                                             {...field}
        //                                         />
        //                                     </FormControl>
        //                                     <FormDescription>
        //                                         {/* Enter your email */}
        //                                     </FormDescription>
        //                                     <FormMessage />
        //                                 </FormItem>
        //                             )}
        //                         />
        //                     </div>
        //                     <div className="grid gap-3">
        //                         <FormField
        //                             control={form.control}
        //                             name="password"
        //                             render={({ field }) => (
        //                                 <FormItem>
        //                                     <div className="flex items-center">
        //                                         <FormLabel>Password</FormLabel>

        //                                         <Link
        //                                             href="#"
        //                                             className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
        //                                         >
        //                                             Forgot your password?
        //                                         </Link>
        //                                     </div>
        //                                     <FormControl>
        //                                         <Input
        //                                             type="password"
        //                                             placeholder=""
        //                                             {...field}
        //                                         />
        //                                     </FormControl>
        //                                     <FormDescription>
        //                                         {/* Enter your password */}
        //                                     </FormDescription>
        //                                     <FormMessage />
        //                                 </FormItem>
        //                             )}
        //                         />
        //                         {form.formState.errors.root && (
        //                             <FormMessage>
        //                                 {form.formState.errors.root.message}
        //                             </FormMessage>
        //                         )}
        //                     </div>

        //                     <div className="flex flex-col gap-3">
        //                         <Button
        //                             disabled={form.formState.isSubmitting}
        //                             type="submit"
        //                             className="w-full"
        //                         >
        //                             Login
        //                         </Button>

        //                         {/* <Button variant="outline" className="w-full">
        //                             Login with Google
        //                         </Button> */}
        //                     </div>
        //                 </div>
        //                 <div className="mt-4 text-center text-sm">
        //                     Don&apos;t have an account?{" "}
        //                     <Link
        //                         href="/signup"
        //                         className="underline underline-offset-4"
        //                     >
        //                         Sign up
        //                     </Link>
        //                 </div>
        //             </form>
        //         </CardContent>
        //     </Card>
        // </Form>
    );
}
