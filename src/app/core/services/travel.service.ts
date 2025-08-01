import { HttpClient, HttpHeaders } from '@angular/common/http';
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
import { baseUrl,generateUUID } from './constants';



@Injectable({
  providedIn: 'root'
})
export class TravelService {
  
  // private travelApiBaseUrl = baseUrl+'/travels';
  // private apiUrl = baseUrl+'/company/department/index';

  private travelApiBaseUrl = baseUrl+'/travels'; // Adjust if needed
  private apiUrl = baseUrl+'/company/department/index';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Travel[]> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID()); // Generate a unique request ID

    return this.http.get<ApiResponse<Travel[]>>(`${this.travelApiBaseUrl}/all`,{headers}).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<Travel> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<ApiResponse<Travel>>(`${this.travelApiBaseUrl}/view/${id}`,{headers}).pipe(
      map(response => response.data)
    );
  }

  create(travel: Travel): Observable<ApiResponse<Travel>> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post<ApiResponse<Travel>>(`${this.travelApiBaseUrl}/add`, travel,{ headers});
  }  

  update(id: string, travel: Travel): Observable<Travel> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.put<Travel>(`${this.travelApiBaseUrl}/update/${id}`, travel,{ headers })
  }

  delete(id: string): Observable<string> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.delete<ApiResponse<string>>(`${this.travelApiBaseUrl}/delete/${id}`,{headers}).pipe(
      map(response => response.data)
    );
  }

  //BU Heads endpoints 
  getPendingRequestsForBuHead(): Observable<any[]> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<any>(`${this.travelApiBaseUrl}/exco-feedback/pending`,{headers}).pipe(
      map(response => response.data)
    );
  }

  updateBuHeadFeedback(id: string, payload: any): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.put(`${this.travelApiBaseUrl}/update/${id}`, payload, { headers });
  }
  
  //CFO endpoints 
  getPendingRequestsForCfo(): Observable<any[]> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<any>(`${this.travelApiBaseUrl}/cfo-feedback/pending`,{headers}).pipe(
      map(response => response.data)
    );
  }

  updateCfoFeedback(id: string, payload: any): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.put(`${this.travelApiBaseUrl}/update/${id}`, payload,{ headers });
  }

  //Notification endpoints
  sendApprovalEmail(payload: ApprovalEmailPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(baseUrl+'/notifications/send-approval-msg', payload,{ headers });
  }

  sendApprovalEmailFrontEnd(payload: ApprovalEmailPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(baseUrl+'/notifications/send-approval-frontend-msg', payload,{ headers });
  }

  sendApprovalEmailFrontEndWithAttachment(payload: ApprovalEmailPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(baseUrl+'/notifications/send-approval-frontend-msg-with-attachment', payload,{ headers });
  }

  sendEmailMsg(payload: EmailMsgPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(baseUrl+'/notifications/send-msg', payload,{ headers });
  }
  
  //Cfo dashboard notification endpoints 
  getMetrics(): Observable<CfoDashboardMetrics> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<CfoDashboardMetrics>(baseUrl+'/cfo-dashboard/metrics',{ headers });
  }

  getMonthlyCosts(year: number) {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<{ month: string; cost: number }[]>(
      `${baseUrl}/cfo-dashboard/monthly-costs?year=${year}`,{ headers }
    );
  }

  getTopDepartments(year: number, month?: number) {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    let params = `year=${year}`;
    if (month) params += `&month=${month}`;
    return this.http.get<{ department: string, cost: number }[]>(`${baseUrl}/cfo-dashboard/top-departments?${params}`, { headers });
  }

  //Get deoartment endpoints 
  // Use POST to pass {} in body
  // getDepartments(): Observable<{ status: string, message: string, data: Department[] }> {
  //   const token = localStorage.getItem('userToken') || '';
  //   const headers = new HttpHeaders()
  //   .set('Authorization', `Bearer ${token}`)
  //   .set('X-SrcApp', 'Travel-Request');

  //   return this.http.get<{ status: string, message: string, data: Department[] }>(this.apiUrl,{ headers });
  // }
  getDepartments(): Observable<{ status: string, message: string, data: Department[] }> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());
    return this.http.get<{ status: string, message: string, data: Department[] }>(this.apiUrl,{ headers });
  }
  
  getBAUHeads(): Observable<{ statusCode: string, statusMessage: string, data: BauHeadForm[] }> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());
    return this.http.get<{ statusCode: string, statusMessage: string, data: BauHeadForm[] }>(
      baseUrl+'/company/bau/index',{ headers }
    );
  }

  getAllPerDiemCountries(): Observable<ApiResponse<PerDiemForm[]>> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<ApiResponse<PerDiemForm[]>>(`${baseUrl}/perdiems/all`,{headers});
  }
}
