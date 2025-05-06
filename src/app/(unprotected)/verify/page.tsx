"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { resendAndRedirect } from "@/actions/resend-verification";

// Create a separate client component that uses useSearchParams
import { useSearchParams } from "next/navigation";

function VerifyContent() {
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                    Verify Your Account
                </CardTitle>
                <CardDescription className="text-center">
                    Please check your email for a verification link
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-800">
                    <p className="text-sm font-medium">
                        Verification links expire after 1 hour.
                    </p>
                </div>

                {email && (
                    <div className="text-center text-sm">
                        <p>We&apos;ve sent a verification link to:</p>
                        <p className="font-medium mt-1">{email}</p>
                    </div>
                )}

                <div className="text-center text-sm text-gray-500">
                    <p>
                        Didn&apos;t receive an email? Check your spam folder or
                        request a new verification link.
                    </p>
                </div>

                <form action={resendAndRedirect}>
                    <input type="hidden" name="email" value={email} />
                    <Button type="submit" className="w-full">
                        Resend verification link
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="text-center text-sm text-gray-500">
                    <Link
                        href="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Return to login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}

// Main page component with suspense boundary
export default function VerifyPage() {
    return (
        <div className="flex flex-row items-center justify-center min-h-screen min-w-full px-4">
            <Suspense
                fallback={
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">
                                Loading...
                            </CardTitle>
                        </CardHeader>
                    </Card>
                }
            >
                <VerifyContent />
            </Suspense>
        </div>
    );
}
