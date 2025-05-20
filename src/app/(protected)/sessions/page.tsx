import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Page() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Your training sessions will appear here.</p>
                </CardContent>
            </Card>
        </div>
    );
}
