import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PerDiem } from 'src/app/shared/models/perdiem/perdiem.model';
import { ApiResponse } from 'src/app/shared/models/travel/api-response.model';
import { baseUrl,baseUrlLocal, generateUUID } from './constants';


@Injectable({
  providedIn: 'root'
})
export class PerdiemService {

  // private baseUrl = 'http://localhost:9090/camp/perdiems'; // Adjust if needed

  constructor(private http: HttpClient) { }

  getAll(): Observable<PerDiem[]> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());
    
    return this.http.get<ApiResponse<PerDiem[]>>(`${baseUrl}/perdiems/all`,{headers}).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<PerDiem> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.get<ApiResponse<PerDiem>>(`${baseUrl}/perdiems/${id}`,{headers}).pipe(
      map(response => response.data)
    );
  }

  create(travel: PerDiem): Observable<PerDiem> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.post<PerDiem>(`${baseUrl}/perdiems/add`, travel,{headers});
  }

  update(id: string, travel: PerDiem): Observable<PerDiem> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.put<PerDiem>(`${baseUrl}/perdiems/update/${id}`, travel,{headers});
  }

  delete(id: string, travel: PerDiem): Observable<PerDiem> {
    const token = localStorage.getItem('userToken') || '';
    const headers = new HttpHeaders()
    .set('Authorization', `Bearer ${token}`)
    .set('X-SrcApp', 'Travel-Request')
    .set('X-Request-ID', generateUUID());

    return this.http.delete<ApiResponse<PerDiem>>(`${baseUrl}/perdiems/delete/${id}`,{headers}).pipe(
      map(response => response.data)
    );
  }
}
