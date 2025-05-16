import axios from 'axios';
import { addGuide } from './guides';

const AI_API_URL = 'https://api.example.com/ai'; // Replace with actual AI API URL

export const fetchMissingInstructions = async (query: string) => {
    try {
        const response = await axios.post(AI_API_URL, { query });
        const instructions = response.data.instructions;

        if (instructions) {
            const newGuide = {
                title: query,
                description: 'Automatically generated guide for ' + query,
                steps: instructions,
            };
            await addGuide(newGuide);
            return newGuide;
        } else {
            throw new Error('No instructions found');
        }
    } catch (error) {
        console.error('Error fetching missing instructions:', error);
        throw error;
    }
};