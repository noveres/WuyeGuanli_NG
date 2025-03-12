import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface FinancialRecord {
  id?: number;
  date: string;
  type: '收入' | '支出';
  amount: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private apiUrl = `${environment.apiUrl}/financial`;

  constructor(private http: HttpClient) {}

  getRecords(): Observable<FinancialRecord[]> {
    return this.http.get<FinancialRecord[]>(this.apiUrl);
  }

  getRecord(id: number): Observable<FinancialRecord> {
    return this.http.get<FinancialRecord>(`${this.apiUrl}/${id}`);
  }

  createRecord(record: FinancialRecord): Observable<FinancialRecord> {
    return this.http.post<FinancialRecord>(this.apiUrl, record);
  }

  updateRecord(id: number, record: FinancialRecord): Observable<FinancialRecord> {
    return this.http.put<FinancialRecord>(`${this.apiUrl}/${id}`, record);
  }

  deleteRecord(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }


}
