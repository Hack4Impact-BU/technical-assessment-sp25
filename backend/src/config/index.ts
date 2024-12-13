//Load env variables
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    throw new Error('Supabase URL or Key is not defined in environment variables');
}

if (!process.env.GENIUS_ACCESS_TOKEN) {
    throw new Error('Genius Access Token is not defined in environment variables');
}

export const config = {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
    geniusAccessToken: process.env.GENIUS_ACCESS_TOKEN,
    port: process.env.PORT || 5001,
};
