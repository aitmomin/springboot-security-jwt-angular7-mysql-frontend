import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TrackModule} from '../tracks/track.module';
import {ApiService} from '../service/api/api.service';
import {Router} from '@angular/router';
import {PlayerService} from '../service/player/player.service';
import {first} from 'rxjs/operators';
import {ArtistModule} from '../artists/artist.module';

@Component({
  selector: 'app-mysingles',
  templateUrl: './mysingles.component.html',
  styleUrls: ['./mysingles.component.scss']
})
export class MysinglesComponent implements OnInit {

  displayedColumns: string[] = ['trackImageURL', 'trackNumber', 'trackTitle', 'time', 'releaseDate', 'views', 'rating'];
  dataSource: MatTableDataSource<TrackModule>;
  // displayedColumns: string[] = ['trackNumber', 'trackTitle', 'time', 'releaseDate', 'views', 'rating'];
  user: ArtistModule = new ArtistModule();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  mysingles: TrackModule[] = [];

  constructor(private apiService: ApiService, private playerService: PlayerService) {
    this.dataSource = new MatTableDataSource(this.mysingles);
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.userConnected();
    this.mysgl();
  }

  mysgl(){
    this.apiService.getSinglesByArtist(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.mysingles = value;
      this.dataSource = new MatTableDataSource(this.mysingles);
    },
      error => console.error(error)
    );
  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  playTrackS(single) {
    localStorage.removeItem('idTPlayer');
    localStorage.removeItem('idAPlayer');
    localStorage.removeItem('albumPlayer');
    localStorage.removeItem('idSPlayer');
    localStorage.removeItem('titlePlayer');
    localStorage.removeItem('artistPlayer');
    localStorage.setItem('idTPlayer', '');
    localStorage.setItem('albumPlayer', '');
    localStorage.setItem('idAPlayer', this.user.id+'');
    localStorage.setItem('idSPlayer', single.id);
    localStorage.setItem('titlePlayer', single.trackTitle);
    localStorage.setItem('artistPlayer', this.user.nickname);
    this.playerService.playTrack(single.id);
    this.updateViews(single);
  }

  updateViews(track: TrackModule) {
    this.apiService.updateTrack(track).pipe(first())
      .subscribe(
        data => {
          //this.router.navigate(['list']);
          console.log('updated !!!!');
          //this.allTracks();
        },
        error => {
          console.log(error);
        });
  }

  userConnected(){
    this.apiService.getArtistById(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.user = value;
    }, error => {
      console.log(error);
    });
  }

}
