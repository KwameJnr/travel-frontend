import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, forkJoin, tap } from 'rxjs';
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

  private get travelApibaseUrlLocal() {
    return `${this.baseUrl}/travels`;
  }

  /* ============================
     CFO DASHBOARD METRICS
     ============================ */
    getCfoDashboardMetrics(year?: number, month?: number): Observable<any> {
      const token = localStorage.getItem('userToken') || '';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const params: any = {};
      if (year) params.year = year;
      if (month) params.month = month;

      return this.http.get<any>(
        `${this.baseUrl}/travel-request/travels/cfo-dashboard-metrics`,
        { headers, params }
      );
    }

    getDepartmentRanking(year?: number, month?: number): Observable<any> {
      const token = localStorage.getItem('userToken') || '';
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      const params: any = {};
      if (year) params.year = year;
      if (month) params.month = month;

      return this.http.get<any>(
        `${this.baseUrl}/travel-request/travels/department-ranking`,
        { headers, params }
      );
    }

  /* ============================
     APP ROLES
     ============================ */
  getApplicationRoles(): Observable<ApplicationRole[]> {
     const url = `${this.baseUrl}/travel-request/application-roles/index`;
     const token = localStorage.getItem('userToken') || '';
     const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);
    return this.http
      .get<ApiResponse<ApplicationRole[]>>(url,{headers})
      .pipe(map(res => res.data));
  }

  getApplicationRoleDetails(id: number): Observable<ApplicationRole> {
    const url = `${this.baseUrl}/travel-request/application-roles/view/${id}`;
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http
      .get<ApiResponse<ApplicationRole[]>>(url,{headers})
      .pipe(map(res => res.data[0])); // <-- take first element
  }

  addApplicationRole(role: ApplicationRole): Observable<ApplicationRole> {
    const url = `${this.baseUrl}/travel-request/application-roles/add`;
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http.post<ApiResponse<ApplicationRole>>(`${url}`, role,{headers})
      .pipe(map(res => res.data));
  }

  /* ============================
     USER ROLES
     ============================ */
  getUserRoles(): Observable<UserRole[]> {
     const url = `${this.baseUrl}/travel-request/user-roles/index`;
     const token = localStorage.getItem('userToken') || '';
     const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http
      .get<ApiResponse<UserRole[]>>(`${url}`,{headers})
      .pipe(map(res => res.data));
  }

  getUserRoleDetails(id: number): Observable<UserRole> {
    const url = `${this.baseUrl}/travel-request/user-roles/${id}`;
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http
      .get<ApiResponse<UserRole[]>>(url,{headers})
      .pipe(
        map(res => res.data[0]) 
      );
  }

  addUserRole(payload: CreateUserRoleDto): Observable<UserRole> {
    const url = `${this.baseUrl}/travel-request/user-roles/add`;
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http
      .post<ApiResponse<UserRole>>(url, payload,{headers})
      .pipe(map(res => res.data));
  }

  /* ============================
     BU HEAD & CFO BADGE COUNT
     ============================ */
  getCfoPendingCount(): Observable<number> {
    const url = `${this.baseUrl}/travel-request/travels/cfo-feedback/count?feedback=PENDING`;
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(url,{headers}).pipe(
      map(res => res?.data?.[0] ?? 0)
    );
  }

  getBuPendingCount(): Observable<number> {
    const url = `${this.baseUrl}/travel-request/travels/bu-head-feedback/count?feedback=PENDING`;

    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

    return this.http.get<any>(url, { headers }).pipe(
      map(res => res?.data?.[0] ?? 0)
    );
  }

  submitCfoApproval(payload: CfoApprovalRequest): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);
    
    return this.http.post(
      `${this.baseUrl}/travel-request/travels/cfo-approval`,
      payload,{headers}
    );
  }

  // Fetch travel requests for CFO by single feedback
  getCfoFeedbackRequests(
    feedback: 'PENDING' | 'APPROVED' | 'REJECTED'
  ): Observable<Travel[]> {

    const url = `${this.baseUrl}/travel-request/travels/cfo-feedback?feedback=${feedback}`;
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);
    console.log('Fetching CFO feedback for:', feedback, url,{headers});

    return this.http.get<any>(url,{headers}).pipe(
      map(res => {
        if (Array.isArray(res.records) && res.records.length > 0) return res.records;
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
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);
    
    return this.http.post(
      `${this.baseUrl}/travel-request/travels/bu-head-approval`,
      payload,{headers}
    );
  }

  // Fetch travel requests for CFO by single feedback
  getBuFeedbackRequests(
    feedback: 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED_FOR_REVIEW'
  ): Observable<Travel[]> {

    const url = `${this.baseUrl}/travel-request/travels/bu-head-feedback?feedback=${feedback}`;
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);
    console.log('Fetching CFO feedback for:', feedback, url,{headers});

    return this.http.get<any>(url,{headers}).pipe(
      map(res => {
        if (Array.isArray(res.records) && res.records.length > 0) return res.records;
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

  /* ============================
     TRAVEL FORMS
     ============================ */

  getMyTravelRequestsById(id: string): Observable<Travel> {
  const url = `${this.baseUrl}/travel-request/travels/view/${id}`;
  const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

  return this.http.get<ApiResponse<Travel[]>>(url,{headers}).pipe(
    map(response => {
      if (response.data && response.data.length > 0) {
        return response.data[0]; // extract the first travel from array
      }
      throw new Error('No travel data found');
    })
  );
}

updateTravelRequestsById(id: string, updatedData: any): Observable<Travel> {
  const url = `${this.baseUrl}/travel-request/travels/update/${id}`;
  const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

  return this.http.post<ApiResponse<Travel[]>>(url, updatedData,{headers}).pipe(
    map(response => {
      if (response.data && response.data.length > 0) {
        return response.data[0]; 
      }
      throw new Error('No travel data found');
    })
  );
}

  getMyTravelRequests(fNumber: string): Observable<ApiResponse<Travel[]>> {
    const url = `${this.baseUrl}/travel-request/travels/my-requests`;
    // const params = { fNumber }; 
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    console.log('Fetching my travel requests for email:', fNumber, 'URL:', url);

    return this.http.get<ApiResponse<Travel[]>>(url, {headers });
  }

  createTravelRequest(travel: Travel): Observable<ApiResponse<Travel>> {
    const url = `${this.baseUrl}/travel-request/travels/add`;
    console.log('Component travel forms:', url);
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http.post<ApiResponse<Travel>>(url, travel,{headers});
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
  
  /* ================= COMPONENT (NO AUTH) ENDPOINTS ================= */

    getComponentDepartments(): Observable<ApiResponse<Department[]>> {
      const url = `${this.baseUrl}/travel-request/components/departments`;
      const token = localStorage.getItem('userToken') || '';
      const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`);

      console.log('Component Departments:', url);
      return this.http.get<ApiResponse<Department[]>>(url,{headers});
    }

    getComponentBUHeads(code: string): Observable<ApiResponse<BauHeadForm[]>> {
      const url = `${this.baseUrl}/travel-request/components/bu-heads/${code}`;
      const token = localStorage.getItem('userToken') || '';
      const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

      console.log('Component BU Heads:', url);
      return this.http.get<ApiResponse<BauHeadForm[]>>(url,{headers});
    }

    getComponentPerDiemCountries(): Observable<ApiResponse<PerDiemForm[]>> {
      const url = `${this.baseUrl}/travel-request/components/per-diem`;
      const token = localStorage.getItem('userToken') || '';
      const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

      console.log('Component Per Diem:', url);
      return this.http.get<ApiResponse<PerDiemForm[]>>(url,{headers});
    }

}
