import Globe from "@/components/globe/globe";
import Header from "@/components/home/header";
import RightPanel from "@/components/right-panel/right-panel";
import LeftPanel from "@/components/side-panel/left-panel";

const HomePage = () => {
    return (
        <div className="bg-neutral-50 text-neutral-800 h-dvh text-sm">
            <Header />
            <main className="flex h-[calc(100dvh-3rem)]">
                <LeftPanel className="w-[20%]" />
                <Globe render={false} className="w-[60%]" />
                <RightPanel className="w=[20%]" />
            </main>
        </div>
    );
};

export default HomePage;
