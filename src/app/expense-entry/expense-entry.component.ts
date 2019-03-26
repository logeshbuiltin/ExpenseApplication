import { Component, OnInit } from '@angular/core';
import { Description } from 'app/models/description.model';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig} from '@angular/material';

@Component({
  selector: 'app-expense-entry',
  templateUrl: './expense-entry.component.html',
  styleUrls: ['./expense-entry.component.scss']
})
export class ExpenseEntryComponent implements OnInit {

  description: Description[]=[
    {id:1, name:'Banner Expense'},
    {id:2, name:'Food Expense'},
    {id:3, name:'Drink Expense'},
    {id:4, name:'Employee Expense'},
    {id:5, name:'Other Expense'}
  ]
  constructor(private dialog:MatDialog) { }

  ngOnInit() {
  }

  closeDialog(){
    this.dialog.closeAll();
  }

}
