import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { httpBaseService } from 'app/services/http.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  username: any = "";

  constructor( 
      private formBuilder: FormBuilder,
      private router: Router,
      private baseservice: httpBaseService,
      public snackBar: MatSnackBar,
    ) {
   }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(data){
    const userData = {
      username: data.username,
	    password: data.password
    }
    this.baseservice.setResourceURL("/auth");
    this.baseservice.postResource("", userData)
    .subscribe(res=>{
      if(res) {
        if(res.access_token) {
          localStorage.setItem("jwt_token", res.access_token);
          localStorage.setItem("username", data.username);
          this.router.navigateByUrl('/dashboard');
        } else {
          if(res.error && res.error == "Bad Request") {
            this.snackBar.open("Error: ", res.description,{duration: 3000});
          }
        }
      }
    }, error =>{
      console.log(error);
    });
  }

  registerUser() {
    this.router.navigateByUrl('/register');
  }

}
