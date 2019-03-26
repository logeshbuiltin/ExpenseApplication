import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '_services/user.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
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

  onSubmit(){
   this.userService.register(this.registerForm.value)
   .pipe(first())
   .subscribe(
     data => {
      this.router.navigate(['/login']);
     },
     error => {
       console.log("Error");
     },
   );

  }

}
