import { Component, OnInit, Inject } from '@angular/core';
import { Description } from 'app/models/description.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatSnackBar} from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { httpBaseService } from 'app/services/http.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-expense-entry',
  templateUrl: './expense-entry.component.html',
  styleUrls: ['./expense-entry.component.scss']
})
export class ExpenseEntryComponent implements OnInit {
  userId: string;
  type: string;
  itemDetails: any;

  descValue: any;
  descExtra: any;
  amount: any;
  expDate: any;

  dialogTitle: any;
  updateInvoice: FormGroup;

  otherExpence: boolean = false;


  description: Description[]=[
    {id:1, name:'dinner'},
    {id:2, name:'breakfast'},
    {id:3, name:'lunch'},
    {id:4, name:'groceries'},
    {id:5, name:'fuel'},
    {id:6, name:'Other Expense'}
  ]
  constructor(
    private dialog:MatDialogRef<ExpenseEntryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private formBuilder: FormBuilder,
    private baseservice: httpBaseService,
    public datepipe: DatePipe,
    public snackBar: MatSnackBar,
  ) {
    this.userId = data.userId;
    this.type = data.type;
    this.itemDetails = data.itemDetails;
  }

  ngOnInit() {
    this.setInitialValue();
  }

  setInitialValue() {
    if(this.type == "expense") {
      this.dialogTitle = "Enter Expense";
    } else {
      this.dialogTitle = "Enter Income";
    }
    this.updateInvoice = this.formBuilder.group({
      descValue: ['', Validators.required],
      descExtra: [''],
      amount: ['', Validators.required],
      expDate: ['', Validators.required],
    });
    if(this.itemDetails) {
      this.otherExpence = true;
      this.descValue = 6;
      this.descExtra = this.itemDetails.description;
      this.amount = this.itemDetails.entryAmount;
      this.expDate = this.datepipe.transform(this.itemDetails.purchaseDate, 'yyyy-MM-dd');
    }
  }

  checkDesc(event) {
    if(event && event == 6) {
      this.otherExpence = true;
    } else {
      this.otherExpence = false;
    }
  }

  onSubmit(data) {
    if(this.itemDetails) {
      this.editItem(data);
    } else {
      this.saveItem(data);
    }
  }

  editItem(data: any) {
    let desc = data.descExtra? {name: data.descExtra}: this.description.find(d => d.id == data.descValue);
    let expenseData = {
      id: this.itemDetails.itemId,
      purchaseType: this.type,
      entryAmount: data.amount,
      description: desc.name,
      purchaseDate: this.datepipe.transform(data.expDate, 'yyyy-MM-dd'),
      userId: this.userId
    }
    this.baseservice.setResourceURL("/item/");
    this.baseservice.putResource(this.itemDetails.itemId, expenseData).subscribe(res => {
      if(res && res.id) {
        this.snackBar.open("Success", this.type + " has been updated successfully", {duration: 3000})
        this.closeDialog();
      } 
    },error =>{
      console.log(error);
    });
  }

  saveItem(data: any) {
    let desc = data.descExtra? {name: data.descExtra}: this.description.find(d => d.id == data.descValue);
    let expenseData = {
      purchaseType: this.type,
      entryAmount: data.amount,
      description: desc.name,
      purchaseDate: this.datepipe.transform(data.expDate, 'yyyy-MM-dd'),
      userId: this.userId
    }
    this.baseservice.setResourceURL("/item/");
    this.baseservice.postResource(this.userId, expenseData).subscribe(res => {
      if(res && res.id) {
        this.snackBar.open("Success", this.type + " has been updated successfully", {duration: 3000})
        this.closeDialog();
      } 
    },error =>{
      console.log(error);
    });
  }

  closeDialog(){
    this.dialog.close();
  }
}


export interface DialogData {
  userId: string;
  type: string;
  itemDetails: any;
}
