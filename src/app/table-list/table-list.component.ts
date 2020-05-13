import { Component, OnInit } from '@angular/core';
import { httpBaseService } from 'app/services/http.service';
import { identifierModuleUrl } from '@angular/compiler';
import { Description } from 'app/models/description.model';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  userName: string = "";
  userId: any;

  userEntryDetails: any[] = [];

  monthList: Description[]=[
    {id:1, name:'January'},
    {id:2, name:'Feb'},
    {id:3, name:'Oct'},
    {id:4, name:'Nov'},
    {id:5, name:'Dec'},
    {id:6, name:'Feb'}
  ]

  constructor(
    private baseservice: httpBaseService,
  ) { }

  ngOnInit() {
    this.setInitialize();
    this.getUserDetails();
  }

  setInitialize() {
    this.userName = localStorage.getItem("username");
  }

  getUserDetails() {
    this.baseservice.setResourceURL("/register/");
    this.baseservice.getResource("user/" + this.userName).subscribe(res => {
      if(res) {
        this.userId = res.id;
        this.userEntryDetails = [];
        this.fetchDetails();
      } 
    },error =>{
      console.log(error);
    });
  }

  fetchDetails() {
    this.baseservice.setResourceURL("/items/");
    this.baseservice.getResource("user/" + this.userId).subscribe(res => {
      if(res && res.items.length > 0) {
        res.items.forEach(element => {
          const data = {
            itemId: element.id,
            type: element.purchaseType,
            amount: element.entryAmount,
            desc: element.description,
            date: element.purchaseDate,
            userName: this.userName
          }
          this.userEntryDetails.push(data);
        });
      } 
    },error =>{
      console.log(error);
    });
  }

}
