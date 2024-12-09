// index.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL as string;
const supabaseKey = process.env.SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key in environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test Route to Fetch Data from Supabase
app.get('/api/test-supabase', async (req: Request, res: Response): Promise<void> => {
    try {
        // Replace 'test_table' with an actual table name in your Supabase project
        const { data, error } = await supabase
            .from('test_table')
            .select('*')
            .limit(10); // Fetch first 10 records

        if (error) {
            console.error('Supabase Error:', error);
            res.status(500).json({ error: error.message });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error('Server Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Root Route
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the Backend Server!');
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});