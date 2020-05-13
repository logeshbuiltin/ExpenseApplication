import { Injectable } from "@angular/core";


@Injectable({
    providedIn: "root"
  })
  export class EnvoirnmentService {
    public apiUrl: string = "http://127.0.0.1:5000";
    public enableDebug = true;
    public loginImage: string = "";
    public logMessages: boolean = false;
    constructor() {}
  }