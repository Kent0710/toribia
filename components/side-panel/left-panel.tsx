import React from "react";
import { twMerge } from "tailwind-merge";
import { Subtitle } from "../reusables/texts";
import LeftPanelItem from "./left-panel-item";

interface LeftPanelProps {
    className? : string;
}

const LeftPanel : React.FC<LeftPanelProps> = ({
    className,
}) => {
    const recentVisits = [
        {
            id: 1,
            placeName: "Central Park",
            location: "New York, USA",
        },
        {
            id: 2,
            placeName: "Eiffel Tower",
            location: "Paris, France",
        },
        {
            id: 3,
            placeName: "Colosseum",
            location: "Rome, Italy",
        },
    ];

    return (
        <div
            className={twMerge(`border-t p-4 `, className)}
        >
            <Subtitle> Recent Visits </Subtitle>
            <ul className="mt-4 space-y-2">
                {recentVisits.map((visit, index) => (
                    <LeftPanelItem 
                        key={index}
                        id={visit.id}
                        placeName={visit.placeName}
                        location={visit.location}
                    />
                ))}
            </ul>
        </div>
    )
};

export default LeftPanel;