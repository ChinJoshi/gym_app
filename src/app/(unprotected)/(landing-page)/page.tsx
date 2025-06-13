import Image from "next/image";
// import Link from "next/link";
import {
    ArrowRight,
    BarChart3,
    Calendar,
    Dumbbell,
    LineChart,
    ListChecks,
    TrendingUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LandingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-black text-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
                <div className="container relative z-10">
                    <div className="mx-auto max-w-3xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                            Track your progress.{" "}
                            <span className="text-rose-500">
                                Crush your goals.
                            </span>
                        </h1>
                        <p className="mt-6 text-lg text-zinc-400 md:text-xl">
                            The ultimate resistance training companion that
                            helps you track exercises, analyze trends, and
                            achieve consistent progress in your fitness journey.
                        </p>
                        {/* <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-rose-500 hover:bg-rose-600 text-white h-12 px-8 text-base">
                                Start Tracking
                            </Button>
                            <Button
                                variant="outline"
                                className="border-zinc-700 text-white hover:bg-zinc-800 hover:text-white h-12 px-8 text-base"
                            >
                                View Demo
                            </Button>
                        </div> */}
                    </div>
                </div>
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(255,59,78,0.15),transparent_50%)]"></div>
            </section>

            {/* Dashboard Preview */}
            <section className="py-16 container">
                <div className="relative mx-auto max-w-5xl rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-rose-500/5">
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900 via-zinc-900/80 to-zinc-900/0 rounded-xl"></div>
                    <Image
                        src="/dashboard-screenshot.png"
                        alt="Run Of One App Dashboard"
                        width={1200}
                        height={675}
                        className="rounded-xl"
                        priority
                    />
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 md:py-32">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Everything you need to track your fitness journey
                        </h2>
                        <p className="mt-4 text-zinc-400">
                            Our comprehensive set of features helps you stay on
                            top of your training and see real progress.
                        </p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10">
                                <ListChecks className="h-6 w-6 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Workout Plans
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Create and manage custom workout plans for
                                different goals and training splits.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10">
                                <Calendar className="h-6 w-6 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Training Sessions
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Log your workouts with detailed information
                                about exercises, sets, reps, and weights.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10">
                                <TrendingUp className="h-6 w-6 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Progress Tracking
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Visualize your progress with detailed charts and
                                analytics organized by exercise type.
                            </p>
                        </div>
                        {/* Feature 4 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10">
                                <BarChart3 className="h-6 w-6 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Volume Analysis
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Track your training volume over time to ensure
                                progressive overload and avoid plateaus.
                            </p>
                        </div>
                        {/* Feature 5 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10">
                                <LineChart className="h-6 w-6 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Custom Trends
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Create personalized trend reports to focus on
                                the metrics that matter most to you.
                            </p>
                        </div>
                        {/* Feature 6 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-rose-500/10">
                                <Dumbbell className="h-6 w-6 text-rose-500" />
                            </div>
                            <h3 className="text-xl font-semibold">
                                Exercise Library
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Access a comprehensive library of exercises with
                                proper form instructions and muscle targeting.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section
                id="how-it-works"
                className="py-20 md:py-32 bg-zinc-900/50"
            >
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            How it works
                        </h2>
                        <p className="mt-4 text-zinc-400">
                            Three simple steps to transform your training
                            experience
                        </p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-3">
                        {/* Step 1 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white text-2xl font-bold">
                                1
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">
                                Create Your Plans
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Set up your workout plans with exercises, target
                                sets, and reps for each training day.
                            </p>
                        </div>
                        {/* Step 2 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white text-2xl font-bold">
                                2
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">
                                Log Your Sessions
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Record your workouts as you train, tracking
                                weights, reps, and notes for each exercise.
                            </p>
                        </div>
                        {/* Step 3 */}
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-rose-500 text-white text-2xl font-bold">
                                3
                            </div>
                            <h3 className="mt-6 text-xl font-semibold">
                                Analyze Your Progress
                            </h3>
                            <p className="mt-2 text-zinc-400">
                                Review your performance trends and make
                                data-driven adjustments to your training.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* App Screenshots */}
            <section className="py-20 md:py-32">
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Designed for serious lifters
                        </h2>
                        <p className="mt-4 text-zinc-400">
                            Our intuitive interface makes tracking your workouts
                            simple and effective
                        </p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-3">
                        {/* Screenshot 1 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                            <div className="p-4 border-b border-zinc-800">
                                <h3 className="font-medium">Workout Plans</h3>
                            </div>
                            <div className="aspect-[4/3] bg-zinc-950 flex items-center justify-center p-4">
                                <div className="w-full max-w-xs rounded-lg border border-zinc-800 bg-black p-4">
                                    <div className="mb-4 text-sm font-medium">
                                        Plans
                                    </div>
                                    <div className="space-y-3">
                                        <div className="rounded bg-zinc-900 p-3">
                                            <div className="font-medium">
                                                Push Day
                                            </div>
                                            <div className="mt-1 text-xs text-zinc-400">
                                                Chest, Shoulders, Triceps
                                            </div>
                                        </div>
                                        <div className="rounded bg-zinc-900 p-3">
                                            <div className="font-medium">
                                                Pull Day
                                            </div>
                                            <div className="mt-1 text-xs text-zinc-400">
                                                Back, Biceps
                                            </div>
                                        </div>
                                        <div className="rounded bg-zinc-900 p-3">
                                            <div className="font-medium">
                                                Leg Day
                                            </div>
                                            <div className="mt-1 text-xs text-zinc-400">
                                                Quads, Hamstrings, Calves
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Screenshot 2 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                            <div className="p-4 border-b border-zinc-800">
                                <h3 className="font-medium">
                                    Training Sessions
                                </h3>
                            </div>
                            <div className="aspect-[4/3] bg-zinc-950 flex items-center justify-center p-4">
                                <div className="w-full max-w-xs rounded-lg border border-zinc-800 bg-black p-4">
                                    <div className="mb-4 text-sm font-medium">
                                        Sessions
                                    </div>
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 text-xs font-medium text-zinc-400">
                                            <div>Exercise</div>
                                            <div>Volume</div>
                                            <div>Date</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-xs">
                                            <div>Bench Press</div>
                                            <div>4800</div>
                                            <div>6/11/2025</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-xs">
                                            <div>Squat</div>
                                            <div>6400</div>
                                            <div>6/10/2025</div>
                                        </div>
                                        <div className="grid grid-cols-3 text-xs">
                                            <div>Deadlift</div>
                                            <div>7200</div>
                                            <div>6/8/2025</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Screenshot 3 */}
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
                            <div className="p-4 border-b border-zinc-800">
                                <h3 className="font-medium">Progress Trends</h3>
                            </div>
                            <div className="aspect-[4/3] bg-zinc-950 flex items-center justify-center p-4">
                                <div className="w-full max-w-xs rounded-lg border border-zinc-800 bg-black p-4">
                                    <div className="mb-4 text-sm font-medium">
                                        Bench Press Volume
                                    </div>
                                    <div className="h-32 flex items-end gap-1">
                                        {[30, 45, 40, 60, 55, 75, 80].map(
                                            (height, i) => (
                                                <div
                                                    key={i}
                                                    className="flex-1 bg-rose-500 rounded-t"
                                                    style={{
                                                        height: `${height}%`,
                                                    }}
                                                ></div>
                                            )
                                        )}
                                    </div>
                                    <div className="mt-2 flex justify-between text-xs text-zinc-400">
                                        <div>Week 1</div>
                                        <div>Week 7</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            {/* <section
                id="testimonials"
                className="py-20 md:py-32 bg-zinc-900/50"
            >
                <div className="container">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Loved by lifters everywhere
                        </h2>
                        <p className="mt-4 text-zinc-400">
                            See what our users have to say about their
                            experience
                        </p>
                    </div>
                    <div className="mt-16 grid gap-8 md:grid-cols-3">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-zinc-800"></div>
                                <div>
                                    <div className="font-medium">
                                        Alex Thompson
                                    </div>
                                    <div className="text-sm text-zinc-400">
                                        Powerlifter
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-zinc-300">
                                &quot;Run Of One app has completely transformed
                                how I track my progress. The volume tracking and
                                trend analysis have helped me break through
                                plateaus I&apos;ve been stuck at for
                                months.&quot;
                            </p>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-zinc-800"></div>
                                <div>
                                    <div className="font-medium">
                                        Sarah Chen
                                    </div>
                                    <div className="text-sm text-zinc-400">
                                        Bodybuilder
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-zinc-300">
                                &quot;I&apos;ve tried dozens of fitness apps,
                                but Run Of One is the only one that gives me the
                                detailed analytics I need. Being able to create
                                custom trends for specific muscle groups is a
                                game-changer.&quot;
                            </p>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-8">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-zinc-800"></div>
                                <div>
                                    <div className="font-medium">
                                        Marcus Johnson
                                    </div>
                                    <div className="text-sm text-zinc-400">
                                        Fitness Coach
                                    </div>
                                </div>
                            </div>
                            <p className="mt-4 text-zinc-300">
                                &quot;I recommend Run Of One to all my clients.
                                The ability to create detailed workout plans and
                                track progress over time has made my coaching
                                much more effective and data-driven.&quot;
                            </p>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* CTA Section */}
            <section className="py-20 md:py-32">
                <div className="container">
                    <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-8 md:p-12 text-center">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Ready to transform your training?
                        </h2>
                        <p className="mt-4 text-zinc-400">
                            Join thousands of lifters who are using data to
                            drive their progress and achieve their fitness
                            goals.
                        </p>
                        <div className="mt-8">
                            <Link href="/signup">
                                <Button className="bg-rose-500 hover:bg-rose-600 text-white h-12 px-8 text-base">
                                    Get Started{" "}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>
                        <p className="mt-4 text-sm text-zinc-500">
                            No credit card required. Free plan available with
                            premium upgrades.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
