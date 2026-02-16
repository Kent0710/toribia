"use client";

import React, { useEffect, useRef } from "react";
import { Map, MapStyle, geocoding } from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { twMerge } from "tailwind-merge";
import { extractSearchQuery } from "@/lib/utils";
import { useLocation } from "@/contexts/location-context";
import { toast } from "sonner";

interface GlobeProps {
    render?: boolean;
    interactive?: boolean;
    className?: string;
}

const Globe: React.FC<GlobeProps> = ({ render, interactive = true, className }) => {
    const { setLocationName, setIsLoading, clearMessages } = useLocation();
    const mapContainer = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new Map({
            container: mapContainer.current,
            apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY!,
            style: MapStyle.HYBRID,
            projection: 'globe',
            zoom: 2,
            center: [75.9, 26.9],
            space: { preset: "milkyway-bright" },
            interactive,
        });

        let animationId: number;
        let resumeTimeout: NodeJS.Timeout | null = null;
        let isSpinning = true;
        const spinSpeed = 0.05;

        const spinGlobe = () => {
            if (isSpinning) {
                const center = map.getCenter();
                map.setCenter([center.lng + spinSpeed, center.lat]);
            }
            animationId = requestAnimationFrame(spinGlobe);
        };
        spinGlobe();

        if (interactive) {
            let debounceTimeout: NodeJS.Timeout | null = null;
            let hasResult = false;

            const stopSpin = () => {
                isSpinning = false;
                if (resumeTimeout) clearTimeout(resumeTimeout);
            };

            const resumeSpin = () => {
                if (hasResult) return; // Don't resume if a location was found
                if (resumeTimeout) clearTimeout(resumeTimeout);
                resumeTimeout = setTimeout(() => { isSpinning = true; }, 1000);
            };

            map.on("mousedown", stopSpin);
            map.on("touchstart", stopSpin);
            map.on("wheel", stopSpin);
            map.on("mouseup", resumeSpin);
            map.on("touchend", resumeSpin);

            map.on("click", (e) => {
                const { lng, lat } = e.lngLat;

                // Stop spinning immediately on click
                isSpinning = false;
                if (resumeTimeout) clearTimeout(resumeTimeout);

                // Debounce: only process the last click within 500ms
                if (debounceTimeout) clearTimeout(debounceTimeout);
                debounceTimeout = setTimeout(async () => {
                    setIsLoading(true);
                    clearMessages();
                    setLocationName(null);
                    hasResult = false;

                    try {
                        const results = await geocoding.reverse([lng, lat], {
                            apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY!,
                        });

                        if (!results.features || results.features.length === 0) {
                            toast.error(
                                "There is no location data for this area. Please click on a different spot on the globe!",
                            );
                            setIsLoading(false);
                            // No result — resume spinning after idle
                            resumeTimeout = setTimeout(() => { isSpinning = true; }, 3000);
                            return;
                        }

                        const query = extractSearchQuery(results);

                        if (query) {
                            toast.success(`You clicked on ${query}! Fetching information...`);
                            setLocationName(query);
                            hasResult = true;
                            // Keep globe still — user is now reading the chat
                        } else {
                            setIsLoading(false);
                            resumeTimeout = setTimeout(() => { isSpinning = true; }, 3000);
                            return;
                        }
                    } catch (error) {
                        console.error("Reverse geocoding error:", error);
                        resumeTimeout = setTimeout(() => { isSpinning = true; }, 3000);
                    }

                    setIsLoading(false);
                }, 1000);
            });
        }

        return () => {
            map.remove();
            cancelAnimationFrame(animationId);
            if (resumeTimeout) clearTimeout(resumeTimeout);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [interactive]);

    if (render === false) {
        return (
            <div className={twMerge("h-full w-full", className)}>
                Globe is not rendered
            </div>
        );
    }

    return (
        <div
            ref={mapContainer}
            className={twMerge("w-full h-full", className)}
        />
    );
};

export default Globe;
