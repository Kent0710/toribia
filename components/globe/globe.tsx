"use client";

import React, { useEffect, useRef } from "react";
import { Map, MapStyle, geocoding } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { twMerge } from "tailwind-merge";
import { extractSearchQuery } from "@/lib/utils";
import { useLocation } from "@/contexts/location-context";

interface GlobeProps {
    render?: boolean; // debugging purpose, to prevent the globe from rendering on the server
    className?: string;
}

const Globe: React.FC<GlobeProps> = ({ render, className }) => {
    const { setLocationName, setIsLoading, clearMessages } = useLocation();
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
            },
        });

        map.on("click", async (e) => {
            const { lng, lat } = e.lngLat;
            console.log("Longitude; " + lng);
            console.log("Latitude: " + lat);

            // Reset state for new location
            setIsLoading(true);
            clearMessages();
            setLocationName(null);

            const results = await geocoding.reverse([lng, lat], {
                apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY!,
            });

            console.log("Reverse Geocoding Results:", results);

            const query = extractSearchQuery(results);

            console.log("Extracted Search Query:", query);

            if (query) {
                setLocationName(query);
                console.log("Location set for AI conversation:", query);
            }

            setIsLoading(false);
        });

        return () => map.remove();
    }, [setLocationName, setIsLoading, clearMessages]);

    switch (render) {
        case false:
            return (
                <div className={twMerge(`h-full w-full border `, className)}>
                    Globe is not rendered
                </div>
            );
        default:
            return (
                <div
                    ref={mapContainer}
                    className={twMerge(`w-full h-[90%] border m-5`, className)}
                />
            );
    }
};

export default Globe;
