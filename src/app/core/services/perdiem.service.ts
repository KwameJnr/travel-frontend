import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PerDiem } from 'src/app/shared/models/perdiem/perdiem.model';
import { ApiResponse } from 'src/app/shared/models/travel/api-response.model';
import { generateUUID } from './constants';
import { ConfigService } from 'src/app//config.service';
import { ApprovalEmailPayload } from 'src/app/shared/models/notification/ApprovalEmailPayload';


@Injectable({
  providedIn: 'root'
})
export class PerdiemService {

  // private baseUrl = 'http://localhost:9090/camp/perdiems'; // Adjust if needed

  private baseUrl: string; 
  private baseUrlCamp: string;

  constructor(private http: HttpClient, private config: ConfigService) { 
    this.baseUrl = this.config.get('baseUrl');
    this.baseUrlCamp = this.config.get('baseUrlCamp');
  }

  getAll(): Observable<PerDiem[]> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());
    
    return this.http.get<ApiResponse<PerDiem[]>>(`${this.baseUrl}/perdiems/all`,{headers}).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<PerDiem> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<ApiResponse<PerDiem>>(`${this.baseUrl}/perdiems/${id}`,{headers}).pipe(
      map(response => response.data)
    );
  }

  create(travel: PerDiem): Observable<PerDiem> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post<PerDiem>(`${this.baseUrl}/perdiems/add`, travel,{headers});
  }

  update(id: string, travel: PerDiem): Observable<PerDiem> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.put<PerDiem>(`${this.baseUrl}/perdiems/update/${id}`, travel,{headers});
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

  sendApprovalEmail(payload: ApprovalEmailPayload): Observable<any> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post(this.baseUrl+'/notifications/send-approval-msg', payload,{ headers });
  }
}
