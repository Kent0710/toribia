"use client";

import Globe from "@/components/globe/globe";
import RightPanel from "@/components/right-panel/right-panel";
import { LocationProvider } from "@/contexts/location-context";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

const HomePage = () => {
    return (
        <LocationProvider>
            <div className="bg-slate-950 text-slate-100 h-dvh text-sm">
                <ResizablePanelGroup className="h-full w-full">
                    <ResizablePanel defaultSize={50} minSize={30}>
                        <main className="h-full">
                            <Globe render={true} className="h-full w-full" />
                        </main>
                    </ResizablePanel>

                    <ResizableHandle
                        withHandle
                        className="bg-slate-800 hover:bg-cyan-500/30 transition-colors data-[resize-handle-active]:bg-cyan-500/50"
                    />

                    <ResizablePanel defaultSize={50} minSize={30}>
                        <RightPanel className="h-full w-full" />
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </LocationProvider>
    );
};

export default HomePage;
