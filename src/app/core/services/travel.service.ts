import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiResponse } from 'src/app/shared/models/travel/api-response.model';
// import { Travel } from '.../shared/models/travel/travel.model'; // You’ll define this
import { Travel } from 'src/app/shared/models/travel/travel.model';


@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private baseUrl = 'http://localhost:8084/travelrequestservice/uat/api/travels'; // Adjust if needed

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

  create(travel: Travel): Observable<Travel> {
    return this.http.post<Travel>(`${this.baseUrl}/add`, travel);
  }

  update(id: string, travel: Travel): Observable<Travel> {
    return this.http.put<Travel>(`${this.baseUrl}/update/${id}`, travel);
  }

  // delete(id: string): Observable<void> {
  //   return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  // }
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
    return this.http.put(`${this.baseUrl}/exco-feedback/pending`, payload);
  }
  
}
