import React, {createContext, useContext, useState, useEffect, ReactNode, SetStateAction, Dispatch} from 'react';

const VolumeContext = createContext({} as { volume: number, setVolume: Dispatch<SetStateAction<number>> });

export function useVolume() {
    return useContext(VolumeContext);
}

export function VolumeProvider({children}: { children: ReactNode }) {
    const [volume, setVolume] = useState(0.5); // Default volume
    const VOLUME_KEY = 'app_volume'; // Key for storing volume in local storage

    useEffect(() => {
        // Load the volume from local storage if available
        const savedVolume = localStorage.getItem(VOLUME_KEY);
        if (savedVolume !== null) {
            setVolume(parseFloat(savedVolume));
        }
    }, []);

    useEffect(() => {
        // Save the volume to local storage whenever it changes
        localStorage.setItem(VOLUME_KEY, volume.toString());
    }, [volume]);

    return (
        <VolumeContext.Provider value={{volume, setVolume}}>
            {children}
        </VolumeContext.Provider>
    );
}