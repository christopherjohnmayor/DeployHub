import { Guide } from '../types/guide';
import { initializeDatabase, getGuides } from '../db';

const db = initializeDatabase();

export const fetchGuides = async (): Promise<Guide[]> => {
    return await getGuides(db);
};

export const addGuide = async (guide: Guide): Promise<void> => {
    // Logic to add a guide to the database
    // This function should include validation and error handling
};

export const searchGuides = async (query: string): Promise<Guide[]> => {
    const guides = await fetchGuides();
    return guides.filter(guide => 
        guide.title.toLowerCase().includes(query.toLowerCase()) || 
        guide.description.toLowerCase().includes(query.toLowerCase())
    );
};