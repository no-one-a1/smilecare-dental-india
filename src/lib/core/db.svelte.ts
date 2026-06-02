// src/lib/core/db.svelte.ts
import { createClient } from '@supabase/supabase-js';
import type { Appointment } from './types';

// Replace these strings with your actual API keys from your Supabase Project Settings
const SUPABASE_URL = 'https://cnrneqobvorsrxwmgvvd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNucm5lcW9idm9yc3J4d21ndnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNzgwMzMsImV4cCI6MjA5NTk1NDAzM30.kWWn5_-JZcE5ZVnUIAwSNzOWHpmXL30Hzbl5rkYEJs0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

class StaticDentalDB {
    #appointments = $state<Appointment[]>([]);

    constructor() {
        this.fetchActiveAppointments();
    }

    get appointments() {
        return this.#appointments;
    }

    // 1. READ: Fetch all shared appointments from the cloud
    public async fetchActiveAppointments() {
        const todayStr = new Date().toISOString().split('T')[0];

        // This query fetches data from the cloud and automatically filters out old dates
        const { data, error } = await supabase
            .from('appointments')
            .select('*')
            .gte('preferred_date', todayStr) // Hides past days automatically
            .order('preferred_date', { ascending: true });

        if (error) {
            console.error('Database connection error:', error.message);
        } else if (data) {
            // Remap database underscore fields back to Svelte TypeScript types cleanly
            this.#appointments = data.map(row => ({
                id: row.id,
                patientName: row.patient_name,
                phoneNumber: row.phone_number,
                treatment: row.treatment,
                preferredDate: row.preferred_date,
                preferredTime: row.preferred_time,
                createdAt: row.created_at,
                status: 'Confirmed'
            }));
        }
    }

    // 2. CREATE: Insert a new slot and check for collisions
    public async insertRecord(data: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; message: string }> {
        // Collision check logic: Check if anyone else has taken this specific date and time combination
        const isColliding = this.#appointments.some(app => 
            app.preferredDate === data.preferredDate && 
            app.preferredTime === data.preferredTime
        );

        if (isColliding) {
            return { success: false, message: "This time slot is already booked by another patient! Please pick another slot." };
        }

        const { error } = await supabase
            .from('appointments')
            .insert([{
                patient_name: data.patientName,
                phone_number: data.phoneNumber,
                treatment: data.treatment,
                preferred_date: data.preferredDate,
                preferred_time: data.preferredTime
            }]);

        if (error) {
            return { success: false, message: "Database error: " + error.message };
        }

        // Refresh our local state cache to show the new appointment immediately
        await this.fetchActiveAppointments();
        return { success: true, message: "Appointment locked successfully!" };
    }

    // 3. DELETE: Secure verification drop logic
    public async dropRecordSecurely(id: string, confirmationPhone: string): Promise<{ success: boolean; message: string }> {
        const target = this.#appointments.find(app => app.id === id);
        if (!target) return { success: false, message: "Record not found." };

        const cleanTargetPhone = target.phoneNumber.replace(/\s+/g, '');
        const cleanInputPhone = confirmationPhone.replace(/\s+/g, '');

        if (!cleanTargetPhone.includes(cleanInputPhone) || cleanInputPhone.length < 10) {
            return { success: false, message: "Verification failed! Phone number mismatch." };
        }

        const { error } = await supabase
            .from('appointments')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, message: error.message };
        }

        await this.fetchActiveAppointments();
        return { success: true, message: "Appointment cancelled." };
    }
}

export const dentalDB = new StaticDentalDB();