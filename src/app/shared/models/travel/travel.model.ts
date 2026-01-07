export interface Travel {
    travelId?: string;
    employeeName: string;
    employeeEmail: string;
    employeePassportNo: string;
    employeePassportExpiry: string;
    employeeNumber: string;
    employeeDepartment: Department;
    departmentCode: string;
    employeeTravellingContact: string;
    employeeContact: string;
    purpose: string;
    city: string;
    country: string;
    visaRequired: string;
    departureDate: string;
    departureTime: string;
    returnDate: string;
    returnTime: string;
    perDiemStartDate: string;
    perDiemEndDate: string;
    daysOutOfOfficialAssignment: string;
    hotelReservation: string;
    hotelName: string;
    hotelAddress: string;
    hotelCity: string;
    hotelCountry: string;
    rentalCarRequired: string;
    airportTransportRequiredToAndFrom: string;
    subsistenceAllowance: string;
    perDiemDays: number;
    estimatedPerDiemAmount: number;
    totalEstimatedTravelCost: number;
    travelBudgetCode: string;
    travelRequestApproved: string;
    classOfTravelDeparture: string;
    classOfTravelReturn: string;
    excoHeadStatus: string;
    excoHeadName: string;
    excoHeadEmail: string;
    excoHeadFeedback: string;
    excoHeadFeedbackRemarks: string;
    buHeadFeedback: string;
    buHeadFeedbackRemarks: string;
    cfoStatus:string;
    cfoName: string;
    cfoEmail: string;
    cfoFeedback: string;
    cfoFeedbackRemarks: string;
    status: string;
    dateCreated: string;
    lastUpdated: string
  }
  
  export interface Department {
  departmentId: number;
  name: string;
  description?: string;
  code?: string;
  dateCreated?: string;
  lastUpdate?: string;
}