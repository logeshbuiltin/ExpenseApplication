import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { EnvoirnmentService } from "./environment.service";
import 'rxjs/add/operator/catch';
import "rxjs/add/operator/map";


@Injectable({
    providedIn: 'root'
})
export class httpBaseService implements HttpInterceptor {

    protected resourceUrl: string;
    private baseUrl: string;

    httpOptions = {
        headers: new HttpHeaders({
            "content-type": 'application/json',
            "Access-Control-Allow-Methods": 'POST,GET,PUT,DELETE',
            "Access-Control-Allow-Origin": 'http://localhost:4200'
        })
    };

    constructor(
        private env: EnvoirnmentService,
        private http: HttpClient,
    ) {
        this.baseUrl = env.apiUrl;
    }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (!request.url.includes("integration/token")) {
            const jwtToken = localStorage.getItem("jwt_token");
            const userName = localStorage.getItem("userName");
            request = request.clone({
              setHeaders: {
                "X-JWT-TOKEN": atob(jwtToken),
                "X-USERNAME": atob(userName)
              }
            });
          }
          return next.handle(request).catch(response => {
            this.displayToastMessage(response);
            return throwError(response);
        });
    }

    displayToastMessage(response) {
        let statusText = response.statusText;
        let message = "Oops something went wrong. Contact Admin";
    }

    setResourceURL(url) {
        this.resourceUrl = url;
    }

    getResource(params) {
        const data = this.baseUrl + this.resourceUrl + params;
        return this.http.get(data, this.httpOptions).map((res: any) => res);
    }

    postResource(params, payload) {
        const url = this.baseUrl + this.resourceUrl + params;
        console.log(url);
        return this.http
          .post(url, payload, this.httpOptions)
          .map((res: any) => res);
    }

    putResource(params, payload) {
        const url = this.baseUrl + this.resourceUrl + params;
        return this.http.put(url, payload, this.httpOptions).map((res: any) => res);
    }

    deleteResource(params) {
        const url = this.baseUrl + this.resourceUrl + params;
        return this.http
          .delete(url, { responseType: "json" })
          .map((res: any) => res);
    }
    
}