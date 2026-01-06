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
import { generateUUID } from './constants';
import { ConfigService } from 'src/app//config.service';


@Injectable({ providedIn: 'root' })
export class TravelService {
  constructor(private http: HttpClient, private config: ConfigService) {}

  private get baseUrl() {
    return this.config.get('baseUrl');
  }

  private get baseUrlCamp() {
    return this.config.get('baseUrlCamp');
  }

  private get travelApibaseUrlLocal() {
    return `${this.baseUrl}/travels`;
  }

  private get apiUrl() {
    return `${this.baseUrlCamp}/company/department/index`;
  }

  getAll(): Observable<Travel[]> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID()); // Generate a unique request ID

    return this.http.get<ApiResponse<Travel[]>>(`${this.travelApibaseUrlLocal}/all`,{headers}).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<Travel> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<ApiResponse<Travel>>(`${this.travelApibaseUrlLocal}/view/${id}`,{headers}).pipe(
      map(response => response.data)
    );
  }

  create(travel: Travel): Observable<ApiResponse<Travel>> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post<ApiResponse<Travel>>(`${this.travelApibaseUrlLocal}/add`, travel,{ headers});
  }  

  update(id: string, travel: Travel): Observable<Travel> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.put<Travel>(`${this.travelApibaseUrlLocal}/update/${id}`, travel,{ headers })
  }

  delete(id: string): Observable<string> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.delete<ApiResponse<string>>(`${this.travelApibaseUrlLocal}/delete/${id}`,{headers}).pipe(
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

    return this.http.get<any>(`${this.travelApibaseUrlLocal}/exco-feedback/pending`,{headers}).pipe(
      map(response => response.data)
    );
  }

  updateBuHeadFeedback(id: string, payload: any): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.put(`${this.travelApibaseUrlLocal}/update/${id}`, payload, { headers });
  }
  
  //CFO endpoints 
  getPendingRequestsForCfo(): Observable<any[]> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<any>(`${this.travelApibaseUrlLocal}/cfo-feedback/pending`,{headers}).pipe(
      map(response => response.data)
    );
  }

  updateCfoFeedback(id: string, payload: any): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.put(`${this.travelApibaseUrlLocal}/update/${id}`, payload,{ headers });
  }

  //Notification endpoints
  sendApprovalEmail(payload: ApprovalEmailPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(this.baseUrl+'/notifications/send-approval-msg', payload,{ headers });
  }

  sendApprovalEmailFrontEnd(payload: ApprovalEmailPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(this.baseUrl+'/notifications/send-approval-frontend-msg', payload,{ headers });
  }

  sendApprovalEmailFrontEndWithAttachment(payload: ApprovalEmailPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(this.baseUrl+'/notifications/send-approval-frontend-msg-with-attachment', payload,{ headers });
  }

  sendEmailMsg(payload: EmailMsgPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(this.baseUrl+'/notifications/send-msg', payload,{ headers });
  }
  
  //Cfo dashboard notification endpoints 
  getMetrics(): Observable<CfoDashboardMetrics> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<CfoDashboardMetrics>(this.baseUrl+'/cfo-dashboard/metrics',{ headers });
  }

  getMonthlyCosts(year: number, month?: number): Observable<{ month: string; cost: number }[]> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('X-SrcApp', 'Travel-Request')
      .set('X-Request-ID', generateUUID());
  
    let params = `year=${year}`;
    if (month) params += `&month=${month}`;
  
    return this.http.get<{ month: string; cost: number }[]>(`${this.baseUrl}/cfo-dashboard/monthly-costs?${params}`, { headers });
  }

  getTopDepartments(year: number, month?: number) {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    let params = `year=${year}`;
    if (month) params += `&month=${month}`;
    return this.http.get<{ department: string, cost: number }[]>(`${this.baseUrl}/cfo-dashboard/top-departments?${params}`, { headers });
  }
  
  /* ================= COMPONENT (NO AUTH) ENDPOINTS ================= */

    getComponentDepartments(): Observable<ApiResponse<Department[]>> {
      const url = `${this.baseUrl}/travel-request/components/departments`;
      console.log('Component Departments:', url);
      return this.http.get<ApiResponse<Department[]>>(url);
    }

    getComponentBUHeads(code: string): Observable<ApiResponse<BauHeadForm[]>> {
      const url = `${this.baseUrl}/travel-request/components/bu-heads/${code}`;
      console.log('Component BU Heads:', url);
      return this.http.get<ApiResponse<BauHeadForm[]>>(url);
    }

    getComponentPerDiemCountries(): Observable<ApiResponse<PerDiemForm[]>> {
      const url = `${this.baseUrl}/travel-request/components/per-diem`;
      console.log('Component Per Diem:', url);
      return this.http.get<ApiResponse<PerDiemForm[]>>(url);
    }

}
