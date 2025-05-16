import React from 'react';
import { Guide } from '../types/guide';

interface GuideListProps {
    guides: Guide[];
    onSelectGuide: (guide: Guide) => void;
}

const GuideList: React.FC<GuideListProps> = ({ guides, onSelectGuide }) => {
    return (
        <div>
            <h2>Available Guides</h2>
            <ul>
                {guides.map(guide => (
                    <li key={guide.id} onClick={() => onSelectGuide(guide)}>
                        <h3>{guide.title}</h3>
                        <p>{guide.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GuideList;