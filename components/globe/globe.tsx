"use client";

import React, { useEffect, useRef } from "react";
import { Map, MapStyle } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { twMerge } from "tailwind-merge";

interface GlobeProps {
    render? : boolean; // debugging purpose, to prevent the globe from rendering on the server
    className? : string;
}

const Globe : React.FC<GlobeProps> = ({
    render,
    className,
}) => {
    const mapContainer = useRef(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new Map({
            container: mapContainer.current,
            apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY!,
            style: MapStyle.SATELLITE,
            projection: "globe",
            zoom: 1,
            center: [75.9, 26.9],
            space: {
                preset: "milkyway-bright",
            }
        });

        return () => map.remove();
    }, []);

    switch (render) {
        case false:
            return <div className={twMerge(`h-full w-full border `, className)}>Globe is not rendered</div>;
        default:
            <div ref={mapContainer} className={twMerge(`w-[50rem] h-[30rem] border m-5`, className)} />;
    }
};

export default Globe;
