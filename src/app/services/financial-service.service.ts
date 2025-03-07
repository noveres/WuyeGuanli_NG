import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {


  constructor(private http: HttpClient) {}
//-------------------------------------------------------------------
  private valueSubject = new BehaviorSubject<any>([]);

  setValue(newValue: []): void {
    this.valueSubject.next(newValue); // 更新值
  }

  getValue(): Observable<[]> {
    return this.valueSubject.asObservable(); // 返回 Observable，讓訂閱者可以接收值
  }
  //----------------------------------------------------------------

  GetApi(url: string) {
    return this.http.get(url)
  }

  PostApi(url: string, PostData: any) {
    return this.http.post(url,PostData)
  }

  PutApi(url: string, PostData: any)  {
    return this.http.put(url,PostData)
  }

  DeleteApi(url: string)  {
    return this.http.delete(url)
  }
}
