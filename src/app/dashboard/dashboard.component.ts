import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from '../service/api/api.service';
import * as Chartist from 'chartist';
import {AlbumModule} from '../albums/album.module';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TrackModule} from '../tracks/track.module';
// import * as am4core from "@amcharts/amcharts4/core";
// import * as am4charts from "amcharts4/charts";
// import * as CanvasJS from './canvasjs.min';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  nbAlbums: number=null;
  nbSingles: number=null;
  nbViewsAlbums: number=null;
  nbRatingAlbums: number=null;
  nbViewsTracks: number=null;
  nbRatingTracks: number=null;
  montant: number = null;
  singlesPrice: number=null;
  albumsPrice: number=null;
  albumPrice: number=0.0;
  albums: AlbumModule[] = [];
  form: FormGroup;

  selectedAlbum: AlbumModule;
  dataSourceAlbums: MatTableDataSource<TrackModule>;
  displayedColumnsAlbums: string[] = ['trackNumber', 'trackTitle', 'views', 'rating', 'price'];
  mytracks: TrackModule[] = [];
  // @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  //   this.paginator = mp;
  //   this.setDataSourceAttributes();
  // }

  dataSourceSingles: MatTableDataSource<TrackModule>;
  displayedColumnsSingles: string[] = ['trackNumber', 'trackTitle'];
  @ViewChild('MatSortS') sortSingle: MatSort;
  @ViewChild('MatPaginatorS') paginatorSingle: MatPaginator;
  @ViewChild('MatPaginatorS') set matPaginator2(mps: MatPaginator) {
    this.paginatorSingle = mps;
    this.setDataSourceAttributes2();
  }

  // Tracks Statistics
    // 1st chart
  private dataTracksViewsChart: any;
  private optionsTracksViewsChart: any;
  private responsiveOptionsViews: any;
    // 2nd chart
  private dataTracksRatingChart: any;
  private optionsTracksRatingChart: any;
  private responsiveOptionsRating: any;

  // price albums
  public priceAlbumsData: Array<any> = [
    { data: [ 10, 20, 30 ],
      label: ''
    }
  ];
  public priceAlbumsLabels: Array<any> = [ 10, 20, 30];
  public priceAlbumsOptions: any = {
    responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          max : 1000,
          min : 0,
        }
      }]
    },
  };
  public priceAlbumsType = 'line';

  // price singles
  public priceSinglesData: Array<any> = [
    { data: [ 40, 50, 60],
      label: ''
    }
  ];
  public priceSinglesLabels: Array<any> = [ 40, 50, 60 ];
  public priceSinglesOptions: any = {
    responsive: true,
    scales : {
      yAxes: [{
        ticks: {
          max : 1000,
          min : 0,
        }
      }]
    },
  };
  public priceSinglesType = 'line';

  // bar chart albums
  public barChartOptionsAlbums = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      display: true,
      text: ' "Nombre de j\'aime et de vues par album." '
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'titre de l\'album'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Nombre de vues / j\'aime'
        }
      }]
    }
  };
  public barChartLabelsAlbums = [];
  public barChartTypeAlbums = 'bar';
  public barChartLegendAlbums = true;
  public barChartDataAlbums = [{data: [], label: 'j\'aime'},{data: [], label: 'vues'}];

  // pie chart albums
  public pieChartOptionsAlbums = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      display: true,
      text: ' "Pourcentage de nombre de vues pour chaque album." '
    }
  };
  public pieChartLabelsAlbums = [];
  public pieChartDataAlbums = [];
  public pieChartTypeAlbums = 'pie';
  public pieChartColorsAlbums = [];

  // doughnut chart albums
  public doughnutChartOptionsAlbums = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      display: true,
      text: ' "Pourcentage de nombre de j\'aime pour chaque album." '
    }
  };
  public doughnutChartLabelsAlbums = [];
  public doughnutChartDataAlbums = [];
  public doughnutChartTypeAlbums = 'doughnut';
  public doughnutChartColorsAlbums = [];

  // bar chart singles
  public barChartOptionsSingles = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      display: true,
      text: '"Nombre de j\'aimes et de vues par single."'
    },
    scales: {
      xAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Numéro de single'
        }
      }],
      yAxes: [{
        display: true,
        scaleLabel: {
          display: true,
          labelString: 'Nombre de vues / j\'aime'
        }
      }]
    }
  };
  public barChartLabelsSingles = [];
  public barChartTypeSingles = 'bar';
  public barChartLegendSingles = true;
  public barChartDataSingles = [{data: [], label: 'j\'aime'},{data: [], label: 'vues'}];

  // pie chart singles
  public pieChartOptionsSingles = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      display: true,
      text: '"Pourcentage de nombre de vues pour chaque single."'
    }
  };
  public pieChartLabelsSingles = [];
  public pieChartDataSingles = [];
  public pieChartTypeSingles = 'pie';
  public pieChartColorsSingles = [];

  // doughnut chart singles
  public doughnutChartOptionsSingles = {
    scaleShowVerticalLines: false,
    responsive: true,
    title: {
      display: true,
      text: '"Pourcentage de nombre de j\'aime pour chaque single."'
    }
  };
  public doughnutChartLabelsSingles = [];
  public doughnutChartDataSingles = [];
  public doughnutChartTypeSingles = 'doughnut';
  public doughnutChartColorsSingles = [];

  // doughnut chart prices
  public doughnutOptionsPrices = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public doughnutLabelsPrices = [];
  public doughnutDataPrices = [];
  public doughnutTypePrices = 'doughnut';
  public doughnutColorsPrices = [
    {backgroundColor: this.getRandomColor(2),
      borderColor: this.getRandomColor(2),
      borderWidth: 1}
  ];
  prices: any = [];

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.dataSourceAlbums = new MatTableDataSource(this.mytracks);
    this.dataSourceSingles = new MatTableDataSource();
  }


  ngOnInit() {

    // this.dataSourceAlbums.paginator = this.paginator;
    // this.dataSourceAlbums.sort = this.sort;

    this.dataSourceSingles.paginator = this.paginatorSingle;
    this.dataSourceSingles.sort = this.sortSingle;

    this.form = this.fb.group({
      album: ['', Validators.required],
    });

    this.countAndSum();

    // prices
    this.doughnutDataPrices = this.prices;
    // console.log(this.prices);
    this.doughnutLabelsPrices = ['singles', 'albums'];


    // albums statistics
    this.apiService.getStatisticsAlbums(localStorage.getItem('CONNECTED_ID')).subscribe(value => {

      this.albums = value;

      let names = value.map(value1 => value1.albumName);
      let views = value.map(value1 => value1.views);
      let rating = value.map(value1 => value1.rating);

      let colors1 = this.getRandomColor(names.length);
      let colors2 = this.getRandomColor(names.length);

      this.barChartLabelsAlbums = names;
      this.barChartDataAlbums = [{data: rating, label: 'j\'aime'},{data: views, label: 'vues'}];

      this.pieChartLabelsAlbums = names;
      this.pieChartDataAlbums = views;
      this.pieChartColorsAlbums = [
        {backgroundColor: colors1,
          borderColor: colors1,
          borderWidth: 1}
      ];

      this.doughnutChartLabelsAlbums = names;
      this.doughnutChartDataAlbums = rating;
      this.doughnutChartColorsAlbums = [
        {backgroundColor: colors2,
          borderColor: colors2,
          borderWidth: 1}
      ];

    }, error => {
      console.log(error);
    });

    // singles statistics
    this.apiService.getStatisticsSingles(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      let names = value.map(value1 => value1.trackTitle);
      let numbers = value.map(value1 => value1.trackNumber);
      let views = value.map(value1 => value1.views);
      let rating = value.map(value1 => value1.rating);

      let colors1 = this.getRandomColor(numbers.length);
      let colors2 = this.getRandomColor(numbers.length);

      this.barChartLabelsSingles = numbers;
      this.barChartDataSingles = [{data: rating, label: 'j\'aime'},{data: views, label: 'vues'}];

      this.pieChartLabelsSingles = names;
      this.pieChartDataSingles = views;
      this.pieChartColorsSingles = [
        {backgroundColor: colors1,
          borderColor: colors1,
          borderWidth: 1}
      ];

      this.doughnutChartLabelsSingles = names;
      this.doughnutChartDataSingles = rating;
      this.doughnutChartColorsSingles = [
        {backgroundColor: colors2,
          borderColor: colors2,
          borderWidth: 1}
      ];

      // this.dataSourceSingles.data = value;
      // this.dataSourceAlbums = new MatTableDataSource(new TrackModule[0]);
      this.dataSourceSingles = new MatTableDataSource(value);

    }, error => {
      console.log(error);
    });

    // init tracks views chart
    this.dataTracksViewsChart = { labels: [], series: [] };
    this.optionsTracksViewsChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50,
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    };
    this.responsiveOptionsViews = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var tracksViewsChart = new Chartist.Line('#tracksViewsChart', this.dataTracksViewsChart, this.optionsTracksViewsChart, this.responsiveOptionsViews);
    this.startAnimationForLineChart(tracksViewsChart);

    // init tracks rating chart
    this.dataTracksRatingChart = { labels: [], series: [] };
    this.optionsTracksRatingChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 50,
    };
    this.responsiveOptionsRating = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var tracksRatingChart = new Chartist.Bar('#tracksRatingChart', this.dataTracksRatingChart, this.optionsTracksRatingChart, this.responsiveOptionsRating);
    this.startAnimationForBarChart(tracksRatingChart);

  }

