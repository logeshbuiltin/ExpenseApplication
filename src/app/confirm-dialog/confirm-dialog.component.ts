import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';


@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {

  dialogTitle: string = "Confirmation";
  confirmationDialog: string = "";

  constructor(
    private dialog: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) { 
    this.confirmationDialog = data.dialog;
  }

  ngOnInit() {
  }

  confirmDialog(value) {
    let data = { confirm: value };
    this.dialog.close(data);
  }
}

export interface DialogData {
  dialog: string;
}
