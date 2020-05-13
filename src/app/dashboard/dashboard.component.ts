import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import {MatDialog, MatPaginator, MatSnackBar} from '@angular/material';
import { ExpenseEntryComponent } from 'app/expense-entry/expense-entry.component';
import { httpBaseService } from 'app/services/http.service';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from 'app/confirm-dialog/confirm-dialog.component';
import { environment } from 'app/application.properties';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public userId: number = 0;
  public userName: string = "";
  public length: number = 0;
  public pageSize: number = 0;
  public pageSizeOptions: any[] = [];

  public expenseList: any[] = [];
  public incomeList: any[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private baseservice: httpBaseService,
    private router: Router,
    public snackBar: MatSnackBar,
  ) { }

  //Animations
  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
    this.userName = localStorage.getItem("username");
    this.getUserDetails();
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

      const dataDailySalesChart: any = {
          labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
          series: [
              [12, 17, 7, 17, 23, 18, 38]
          ]
      };

     const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 50, // Expense App: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      }

      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

      this.startAnimationForLineChart(dailySalesChart);


      /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // Expense App: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);



      /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

      var datawebsiteViewsChart = {
        labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
        series: [
          [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

        ]
      };
      var optionswebsiteViewsChart = {
          axisX: {
              showGrid: false
          },
          low: 0,
          high: 1000,
          chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
      };
      var responsiveOptions: any[] = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

      //start animation for the Emails Subscription Chart
      this.startAnimationForBarChart(websiteViewsChart);

  }

  ngAfterViewInit() {
  }


  getUserDetails() {
    this.baseservice.setResourceURL("/register/");
    this.baseservice.getResource("user/" + this.userName).subscribe(res => {
      if(res) {
        this.userId = res.id;
        this.loadTables();
      } else {
        this.router.navigateByUrl('/login');
      }
    },error =>{
      console.log(error);
    });
  }

  onCapture(type=""){
    const dialogRef = this.dialog.open(ExpenseEntryComponent, {
      data: {
        userId: this.userId,
        type: type,
        itemDetails: "",
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTables();
    });
  }

  loadTables(){
    this.incomeList = [];
    this.expenseList = [];
    this.getExpenseList();
    this.getIncomeList();
  }

  getIncomeList() {
    this.baseservice.setResourceURL("/items");
    this.baseservice.getResource("/type/income/" + this.userId).subscribe(data => {
      if(data.items && data.items.length > 0){
        data.items.forEach(element => {
          let incmList = {
            itemId: element.id,
            purchaseType: element.purchaseType,
            entryAmount: element.entryAmount,
            description: element.description,
            purchaseDate: new Date(element.purchaseDate)
          }
          this.incomeList.push(incmList);
        });
      }
    });
  }

  getExpenseList() {
    this.baseservice.setResourceURL("/items");
    this.baseservice.getResource("/type/expense/" + this.userId).subscribe(data => {
      if(data.items && data.items.length > 0){
        data.items.forEach(element => {
          let expList = {
            itemId: element.id,
            purchaseType: element.purchaseType,
            entryAmount: element.entryAmount,
            description: element.description,
            purchaseDate: new Date(element.purchaseDate)
          }
          this.expenseList.push(expList);
        });
      }
    });
  }

  editItem(item, type) {
    const dialogRef = this.dialog.open(ExpenseEntryComponent, {
      data: {
        userId: this.userId,
        type: type,
        itemDetails: item,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.loadTables();
    });
  }

  deleteItem(item, type) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        dialog: environment.deleteConfirm,
      }
    });
    confirmDialog.afterClosed().subscribe(res => {
      if(res && res.confirm == "yes") {
        this.performDelete(item, type);
      }
    });
  }

  performDelete(item: any, type: any) {
    this.baseservice.setResourceURL("/item/");
    this.baseservice.deleteResource(item.itemId).subscribe(res => {
      if(res && res.item){
        this.snackBar.open("Deleted: ", res.item, {duration: 3000});
        if(type =='income') {
          let index = this.incomeList.findIndex(i => i == item);
          this.incomeList.splice(index, 1);
        } else {
          let index = this.expenseList.findIndex(i => i == item);
          this.expenseList.splice(index, 1);
        }
      } else {
        this.snackBar.open("Error: ", "Unable to delete the item.", {duration: 3000});
      }
    }, error =>{
      console.log(error);
    });
  }

}

