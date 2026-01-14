export interface PerDiem {
    perDiemId: string;
    dollarRate: number; 
    airFareCost: number; 
    accommodationCost: number; 
    visaApplicationCost: number; 
    transportationCost: number; 
    otherCost: number; 
    status: string;
    country: string;
    dateCreated: string; 
    lastUpdated: string; 
}

export interface PerDiemCreateRequest {
  country: string;
  dollarRate: number;
  airFareCost: number;
  accommodationCost: number;
  visaApplicationCost: number;
  transportationCost: number;
  otherCost: number;
}

export interface PerDiemEditRequest {
  dollarRate: number;
  airFareCost: number;
  accommodationCost: number;
  visaApplicationCost: number;
  transportationCost: number;
  otherCost: number;
}