import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CfoDashboardMetrics } from 'src/app/shared/models/cfo/CfoDashboadMetrics';
import { ApprovalEmailPayload } from 'src/app/shared/models/notification/ApprovalEmailPayload';
import { EmailMsgPayload } from 'src/app/shared/models/notification/EmailMsgPayload';
import { ApiResponse } from 'src/app/shared/models/travel/api-response.model';
import { Department } from 'src/app/shared/models/deparment/department.model'; 
import { Travel } from 'src/app/shared/models/travel/travel.model';
import { BauHeadForm } from 'src/app/shared/models/buhead/buheadform';
import { PerDiemForm } from 'src/app/shared/models/perdiem/perdiemform.model';


@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private baseUrl = 'http://localhost:9090/camp/travels'; // Adjust if needed
  private apiUrl = 'http://localhost:9090/camp/company/department/index';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Travel[]> {
    return this.http.get<ApiResponse<Travel[]>>(`${this.baseUrl}/all`).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<Travel> {
    return this.http.get<ApiResponse<Travel>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  create(travel: Travel): Observable<ApiResponse<Travel>> {
    return this.http.post<ApiResponse<Travel>>(`${this.baseUrl}/add`, travel);
  }  

  update(id: string, travel: Travel): Observable<Travel> {
    return this.http.put<Travel>(`${this.baseUrl}/update/${id}`, travel);
  }

  delete(id: string): Observable<string> {
    return this.http.delete<ApiResponse<string>>(`${this.baseUrl}/delete/${id}`).pipe(
      map(response => response.data)
    );
  }

  //BU Heads endpoints 
  getPendingRequestsForBuHead(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/exco-feedback/pending`).pipe(
      map(response => response.data)
    );
  }

  updateBuHeadFeedback(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, payload);
  }
  
  //CFO endpoints 
  getPendingRequestsForCfo(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}/cfo-feedback/pending`).pipe(
      map(response => response.data)
    );
  }

  updateCfoFeedback(id: string, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, payload);
  }

  //Notification endpoints
  sendApprovalEmail(payload: ApprovalEmailPayload): Observable<any> {
    return this.http.post('http://localhost:9090/camp/notifications/send-approval-msg', payload);
  }

  sendApprovalEmailFrontEnd(payload: ApprovalEmailPayload): Observable<any> {
    return this.http.post('http://localhost:9090/camp/notifications/send-approval-frontend-msg', payload);
  }

  sendApprovalEmailFrontEndWithAttachment(payload: ApprovalEmailPayload): Observable<any> {
    return this.http.post('http://localhost:9090/camp/notifications/send-approval-frontend-msg-with-attachment', payload);
  }

  sendEmailMsg(payload: EmailMsgPayload): Observable<any> {
    return this.http.post('http://localhost:9090/camp/notifications/send-msg', payload);
  }
  
  //Cfo dashboard notification endpoints 
  getMetrics(): Observable<CfoDashboardMetrics> {
    return this.http.get<CfoDashboardMetrics>('http://localhost:9090/camp/cfo-dashboard/metrics');
  }

  getMonthlyCosts(year: number) {
    return this.http.get<{ month: string; cost: number }[]>(
      `http://localhost:9090/camp/cfo-dashboard/monthly-costs?year=${year}`
    );
  }

  getTopDepartments(year: number, month?: number) {
    let params = `year=${year}`;
    if (month) params += `&month=${month}`;
    return this.http.get<{ department: string, cost: number }[]>(`http://localhost:9090/camp/cfo-dashboard/top-departments?${params}`);
  }

  //Get deoartment endpoints 
  // Use POST to pass {} in body
  getDepartments(): Observable<{ status: string, message: string, data: Department[] }> {
    return this.http.get<{ status: string, message: string, data: Department[] }>(this.apiUrl);
  }
  
  getBAUHeads(): Observable<{ statusCode: string, statusMessage: string, data: BauHeadForm[] }> {
    return this.http.get<{ statusCode: string, statusMessage: string, data: BauHeadForm[] }>(
      'http://localhost:9090/camp/company/bau/index'
    );
  }

  getAllPerDiemCountries(): Observable<ApiResponse<PerDiemForm[]>> {
    return this.http.get<ApiResponse<PerDiemForm[]>>(`http://localhost:9090/camp/perdiems/all`);
  }
}
