import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import GuideList from '../components/GuideList';
import { fetchGuides } from '../api/guides';

const Home: React.FC = () => {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGuides = async () => {
            const fetchedGuides = await fetchGuides();
            setGuides(fetchedGuides);
            setLoading(false);
        };

        loadGuides();
    }, []);

    return (
        <div>
            <h1>Guide Finder</h1>
            <SearchBar />
            {loading ? (
                <p>Loading guides...</p>
            ) : (
                <GuideList guides={guides} />
            )}
        </div>
    );
};

export default Home;