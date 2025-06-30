import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { Travel } from '.../shared/models/travel/travel.model'; // You’ll define this
import { Travel } from 'src/app/shared/models/travel/travel.model';


@Injectable({
  providedIn: 'root'
})
export class TravelService {
  private baseUrl = 'http://localhost:8084/travelrequestservice/uat/api/travels'; // Adjust if needed

  constructor(private http: HttpClient) { }

  getAll(): Observable<Travel[]> {
    return this.http.get<Travel[]>(`${this.baseUrl}/all`);
  }

  getById(id: string): Observable<Travel> {
    return this.http.get<Travel>(`${this.baseUrl}/${id}`);
  }

  // getById(id: string): Observable<Travel> {
  //   return this.http.get<Travel>(`${this.baseUrl}/${id}`);
  // }

  create(travel: Travel): Observable<Travel> {
    return this.http.post<Travel>(`${this.baseUrl}/add`, travel);
  }

  update(id: string, travel: Travel): Observable<Travel> {
    return this.http.put<Travel>(`${this.baseUrl}/update/${id}`, travel);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${id}`);
  }
}
