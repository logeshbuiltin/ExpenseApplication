import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { httpBaseService } from 'app/services/http.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private baseservice: httpBaseService,
    public snackBar: MatSnackBar,
    ) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      userEmail: ['', Validators.required],
      userPhone: ['', Validators.required],
      shopID: ['', Validators.required],
    });
  }

  onSubmit(data){
    let username = data.userEmail;
    const userData = {
      username: data.userEmail,
      password: data.password,
      firstname: data.firstName,
      lastname: data.lastName,
      email_id: data.userEmail,
      phone_no: data.userPhone
    }
    this.baseservice.setResourceURL("/register/");
    this.baseservice.postResource("user/"+username, userData)
    .subscribe(res=>{
      if(res){
        if(res.registration == "success") {
          this.snackBar.open("Info: ", "User registered successfully",{duration: 3000});
          this.router.navigate(['/login']);
        } else {
          if(res.registration == "exists") {
            this.snackBar.open("Error: ", "User already exists",{duration: 3000});
          }
        }
      }
    }, error =>{
      console.log(error);
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }

}
