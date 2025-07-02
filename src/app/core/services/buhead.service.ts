import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/travel/api-response.model';
import { Travel } from 'src/app/shared/models/travel/travel.model';
import { BuHead } from 'src/app/shared/models/buhead/buhead.model';

@Injectable({
  providedIn: 'root'
})
export class BuheadService {
  private baseUrl = 'http://localhost:8084/travelrequestservice/uat/api/buheads'; // Adjust if needed

  constructor(private http: HttpClient) { }

  getAll(): Observable<BuHead[]> {
    return this.http.get<ApiResponse<BuHead[]>>(`${this.baseUrl}/all`).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<BuHead> {
    return this.http.get<ApiResponse<BuHead>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  create(travel: BuHead): Observable<BuHead> {
    return this.http.post<BuHead>(`${this.baseUrl}/add`, travel);
  }

  update(id: string, travel: BuHead): Observable<BuHead> {
    return this.http.put<BuHead>(`${this.baseUrl}/update/${id}`, travel);
  }

  delete(id: string, travel: BuHead): Observable<BuHead> {
    return this.http.delete<ApiResponse<BuHead>>(`${this.baseUrl}/delete/${id}`).pipe(
      map(response => response.data)
    );
  }

  // //BU Heads endpoints 
  // getPendingRequestsForBuHead(): Observable<any[]> {
  //   return this.http.get<any>(`${this.baseUrl}/exco-feedback/pending`).pipe(
  //     map(response => response.data)
  //   );
  // }

  // updateBuHeadFeedback(id: string, payload: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/update/${id}`, payload);
  // }
  
  // //CFO endpoints 
  // getPendingRequestsForCfo(): Observable<any[]> {
  //   return this.http.get<any>(`${this.baseUrl}/cfo-feedback/pending`).pipe(
  //     map(response => response.data)
  //   );
  // }

  // updateCfoFeedback(id: string, payload: any): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/update/${id}`, payload);
  // }
}
