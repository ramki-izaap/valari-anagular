import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../services/dashboard/dashboard.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

//SERVICES
import { SalesOrderService } from '../../../services/sales-order/sales-order.service';
import { AuthService } from '../../../services/auth/auth.service';
import { UsersService } from '../../../services/users/users.service';
import { PurchaseOrderService } from '../../../services/purchase-order/purchase-order.service';


declare const AmCharts: any;

import '../../../../assets/charts/amchart/amcharts.js';
import '../../../../assets/charts/amchart/gauge.js';
import '../../../../assets/charts/amchart/pie.js';
import '../../../../assets/charts/amchart/serial.js';
import '../../../../assets/charts/amchart/light.js';
import '../../../../assets/charts/amchart/ammap.js';
import '../../../../assets/charts/amchart/usaLow.js';
import { ProductAddComponent } from '../../inventory/product/product-add/product-add.component';

@Component({
  selector: 'app-ecommerce',
  templateUrl: './ecommerce.component.html',
  styleUrls: [
    './ecommerce.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class EcommerceComponent implements OnInit {
  public saleReport1Data: any;
  public saleReport2Data: any;
  public saleReport3Data: any;
  public saleReport4Data: any;
  public saleReportOption: any;
  public salesOrder:any;
  public purchaseOrder:any;
  public userInfo:any;
  public secLineData: any;
  public secOption: any;
  public ddate :any;
  public dtotal:number;
  public weektotal:number;
  public monthtotal:number;
  public yearlytotal:number;
  public yeartotal:number;
  public role: any = [];
  public graphName: any = [];
  constructor(private DashboardService: DashboardService, private salesOrderService: SalesOrderService,private router: Router,private authService: AuthService,private usersService: UsersService ,private purchaseService:PurchaseOrderService) { }

  ngOnInit() {

    this.DashboardService
      .getSalesReportChart()
      .subscribe((res => { 
        console.log('Chart Report', res);
        this.generateGraph(res.most_products);
        const ordres = [];
        const dx = [];
        let total = 0;
        for (const ordre of res.daily) {
          ordres.push(ordre.orders);
          dx.push(ordre.createddate);
          total+= Number(ordre.orders);
        }
        this.dtotal = Math.round(total);

        const weekly = [];
        var wtotal = 0;
        const wx = [];
        for (const week of res.weekly) {
          weekly.push(week.orders);
          wx.push(week.week);
          wtotal+= Number(week.orders);
        }
        this.weektotal = Math.round(wtotal);

        const monthly = [];
        var mtotal = 0;
        const mx = [];
        for (const month of res.monthly) {
          monthly.push(month.orders);
          mx.push(month.month);
          mtotal+= Number(month.orders);
        }
        this.monthtotal = Math.round(mtotal);

        const yearly = [];
        var ytotal = 0;
        const xy = [];
        for (const year of res.yearly) {
          yearly.push(year.orders);
          xy.push(year.year);
          ytotal+= Number(year.orders);
        }
        this.yeartotal = Math.round(ytotal);

        const products = [];
        const month = [];
        const salesordr = [];
        for (const product of res.most_products) {
          products.push(product.product_variant_name);
          month.push(product.month);
          salesordr.push(product.orders);
        }
        
        this.yearlytotal = ytotal;
      
    setTimeout(() => {

      this.saleReport1Data = saleReportChart('#448aff', dx, '#448aff',ordres);

      this.saleReport2Data = saleReportWeeklyChart('#11c15b',wx, '#11c15b',weekly);

      this.saleReport3Data = saleReportMonthlyChart('#536dfe', mx, '#536dfe',monthly);

      this.saleReport4Data = saleReporYearlytChart('#ff5252', xy, '#ff5252',yearly);

      this.saleReportOption = saleReportBuildOption();

      this.secLineData = secChart('#b71c1c', [10, 30, 15, 20, 25, 30, 15, 25, 35, 30, 20, 10, 12, 10], 'transparent');
      
      this.secOption = secBuildOption();
      
    }, 75);
    
    }));


    // Sales Orders
    if (this.authService.getUserRole() === 'A') {
      // this
      // .purchaseService
      // .getAllPurcahseOrders()
      // .subscribe((result =>  {
      //   this.purchaseOrder = result;
      //   console.log('Total purcahse ordre',this.purchaseOrder);
      //   }));
      
    } else {
      this
        .salesOrderService
        .getAllSalesOrders()
        .subscribe((result =>  {
          this.salesOrder = result;
          console.log('Total sales ordre',this.salesOrder);
          }));
    }

    // Users
    this.role = this.authService.getUserRole(),
    this.usersService.getUsers(this.role, this.authService.getUserId()).subscribe((result => {
      this.userInfo = result;
    }))
    
  }

  pucahseView(id) {

    this.router.navigate(['/purchase/view/' + id]);
   }
   salesView(id) {

    this.router.navigate(['/sales-order/view/' + id]);
   }
   pucahseList(){

    this.router.navigate(['/purchase/']);
   }
   salesList(){

    this.router.navigate(['/sales-order/']);
   }

   customers(){
     
    if (this.authService.getUserRole() === 'A'){
      this.router.navigate(['/vendors/']);
    } else {
      this.router.navigate(['/user/']);
    }
   }

   generateGraph(pro:any=''){
     let color: any = ['#FF0F00','#F8FF01','#04D215','#2A0CD0','#CD0D74'];
     let i:number = 0;
     for(const a of pro) 
     {
        const graph: GraphName = {
        sku: a.sku,
        visit: a.quantity,
        color: color[i]
      };
      this.graphName.push(graph);
      i++;
    }

    AmCharts.makeChart("top-sold-products", {
      "type": "serial",
      "theme": "light",
      "marginRight": 70,
      "dataProvider":this.graphName,        
      "valueAxes": [{
        "axisAlpha": 0,
        "position": "left",
        "title": "Sold Quantity"
      }],
      "startDuration": 1,
      "graphs": [{
        "balloonText": "<b>[[category]]: [[value]]</b>",
        "fillColorsField": "color",
        "fillAlphas": 0.9,
        "lineAlpha": 0.2,
        "type": "column",
        "valueField": "visit"
      }],
      "chartCursor": {
        "categoryBalloonEnabled": false,
        "cursorAlpha": 0,
        "zoomable": false
      },
      "categoryField": "sku",
      "categoryAxis": {
        "gridPosition": "start",
        "labelRotation": 45
      },
      "export": {
        "enabled": true
      }
    
    });
    console.log('Generated Graph',this.graphName);
   }

}

function saleReportChart(a, b, f, orders:any ='') {
  if (f == null) {
    f = 'rgba(0,0,0,0)';
  }
  
  return {

    labels: orders,
    //labels: [this.dorders],
    datasets: [{
      label: '',
      borderColor: a,
      borderWidth: 2,
      hitRadius: 30,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 12,
      pointBackgroundColor: '#000000',
      pointBorderColor: a,
      pointHoverBackgroundColor: a,
      pointHoverBorderColor: 'transparent',
      fill: true,
      lineTension: 0,
      backgroundColor: f,
      data: b,
    }]
  };
}


function saleReportWeeklyChart(a, b, f, orders:any ='') {
  if (f == null) {
    f = 'rgba(0,0,0,0)';
  }
  
  return {

    labels: orders,
    //labels: [this.dorders],
    datasets: [{
      label: '',
      borderColor: a,
      borderWidth: 2,
      hitRadius: 30,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 12,
      pointBackgroundColor: '#000000',
      pointBorderColor: a,
      pointHoverBackgroundColor: a,
      pointHoverBorderColor: 'transparent',
      fill: true,
      lineTension: 0,
      backgroundColor: f,
      data: b,
    }]
  };
}


function saleReportMonthlyChart(a, b, f, orders:any ='') {
  if (f == null) {
    f = 'rgba(0,0,0,0)';
  }
  
  return {

    labels: orders,
    //labels: [this.dorders],
    datasets: [{
      label: '',
      borderColor: a,
      borderWidth: 2,
      hitRadius: 30,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 12,
      pointBackgroundColor: '#000000',
      pointBorderColor: a,
      pointHoverBackgroundColor: a,
      pointHoverBorderColor: 'transparent',
      fill: true,
      lineTension: 0,
      backgroundColor: f,
      data: b,
    }]
  };
}

function saleReporYearlytChart(a, b, f, orders:any ='') {
  if (f == null) {
    f = 'rgba(0,0,0,0)';
  }
  
  return {

    labels: orders,
    //labels: [this.dorders],
    datasets: [{
      label: '',
      borderColor: a,
      borderWidth: 2,
      hitRadius: 30,
      pointRadius: 0,
      pointHoverRadius: 4,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 12,
      pointBackgroundColor: '#000000',
      pointBorderColor: a,
      pointHoverBackgroundColor: a,
      pointHoverBorderColor: 'transparent',
      fill: true,
      lineTension: 0,
      backgroundColor: f,
      data: b,
    }]
  };
}
function saleReportBuildOption() {
  return {
    title: {
      display: !1
    },
    tooltips: {
      position: 'nearest',
      mode: 'index',
      intersect: false,
      yPadding: 10,
      xPadding: 10,
    },
    legend: {
      display: !1,
      labels: {
        usePointStyle: !1
      }
    },
    responsive: !0,
    maintainAspectRatio: !0,
    hover: {
      mode: 'index'
    },
    scales: {
      xAxes: [{
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: 'Month'
        }
      }],
      yAxes: [{
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: 'Value'
        },
        ticks: {
          beginAtZero: !0
        }
      }]
    },
    elements: {
      point: {
        radius: 4,
        borderWidth: 12
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10
      }
    }
  };
}

