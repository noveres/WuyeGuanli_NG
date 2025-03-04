import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {

  constructor(private http: HttpClient) {}

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
