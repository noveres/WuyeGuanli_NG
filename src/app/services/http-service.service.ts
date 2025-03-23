import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  constructor(private http: HttpClient) { }

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
  //Dialog
  private dialogColse = new BehaviorSubject<number>(0);

  setNum(num: number) {
    this.dialogColse.next(num)
  }

  getNum(): Observable<number> {
    return this.dialogColse.asObservable();
  }
  //search
  private Data = new BehaviorSubject<any>([]);

  setData(array: []) {
    this.Data.next(array)
  }

  getData(): Observable<any> {
    return this.Data.asObservable();
  }
  //google gas
  private uploadUrl = 'YOUR_GOOGLE_APPS_SCRIPT_URL'; // Google Apps Script 部署網址

  uploadFile(formData: any): Observable<any> {
    return this.http.post<any>(this.uploadUrl, formData);
  }
}

