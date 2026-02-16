import { GeocodingSearchResult } from "@maptiler/sdk";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const extractSearchQuery = (geoData: GeocodingSearchResult) => {
    console.log(geoData);
    if (!geoData || !geoData.features || geoData.features.length === 0) return "";

    // 1. Look for the best match in the hierarchy
    // We prefer 'place' (city/town) or 'neighborhood' over 'road'
    const preferredTypes = ['place', 'municipality', 'neighborhood', 'locality'];
    
    const bestFeature = geoData.features.find(f => 
        f.place_type.some(type => preferredTypes.includes(type))
    ) || geoData.features[0]; // Fallback to index 0 if no preferred type is found

    // 2. Format the string
    const name = bestFeature.place_name_en || bestFeature.text;
    
    // If it's still a road, try to append the context (like the city name) 
    // to give Google more to work with
    return name;
};