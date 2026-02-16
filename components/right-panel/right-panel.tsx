import React from "react";
import { twMerge } from "tailwind-merge";
import { Subtitle } from "../reusables/texts";

interface RightPanelProps {
    className? : string;
}

const RightPanel : React.FC<RightPanelProps> = ({
    className,
}) => {
    return (
        <div className={twMerge(`border-t p-4`, className)}>
            <Subtitle>
                Place Information
            </Subtitle>
        </div>
    )
};

export default RightPanel;