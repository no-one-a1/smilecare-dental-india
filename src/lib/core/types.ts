// src/lib/core/types.ts
export type TreatmentType = 'Root Canal' | 'Dental Implants' | 'Braces / Orthodontics' | 'Teeth Whitening';

export interface Appointment {
    id: string;
    patientName: string;
    phoneNumber: string;
    treatment: TreatmentType;
    preferredDate: string;
    preferredTime: string; // New explicit time field
    createdAt: string;
    status: 'Pending' | 'Confirmed';
}

export interface EquipmentItem {
    name: string;
    description: string;
    imgSrc: string;
}