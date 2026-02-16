import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { LocationProvider } from "@/contexts/location-context";
import Globe from "@/components/globe/globe";

const LandingPage = () => {
    return (
        <LocationProvider>
            <div className="h-dvh bg-slate-950 text-slate-100 flex flex-col">
                {/* Header */}
                <header className="h-14 px-8 flex items-center justify-between shrink-0 border-b border-slate-800/50">
                    <p className="text-lg font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        TORIBIA
                    </p>
                    <Link href="/home">
                        <Button
                            variant="ghost"
                            className="text-slate-400 hover:text-cyan-400 hover:bg-slate-900"
                        >
                            Launch App
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </header>

                {/* Main — two-column layout */}
                <main className="flex-1 flex min-h-0">
                    {/* Left — Copy */}
                    <section className="flex-1 flex flex-col justify-center px-12 lg:px-20 gap-6">
                        <h1 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                            Explore the Hidden Soul
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                of Every Coordinate
                            </span>
                        </h1>
                        <p className="text-lg text-slate-400 max-w-md leading-relaxed">
                            An immersive travel experience where the world
                            becomes a living narrative. Click anywhere on the
                            globe and let AI reveal the story beneath.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <Link href="/home">
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20 px-6">
                                    Enter the Globe
                                    <ArrowRight className="size-4" />
                                </Button>
                            </Link>
                        </div>
                    </section>

                    {/* Right — Decorative Globe */}
                    <section className="flex-1 relative min-h-0">
                        <Globe
                            render={true}
                            interactive={false}
                            className="h-full w-full"
                        />
                        {/* Gradient overlay to blend edges */}
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-950 via-transparent to-transparent" />
                    </section>
                </main>
            </div>
        </LocationProvider>
    );
};

export default LandingPage;
