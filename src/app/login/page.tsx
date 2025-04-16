"use client";
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { authenticate } from "@/app/login/action";
import { useActionState } from "react";

export default function Page() {
    const [actionResult, formAction] = useActionState(authenticate, undefined);
    return (
        <div className="grow flex justify-center items-center">
            <form action={formAction}>
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Log in</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    type="text"
                                    id="email"
                                    name="email"
                                    placeholder="email"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="password"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button>Sign in</Button>
                        <div>{actionResult && <div>{actionResult}</div>}</div>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
