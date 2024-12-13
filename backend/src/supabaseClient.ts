// src/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';
import { config } from './config';

export const supabase = createClient<Database>(
    config.supabaseUrl,
    config.supabaseKey
);
