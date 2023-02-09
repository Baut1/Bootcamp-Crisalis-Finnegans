import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private _groupId!: string;
  private _headers!: HttpHeaders;

  constructor(private http: HttpClient) {
    this._headers = new HttpHeaders({ Group: this._groupId });
  }

  public get<T>(url: string, activateHeader:boolean = false):Observable<T> {
    return this.http.get<T>(url, activateHeader ? { headers: this._headers }: {});
  }

  public post<T>(path:string, body:any, activateHeader:boolean = false):Observable<T> {
    return this.http.post<T>(environment.Api + path, body,
      activateHeader ? {
        headers: this._headers
      } : {}
    );
  }

  public delete<T>(url: string, activateHeader:boolean = false, id:string ):Observable<T> {
    return this.http.delete<T>(`${url}/${id}`, activateHeader ? { headers: this._headers }: {});
  }

  
}
