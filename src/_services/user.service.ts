import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { userModel } from '_models/userModel';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private valuesUrl = environment.apiUrl;
  static readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  register(user: userModel): Observable<any>{
    console.log(user);
    return this.http.post(this.valuesUrl+'/register',JSON.stringify(user), UserService.httpOptions).pipe(
      tap((user) => console.log(`added product w/ id=${user.toString}`))
    );
  }
}
