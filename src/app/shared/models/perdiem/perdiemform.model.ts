// models/per-diem.model.ts
export interface PerDiemForm {
    id: string;
    country: string; // e.g., country
    dollarRate: number;
    airFareCost: number; 
    accommodationCost: number; 
    visaApplicationCost: number; 
    transportationCost: number; 
    otherCost: number; 
    status: string;
  }
 