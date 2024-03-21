import React, { useState, useRef, useEffect } from 'react';
import ShareIcon from "../../icons/Share";
import EmailIcon from "../../icons/Email";
import FacebookIcon from "../../icons/Facebook";
import LinkedInIcon from "../../icons/LinkedIn";
import TwitterIcon from "../../icons/Twitter";
import PinterestIcon from "../../icons/Pinterest";
import Button from "../../components/Button";

import './SocialShare.css';

const SocialShare = () => {
    const [showOptions, setShowOptions] = useState(false);
    const shareOptionsRef = useRef(null);
   
    const handleClickOutside = (event) => {
        if (shareOptionsRef.current && !shareOptionsRef.current.contains(event.target)) {
            setShowOptions(false);
        }
    };
    
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleShareClick = (platformUrl) => {
        const currentUrl = window.location.href;
        const popup = window.open(platformUrl + encodeURIComponent(currentUrl), '_blank', 'height=600,width=600');
        if (window.focus) popup.focus();
    };

    const socialPlatforms = [
        { name: 'email', url: 'mailto:?subject=Check this out&body=Hi, check this link: ', icon: <EmailIcon /> },
        { name: 'facebook', url: 'https://www.facebook.com/sharer/sharer.php?u=', icon: <FacebookIcon /> },
        { name: 'linkedin', url: 'https://www.linkedin.com/shareArticle?mini=true&url=', icon: <LinkedInIcon /> },
        { name: 'twitter', url: 'https://twitter.com/intent/tweet?url=', icon: <TwitterIcon /> },
        { name: 'pinterest', url: 'http://pinterest.com/pin/create/button/?url=', icon: <PinterestIcon /> },
    ];

    return (
        <div className="social-share-container">
            <Button
                disabled={false}
                icon={<ShareIcon />}
                onClick={() => setShowOptions(!showOptions)}
            >
                Share
            </Button>
            {showOptions && (
                <div ref={shareOptionsRef} className="social-share-options">
                    {socialPlatforms.map((platform) => (
                        <button
                            key={platform.name}
                            className={`social-share-option ${platform.name}`}
                            onClick={() => handleShareClick(platform.url)}
                            aria-label={`Share on ${platform.name}`}
                        >
                            {platform.icon}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SocialShare;
