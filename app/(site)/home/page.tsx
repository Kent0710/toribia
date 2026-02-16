import Globe from "@/components/globe/globe";
import Header from "@/components/home/header";
import SidePanel from "@/components/side-panel/side-panel";

const HomePage = () => {
    return (
        <div className="bg-neutral-50 h-dvh text-sm">
            <Header />
            <main className="flex h-[calc(100dvh-3rem)]">
                <SidePanel className="w-[20%]" />
                <Globe render={false} className="w-[80%]" />
            </main>
        </div>
    );
};

export default HomePage;
