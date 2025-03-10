import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
@Injectable({providedIn: 'root'})
export class ApiService
{
  constructor(private  http:HttpClient)
  {

  }
  getApi(Url:string)
  {
    return this.http.get(Url);
  }
  postAPI(Url:string,data:any)
  {
    return this.http.post(Url,data);
  }
  putAPI(Url:string,data:any)
  {
    return this.http.put(Url,data);
  }
  delatAPI(Url :string,data:any)
  {
    return this.http.delete(Url, { body: data})
  }
}