/*  setDataSourceAttributes() {
    this.dataSourceAlbums.paginator = this.paginator;
    this.dataSourceAlbums.sort = this.sort;
  }*/

  setDataSourceAttributes2() {
    this.dataSourceSingles.paginator = this.paginatorSingle;
    this.dataSourceSingles.sort = this.sortSingle;
  }

  countAndSum(){
    this.apiService.countAlbumsByUser(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.nbAlbums=value;
    }, error => {
      console.log(error);
    });

    this.apiService.countSinglesByUser(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.nbSingles=value;
    }, error => {
      console.log(error);
    });

    this.apiService.sumViewsByUserAlbum(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.nbViewsAlbums=value;
    }, error => {
      console.log(error);
    });

    this.apiService.sumViewsByUserTrack(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.nbViewsTracks=value;
    }, error => {
      console.log(error);
    });

    this.apiService.sumRatingByUserAlbum(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.nbRatingAlbums=value;
    }, error => {
      console.log(error);
    });

    this.apiService.sumRatingByUserTrack(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.nbRatingTracks=value;
    }, error => {
      console.log(error);
    });

    this.apiService.sumPriceByUserTrack(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.singlesPrice=value;
      this.prices.push(this.singlesPrice);
    }, error => {
      console.log(error);
    });

    this.apiService.sumPriceByAlbum(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.albumsPrice=value;
      this.prices.push(this.albumsPrice);
    }, error => {
      console.log(error);
    });

    this.montant = this.albumsPrice + this.singlesPrice;
    //console.log(this.montant);
  }

  getRandomColor(length: number): string[] {
    let colors: string[] = [];
    while(length > 0){
      let color: string =  'rgba('+ Math.floor(Math.random() * 255) + ','
        + Math.floor(Math.random() * 255) + ','
        + Math.floor(Math.random() * 255) + ','
        + '0.2)';
      // console.log(color);
      colors.push(color);
      length--;
    }
    //console.log(colors);
    return colors;
  }

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

  applyFilter1(filterValue: string) {

    this.dataSourceAlbums.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceAlbums.paginator) {
      this.dataSourceAlbums.paginator.firstPage();
    }
  }

  applyFilter2(filterValue: string) {

    this.dataSourceSingles.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceSingles.paginator) {
      this.dataSourceSingles.paginator.firstPage();
    }
  }

  display(){
    let albumId = this.form.get('album').value;

    this.apiService.getAlbumById(albumId).subscribe(value => {
      this.selectedAlbum = value;
    }, error => console.log(error));

    this.apiService.getStatisticsTracks(albumId).subscribe(value => {
      let titles = value.map(value1 => value1.trackTitle);
      let numbers = value.map(value1 => value1.trackNumber);
      let views = value.map(value1 => value1.views);
      let rating = value.map(value1 => value1.rating);
      let rating2: any = rating;
      let prices = value.map(value1 => value1.price);

      let maxViews = views.reduce((a, b)=>Math.max(a, b));
      let maxRating = rating2.reduce((a, b)=>Math.max(a, b));
      let price = prices.reduce((acc, value) => acc + value, 0);

      this.albumPrice = price;

      this.dataTracksViewsChart = { labels: numbers, series: [views] };
      this.optionsTracksViewsChart = {
        lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
        }),
        low: 0,
        high: maxViews+10,
        chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Numéro de chanson'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Nombre de vues'
            }
          }]
        }
      };
      var tracksViewsChart = new Chartist.Line('#tracksViewsChart', this.dataTracksViewsChart, this.optionsTracksViewsChart);
      this.startAnimationForLineChart(tracksViewsChart);

      this.dataTracksRatingChart = { labels: numbers, series: [rating] };
      this.optionsTracksRatingChart = {
        axisX: {
          showGrid: false
          // chartPadding: { left: -50 }
        },
        low: 0,
        high: maxRating+10,
        chartMargin: { left: -10 },
        scales: {
          xAxes: [{
            // chartPadding: { left: -50 },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Numéro de chanson'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Nombre de j\'aime'
            }
          }]
        }
      };
      this.responsiveOptionsRating = [
        ['screen and (max-width: 640px)', {
          seriesBarDistance: 5,
          axisX: {
            labelInterpolationFnc: function (value) {
              return value[0];
            }
          }
        }]
      ];
      var tracksRatingChart = new Chartist.Bar('#tracksRatingChart', this.dataTracksRatingChart, this.optionsTracksRatingChart, this.responsiveOptionsRating);
      this.startAnimationForBarChart(tracksRatingChart);

      this.mytracks = value;
      this.dataSourceAlbums = new MatTableDataSource(this.mytracks);
      // this.dataSourceAlbums.data = value;

    }, error => {
      console.log(error);
    });

  }

  getTotalPrice() {
    return this.mytracks.map(t => t.price).reduce((acc, value) => acc + value, 0);
  }

  /*ngOnInit(){
    // Initialize a Line chart in the container with the ID chart1
    new Chartist.Line('#chart1', {
      labels: [1, 2, 3, 4],
      series: [[100, 120, 180, 200]]
    });

    // Initialize a Line chart in the container with the ID chart2
    new Chartist.Bar('#chart2', {
      labels: [1, 2, 3, 4],
      series: [[5, 2, 8, 3]]
    });

    // Initialize a Line chart in the container with the ID chart2
    new Chartist.Line('#chart3', {
      labels: [1, 2, 3, 4, 5, 6, 7, 8],
      series: [
        [10, 20, 15, 50, 70, 44, 30, 100]
      ]
    }, {
      low: 0,
      showArea: true
    });

    // Initialize a Line chart in the container with the ID chart2
    new Chartist.Pie('#chart4', {
      series: [20, 10, 30, 40]
    }, {
      donut: true,
      donutWidth: 60,
      donutSolid: true,
      startAngle: 270,
      showLabel: true
    });

  }*/

  /*ngOnInit(){

    /!* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- *!/

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


    /!* ----------==========     Completed Tasks Chart initialization    ==========---------- *!/

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



    /!* ----------==========     Emails Subscription Chart initialization    ==========---------- *!/

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

  }*/
}
