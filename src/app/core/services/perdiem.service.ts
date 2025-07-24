import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { PerDiem } from 'src/app/shared/models/perdiem/perdiem.model';
import { ApiResponse } from 'src/app/shared/models/travel/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class PerdiemService {

  private baseUrl = 'http://localhost:9090/camp/perdiems'; // Adjust if needed

  constructor(private http: HttpClient) { }

  getAll(): Observable<PerDiem[]> {
    return this.http.get<ApiResponse<PerDiem[]>>(`${this.baseUrl}/all`).pipe(
      map(response => response.data)
    );
  }
  
  getById(id: string): Observable<PerDiem> {
    return this.http.get<ApiResponse<PerDiem>>(`${this.baseUrl}/${id}`).pipe(
      map(response => response.data)
    );
  }

  create(travel: PerDiem): Observable<PerDiem> {
    return this.http.post<PerDiem>(`${this.baseUrl}/add`, travel);
  }

  update(id: string, travel: PerDiem): Observable<PerDiem> {
    return this.http.put<PerDiem>(`${this.baseUrl}/update/${id}`, travel);
  }

  delete(id: string, travel: PerDiem): Observable<PerDiem> {
    return this.http.delete<ApiResponse<PerDiem>>(`${this.baseUrl}/delete/${id}`).pipe(
      map(response => response.data)
    );
  }
}
