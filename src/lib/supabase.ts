import {createClient} from '@supabase/supabase-js'
import {config} from '../config'
export const isSupabaseConfigured=Boolean(config.supabaseUrl&&config.supabaseKey)
export const supabase=isSupabaseConfigured?createClient(config.supabaseUrl,config.supabaseKey):null
