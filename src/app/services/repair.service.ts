import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RepairRequest } from '../models/repair-request.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RepairService {
  private apiUrl = `${environment.apiUrl}/repairs`;

  constructor(private http: HttpClient) { }

  // 獲取所有維修申請
  getAllRepairRequests(): Observable<RepairRequest[]> {
    return this.http.get<RepairRequest[]>(this.apiUrl);
  }

  // 獲取指定ID的維修申請
  getRepairRequest(id: number): Observable<RepairRequest> {
    return this.http.get<RepairRequest>(`${this.apiUrl}/${id}`);
  }

  // 創建新的維修申請
  createRepairRequest(repairRequest: RepairRequest): Observable<RepairRequest> {
    return this.http.post<RepairRequest>(this.apiUrl, repairRequest);
  }

  // 更新維修申請
  updateRepairRequest(repairRequest: RepairRequest): Observable<RepairRequest> {
    return this.http.put<RepairRequest>(`${this.apiUrl}/${repairRequest.id}`, repairRequest);
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
