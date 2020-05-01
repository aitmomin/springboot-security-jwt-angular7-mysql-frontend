import {Component, ElementRef, OnInit, AfterViewInit, ViewChild} from '@angular/core';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {Advertisement, ApiService} from '../service/api/api.service';
import {Observable} from 'rxjs';
import * as Chart from 'chart.js';
import {string} from '@amcharts/amcharts4/core';
declare var $: any;

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit{

  adv: Advertisement = new  Advertisement();

  constructor(private apiService: ApiService) {
  }

  ngOnInit() {
    $('.ui.rating').rating();
    $('.ui.button').popup();
  }

  loadAdvertisement() {
    this.apiService.getAdvertisements().subscribe(value => {
      this.adv = value;
    }, error => console.log(error));
  }

  continue2(){
    console.log('test...');
  }


  // data
  public lineChartData: Array<number> = [ 10,20,30,10,60];

  public labelMFL: Array<any> = [
    { data: this.lineChartData,
      label: ''
      //this.SystemName
    }
  ];
  // labels
  public lineChartLabels: Array<any> = ["2018-01-29 10:00:00", "2018-01-29 10:10:00", "2018-01-29 10:20:00", "2018-01-29 10:29:00", "2018-01-29 10:30:00" ];

  public lineChartOptions: any = {
    responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          max : 60,
          min : 0,
        }
      }],
      xAxes: [{
        min: '2018-01-29 10:08:00', // how to?
        //  max: '2018-01-29 10:48:00', // how to?
        type: 'time',
        time: {
          unit: 'minute',
          unitStepSize: 10,
          displayFormats: {
            'second': 'HH:mm:ss',
            'minute': 'HH:mm:ss',
            'hour': 'HH:mm',
          },
        },
      }],
    },
  };

  _lineChartColors:Array<any> = [{
    backgroundColor: 'red',
    borderColor: 'red',
    pointBackgroundColor: 'red',
    pointBorderColor: 'red',
    pointHoverBackgroundColor: 'red',
    pointHoverBorderColor: 'red'
  }];



  public lineChartType = 'line';

  public chartClicked(e: any): void {
    console.log(e);
  }
  public chartHovered(e: any): void {
    console.log(e);
  }

}

