'use client'

import Globe from "@/components/globe/globe";
import Header from "@/components/home/header";
import RightPanel from "@/components/right-panel/right-panel";
import LeftPanel from "@/components/side-panel/left-panel";
import { LocationProvider } from "@/contexts/location-context";

const HomePage = () => {
    return (
        <LocationProvider>
            <div className="bg-neutral-50 text-neutral-800 h-dvh text-sm">
                <Header />
                <main className="flex h-[calc(100dvh-3rem)]">
                    <LeftPanel className="flex-[20%]" />
                    <Globe render={true} className="flex-[60%]" />
                    <RightPanel className="flex-[20%]" />
                </main>
            </div>
        </LocationProvider>
    );
};

export default HomePage;
