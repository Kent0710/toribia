import React from "react";
import { twMerge } from "tailwind-merge";

interface SidePanelProps {
    className? : string;
}

const SidePanel : React.FC<SidePanelProps> = ({
    className,
}) => {
    return (
        <div
            className={twMerge(`bg-white border p-4 `, className)}
        >
            this is the sidepanel
        </div>
    )
};

export default SidePanel;