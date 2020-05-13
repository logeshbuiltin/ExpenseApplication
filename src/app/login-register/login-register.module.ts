import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatRippleModule, MatSelectModule, MatTooltipModule, MatPaginatorModule, MatDialogModule, MatTableModule, MatSnackBarModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginRegisterRoutes } from './login-register.routing';

const matModules = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatRippleModule,
  MatSelectModule,
  MatTooltipModule,
  MatPaginatorModule,
  MatDialogModule,
  MatTableModule,
  MatSnackBarModule
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LoginRegisterRoutes),
    FormsModule,
    ReactiveFormsModule,
    matModules
  ],
  declarations: [
    LoginComponent,
    RegisterComponent
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    FormsModule,
    ReactiveFormsModule,
    matModules
  ]
})
export class LoginRegisterModule { }
