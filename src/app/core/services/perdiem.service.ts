import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PerDiem, PerDiemCreateRequest, PerDiemEditRequest } from 'src/app/shared/models/perdiem/perdiem.model';
import { ApiResponse } from 'src/app/shared/models/travel/api-response.model';
import { generateUUID } from './constants';
import { ConfigService } from 'src/app//config.service';
import { ApprovalEmailPayload } from 'src/app/shared/models/notification/ApprovalEmailPayload';


@Injectable({
  providedIn: 'root'
})
export class PerdiemService {

  private baseUrl: string; 
  private baseUrlCamp: string;

  constructor(private http: HttpClient, private config: ConfigService) { 
    this.baseUrl = this.config.get('baseUrl');
    this.baseUrlCamp = this.config.get('baseUrlCamp');
  }

  getAll(): Observable<PerDiem[]> {
    const token = localStorage.getItem('userToken') || '';
      const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http.get<ApiResponse<PerDiem[]>>(`${this.baseUrl}/travel-request/perdiems/index`,{headers}).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<PerDiem | undefined> {
    const token = localStorage.getItem('userToken') || '';
      const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);

    return this.http
      .get<ApiResponse<PerDiem[]>>(`${this.baseUrl}/travel-request/perdiems/${id}`,{headers})
      .pipe(
        map(response => response.data?.[0])
      );
  }

  create(travel: PerDiemCreateRequest): Observable<PerDiemCreateRequest> {

    return this.http.post<PerDiem>(`${this.baseUrl}/travel-request/perdiems/add`, travel);
  }

  update(id: string, payload: Partial<PerDiemEditRequest>): Observable<PerDiemEditRequest> {
    const token = localStorage.getItem('userToken') || '';
      const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`);
    
    return this.http.put<PerDiemEditRequest>(
      `${this.baseUrl}/travel-request/perdiems/update/${id}`,
      payload,
      {headers}
    );
  }

  delete(id: string, travel: PerDiem): Observable<PerDiem> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.delete<ApiResponse<PerDiem>>(`${this.baseUrl}/perdiems/delete/${id}`,{headers}).pipe(
      map(response => response.data)
    );
  }

}
