import React from 'react';
import { Guide } from '../types/guide';

interface GuideDetailsProps {
    guide: Guide | null;
}

const GuideDetails: React.FC<GuideDetailsProps> = ({ guide }) => {
    if (!guide) {
        return <div>Select a guide to see the details.</div>;
    }

    return (
        <div>
            <h2>{guide.title}</h2>
            <p>{guide.description}</p>
            <h3>Instructions:</h3>
            <ol>
                {guide.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default GuideDetails;