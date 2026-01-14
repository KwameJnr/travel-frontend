import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, forkJoin, tap } from 'rxjs';
import { CfoDashboardMetrics } from 'src/app/shared/models/cfo/CfoDashboadMetrics';
import { ApprovalEmailPayload } from 'src/app/shared/models/notification/ApprovalEmailPayload';
import { EmailMsgPayload } from 'src/app/shared/models/notification/EmailMsgPayload';
import { ApiResponse, ApiResponseRec, BuheadApprovalRequest, CfoApprovalRequest } from 'src/app/shared/models/travel/api-response.model';
import { Department } from 'src/app/shared/models/deparment/department.model'; 
import { Travel } from 'src/app/shared/models/travel/travel.model';
import { BauHeadForm } from 'src/app/shared/models/buhead/buheadform';
import { PerDiemForm } from 'src/app/shared/models/perdiem/perdiemform.model';
import { generateUUID } from './constants';
import { ConfigService } from 'src/app//config.service';
import { ApplicationRole } from 'src/app/shared/models/app/application-role-model';
import { CreateUserRoleDto, UserRole } from 'src/app/shared/models/app/user-role-models';


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

  // App roles
  getApplicationRoles(): Observable<ApplicationRole[]> {
     const url = `${this.baseUrl}/travel-request/application-roles/index`;
    return this.http
      .get<ApiResponse<ApplicationRole[]>>(url)
      .pipe(map(res => res.data));
  }

  getApplicationRoleDetails(id: number): Observable<ApplicationRole> {
    const url = `${this.baseUrl}/travel-request/application-roles/view/${id}`;

    return this.http
      .get<ApiResponse<ApplicationRole[]>>(url)
      .pipe(map(res => res.data[0])); // <-- take first element
  }

  addApplicationRole(role: ApplicationRole): Observable<ApplicationRole> {
    const url = `${this.baseUrl}/travel-request/application-roles/add`;

    return this.http.post<ApiResponse<ApplicationRole>>(`${url}`, role)
      .pipe(map(res => res.data));
  }

  // User roles
  getUserRoles(): Observable<UserRole[]> {
     const url = `${this.baseUrl}/travel-request/user-roles/index`;

    return this.http
      .get<ApiResponse<UserRole[]>>(`${url}`)
      .pipe(map(res => res.data));
  }

  getUserRoleDetails(id: number): Observable<UserRole> {
    const url = `${this.baseUrl}/travel-request/user-roles/${id}`;

    return this.http
      .get<ApiResponse<UserRole[]>>(url)
      .pipe(
        map(res => res.data[0]) 
      );
  }

  addUserRole(payload: CreateUserRoleDto): Observable<UserRole> {
    const url = `${this.baseUrl}/travel-request/user-roles/add`;

    return this.http
      .post<ApiResponse<UserRole>>(url, payload)
      .pipe(map(res => res.data));
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

  // createTravelRequest(travel: Travel): Observable<ApiResponse<Travel>> {
  //   const token = localStorage.getItem('userToken') || '';
  //   const headers = new HttpHeaders()
  //   .set('Authorization', `Bearer ${token}`)
  //   .set('X-SrcApp', 'Travel-Request')
  //   .set('X-Request-ID', generateUUID());

  //   return this.http.post<ApiResponse<Travel>>(`${this.travelApibaseUrlLocal}/add`, travel,{ headers});
  // }  

  getCfoPendingCount(): Observable<number> {
    const url = `${this.baseUrl}/travel-request/travels/cfo-feedback?feedback=PENDING`;

    return this.http.get<any>(url).pipe(
      map(res => res?.totalRecords ?? 0)
    );
  }

  getBuPendingCount(): Observable<number> {
    const url = `${this.baseUrl}/travel-request/travels/bu-head-feedback?feedback=PENDING`;

    return this.http.get<any>(url).pipe(
      map(res => res?.totalRecords ?? 0)
    );
  }

  submitCfoApproval(payload: CfoApprovalRequest): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/travel-request/travels/cfo-approval`,
      payload
    );
  }

  // Fetch travel requests for CFO by single feedback
  getCfoFeedbackRequests(
    feedback: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Observable<Travel[]> {

    const url = `${this.baseUrl}/travel-request/travels/cfo-feedback?feedback=${feedback}`;
    console.log('Fetching CFO feedback for:', feedback, url);

    return this.http.get<any>(url).pipe(
      map(res => {
        // Prioritize records if available
        if (Array.isArray(res.records) && res.records.length > 0) return res.records;
        // Fallback to data if available
        if (Array.isArray(res.data) && res.data.length > 0) return res.data;
        console.warn('No data found for feedback:', feedback, res);
        return [];
      })
    );
  }

  // Fetch travel requests by multiple feedbacks
  getCfoFeedbackRequestsByMultiple(
    feedbacks: ('PENDING' | 'APPROVED' | 'REJECTED')[]
  ): Observable<Travel[]> {

    return forkJoin(
      feedbacks.map(f => 
        this.getCfoFeedbackRequests(f).pipe(
          tap(res => console.log(`Feedback ${f} returned ${res.length} items`))
        )
      )
    ).pipe(
      map(results => results.flat())
    );
  }

  submitBuApproval(payload: BuheadApprovalRequest): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/travel-request/travels/bu-head-approval`,
      payload
    );
  }

  // Fetch travel requests for CFO by single feedback
  getBuFeedbackRequests(
    feedback: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED_FOR_REVIEW'
  ): Observable<Travel[]> {

    const url = `${this.baseUrl}/travel-request/travels/bu-head-feedback?feedback=${feedback}`;
    console.log('Fetching CFO feedback for:', feedback, url);

    return this.http.get<any>(url).pipe(
      map(res => {
        // Prioritize records if available
        if (Array.isArray(res.records) && res.records.length > 0) return res.records;
        // Fallback to data if available
        if (Array.isArray(res.data) && res.data.length > 0) return res.data;
        console.warn('No data found for feedback:', feedback, res);
        return [];
      })
    );
  }

  // Fetch travel requests by multiple feedbacks
  getBuFeedbackRequestsByMultiple(
    feedbacks: ('PENDING' | 'APPROVED' | 'REJECTED')[]
  ): Observable<Travel[]> {

    return forkJoin(
      feedbacks.map(f => 
        this.getCfoFeedbackRequests(f).pipe(
          tap(res => console.log(`Feedback ${f} returned ${res.length} items`))
        )
      )
    ).pipe(
      map(results => results.flat())
    );
  }

  getMyTravelRequestsById(id: string): Observable<Travel> {
  const url = `${this.baseUrl}/travel-request/travels/view/${id}`;
  return this.http.get<ApiResponse<Travel[]>>(url).pipe(
    map(response => {
      if (response.data && response.data.length > 0) {
        return response.data[0]; // extract the first travel from array
      }
      throw new Error('No travel data found');
    })
  );
}


  getMyTravelRequests(fNumber: string): Observable<ApiResponse<Travel[]>> {
    const url = `${this.baseUrl}/travel-request/travels/my-requests`;
    const params = { fNumber }; // query param

    console.log('Fetching my travel requests for email:', fNumber, 'URL:', url);

    return this.http.get<ApiResponse<Travel[]>>(url, { params });
  }

  createTravelRequest(travel: Travel): Observable<ApiResponse<Travel>> {
    const url = `${this.baseUrl}/travel-request/travels/add`;
    console.log('Component travel forms:', url);
    return this.http.post<ApiResponse<Travel>>(url, travel);
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
