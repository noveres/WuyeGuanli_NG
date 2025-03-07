import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  GetApi<T>(url: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${url}`);
  }

  PostApi<T>(url: string, PostData: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}${url}`, PostData);
  }

  PutApi<T>(url: string, PostData: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}${url}`, PostData);
  }

  DeleteApi<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}${url}`);
  }

  // 獲取靜態資源的完整URL
  getStaticUrl(path: string): string {
    return `${this.baseUrl}${path}`;
  }
}