function secChart(a, b, f) {
  if (f == null) {
    f = 'rgba(0,0,0,0)';
  }

 
  return {
    labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'],
    datasets: [{
      label: '',
      borderColor: a,
      borderWidth: 2,
      hitRadius: 30,
      pointRadius: 2,
      pointHoverRadius: 4,
      pointBorderWidth: 5,
      pointHoverBorderWidth: 12,
      pointBackgroundColor: '#000000',
      pointBorderColor: a,
      pointHoverBackgroundColor: a,
      pointHoverBorderColor: 'transparent',
      fill: true,
      lineTension: 0,
      backgroundColor: f,
      data: b,
    }]
  };
}
function secBuildOption() {
  return {
    title: {
      display: !1
    },
    tooltips: {
      position: 'nearest',
      mode: 'index',
      intersect: false,
      yPadding: 10,
      xPadding: 10,
    },
    legend: {
      display: !1,
      labels: {
        usePointStyle: !1
      }
    },
    responsive: !0,
    maintainAspectRatio: !0,
    hover: {
      mode: 'index'
    },
    scales: {
      xAxes: [{
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: 'Month'
        }
      }],
      yAxes: [{
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: 'Value'
        },
        ticks: {
          beginAtZero: !0
        }
      }]
    },
    elements: {
      point: {
        radius: 4,
        borderWidth: 12
      }
    },
    layout: {
      padding: {
        left: 30,
        right: 10,
        top: 20,
        bottom: 0
      }
    }
  };
}

export interface GraphName{
  
  sku:string
  color:string,
  visit:string,
  
}