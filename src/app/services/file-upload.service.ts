import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost:8585/api';

  constructor(private http: HttpClient) {}

  /**
   * 上傳圖片到服務器
   * @param file 要上傳的文件
   * @returns 包含上傳進度的 Observable
   */
  uploadImage(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.baseUrl}/upload/image`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  /**
   * 從服務器獲取圖片URL
   * @param imageName 圖片名稱
   * @returns 完整的圖片URL
   */
  getImageUrl(imageName: string): string {
    if (!imageName) return '';
    return `${this.baseUrl}/upload/images/${imageName}`;
  }

  /**
   * 刪除服務器上的圖片
   * @param imageName 圖片名稱
   * @returns 操作結果的 Observable
   */
  deleteImage(imageName: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/upload/images/${imageName}`);
  }
}
