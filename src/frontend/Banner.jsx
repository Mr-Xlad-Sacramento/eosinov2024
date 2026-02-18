import React from 'react';
import '../assets/header.css'; // Import the CSS file for styles
import { TopAnnouncementBar } from '../components';

const Banner = () => {

    const handleLinkClick = (url) => {
        window.open(url, '_blank');
    };


    return (

        <div className="py-2">
            <TopAnnouncementBar
                title="$EOSIF token presale is live."
                subtitle="Buy now on our website to receive a 10% discount or join via selected launchpads."
                ctaLabel="Buy $EOSIF now"
                onClick={() => handleLinkClick('https://ico.eosifinance.org')}
            />
        </div>
    )
}

export default Banner;
