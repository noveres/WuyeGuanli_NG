import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { RepairRequest } from '../models/repair-request.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepairRequestService {
  private apiUrl = `${environment.apiUrl}/repairs`;

  constructor(private http: HttpClient) { }

  private transformDates(repair: RepairRequest): RepairRequest {
    return {
      ...repair,
      create_time: repair.create_time || undefined,
      process_time: repair.process_time || undefined
    };
  }

  // 獲取所有維修申請
  getRepairRequests(): Observable<RepairRequest[]> {
    return this.http.get<RepairRequest[]>(this.apiUrl).pipe(
      map(repairs => repairs.map(repair => this.transformDates(repair)))
    );
  }

  // 獲取指定ID的維修申請
  getRepairRequest(id: number): Observable<RepairRequest> {
    return this.http.get<RepairRequest>(`${this.apiUrl}/${id}`).pipe(
      map(repair => this.transformDates(repair))
    );
  }

  // 創建新的維修申請
  createRepairRequest(repairRequest: RepairRequest): Observable<RepairRequest> {
    return this.http.post<RepairRequest>(this.apiUrl, repairRequest).pipe(
      map(repair => this.transformDates(repair))
    );
  }

  // 更新維修申請
  updateRepairRequest(id: number, repairRequest: RepairRequest): Observable<RepairRequest> {
    return this.http.put<RepairRequest>(`${this.apiUrl}/${id}`, repairRequest).pipe(
      map(repair => this.transformDates(repair))
    );
  }

  // 刪除維修申請
  deleteRepairRequest(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // 上傳維修照片
  uploadPhoto(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/upload`, formData);
  }
}
