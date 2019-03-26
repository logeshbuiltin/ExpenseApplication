import { Component, OnInit, ViewChild } from '@angular/core';
import * as Chartist from 'chartist';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatTableDataSource, MatPaginator, matTabsAnimations} from '@angular/material';
import { ExpenseEntryComponent } from 'app/expense-entry/expense-entry.component';
import { HttpClient } from '@angular/common/http';
import { Employee } from 'app/models/employee.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  public length: number = 0;
  public pageSize: number = 0;
  public pageSizeOptions: any[] = [];
  private products : Employee[] = []; 
  dataSource = new MatTableDataSource(ELEMENT_DATA);
  displayedColumns = ['EmpID', 'Name', 'EmpCode', 'Salary', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private dialog:MatDialog,
    private httpClient : HttpClient
    ) { }
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
          high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
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
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
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

      this.loadTables();

  }

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource<any>(); 
    this.dataSource.paginator = this.paginator;
  }

  onCapture(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    this.dialog.open(ExpenseEntryComponent, dialogConfig);
  }

  onCapture2(){
    this.dialog.open(ExpenseEntryComponent);
}

loadTables(){
  let expenseList = [];
  this.httpClient.get<any[]>('http://localhost:8080/employees').subscribe(data => {
      let empService = {} as EmployeeList;
      if(data){
        data.forEach(element => {
          empService.empId = element.EmpID;
          empService.empName = element.Name;
          empService.empCode = element.Empcode;
          empService.empSalary = element.Salary;
        });
        expenseList.push(empService);
      }
      this.dataSource = new MatTableDataSource<any>(expenseList);
    });
  }

}

const ELEMENT_DATA: Employee[] = [
  {EmpID: 1, Name: 'John', EmpCode: 'Doe', Salary: 7500},
  {EmpID: 1, Name: 'Mike', EmpCode: 'Hussey', Salary: 8000},
  {EmpID: 1, Name: 'Ricky', EmpCode: 'Hans', Salary: 3500},
  {EmpID: 1, Name: 'Martin', EmpCode: 'Kos', Salary: 7000},
  {EmpID: 1, Name: 'Tom', EmpCode: 'Paisa', Salary: 4000}
];

export interface EmployeeList{
  empId: string;
  empName: string;
  empCode: string;
  empSalary: number;
}

