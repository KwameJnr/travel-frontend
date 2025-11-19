// models/per-diem.model.ts
export interface PerDiemForm {
    id: string;
    location: string; // e.g., country
    rate: number;
    airfareCost: number; 
    accommodationCost: number; 
    visaApplicationFee: number; 
    transportationCost: number; 
    otherCost: number; 
    cfoEmail: string;
    status: string;
    effectiveDate: string;
  }
 