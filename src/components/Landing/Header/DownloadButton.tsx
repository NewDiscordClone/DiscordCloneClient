import React, {useEffect, useState} from 'react';
import csx from "classnames";
import styles from "./Header.module.scss";

const DownloadButton = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: any) => {
            // Prevent the default browser prompt
            event.preventDefault();

            // Store the event to use it later
            setDeferredPrompt(event);
        };

        // Add event listener when the component mounts
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []); // Empty dependency array ensures the effect runs only once

    const handleInstallClick = () => {
        // Check if the deferredPrompt is available
        if (deferredPrompt) {
            // Trigger the installation prompt
            deferredPrompt.prompt();

            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }

                // Reset the deferredPrompt variable
                setDeferredPrompt(null);
            });
        }
    };

    return (
        <div className={csx(styles.button, styles.leftColumn, styles.white)} onClick={handleInstallClick}>
            Download for Windows
        </div>
    );
};

export default DownloadButton;