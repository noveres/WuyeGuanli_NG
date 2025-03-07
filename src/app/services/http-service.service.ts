import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) {}

  GetApi<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  PostApi<T>(url: string, PostData: any): Observable<T> {
    return this.http.post<T>(url, PostData);
  }

  PutApi<T>(url: string, PostData: any): Observable<T> {
    return this.http.put<T>(url, PostData);
  }

  DeleteApi<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}