import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarfeeService {
  private baseUrl = 'http://localhost:8585/money';

  constructor(private http: HttpClient) { }

  // 獲取所有停車費用資料
  getAllFees(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sendtotalfee`);
  }



  // 新增或更新停車費用資料
  saveOrUpdateFee(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/saveorupdate`, data);
  }

  // 更新付款狀態方法
  updatePaidStatus(): Observable<any> {
    return this.http.put(`${this.baseUrl}/updatepaidstatus`, {});
  }

  // 刪除方法保持不變
  deleteFee(parking: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${parking}`);
  }

}