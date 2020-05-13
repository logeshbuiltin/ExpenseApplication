import { Component, OnInit } from '@angular/core';
import { httpBaseService } from 'app/services/http.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  updateForm: FormGroup;
  userName: any = "";

  constructor(
    private baseservice: httpBaseService,
    private formBuilder: FormBuilder,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.setInitialization();
    this.getUserDetails();
  }

  setInitialization() {
    this.userName = localStorage.getItem("username");
    this.updateForm = this.formBuilder.group({
      userName: [this.userName, Validators.required],
      password: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNo: ['', Validators.required],
      emailId: ['', Validators.required],
      shopId: ['234'],
    });
  }

  getUserDetails() {
    this.baseservice.setResourceURL("/register");
    this.baseservice.getResource("/user/"+ this.userName)
    .subscribe(res=>{
      if(res) {
        if(res.username) {
          this.updateForm.get('password').setValue(res.password);
          this.updateForm.get('firstName').setValue(res.firstname);
          this.updateForm.get('lastName').setValue(res.lastname);
          this.updateForm.get('phoneNo').setValue(res.phoneNo);
          this.updateForm.get('emailId').setValue(res.emailId);
        }
      }
    }, error =>{
      console.log(error);
    });
  }

  onSubmit(data) {
    const updateUser = {
      username: data.userName,
      password: data.password,
      firstname: data.firstName,
      lastname: data.lastName,
      emailIdNo: data.phoneNo
    }
    this.baseservice.setResourceURL("/register");
    this.baseservice.putResource("/user/"+ this.userName, updateUser)
    .subscribe(res=>{
      if(res) {
        if(res.username) {
          this.snackBar.open("Success: ", "User has been updated.", {duration: 3000});
        } else {
          if(res.error) {
            this.snackBar.open("Error: ", res.reason, {duration: 3000});
          }
        }
      }
    }, error =>{
      console.log(error);
    });
  }

}
