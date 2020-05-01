import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TrackModule} from '../tracks/track.module';
import {first} from 'rxjs/operators';
import {Advertisement, ApiService} from '../service/api/api.service';
import {PlayerService} from '../service/player/player.service';
import {ArtistModule} from '../artists/artist.module';

export class Playlist {
  nickname: string;
  album: string;
  track: string;
  albumID: string;
  trackID: string;
}

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})

export class PlaylistComponent implements OnInit {

  displayedColumns: string[] = ['image', 'track', 'time', 'artist', 'album', 'gender'];
  dataSource: MatTableDataSource<Object>;
  myplaylist: Playlist[] = [];
  user: ArtistModule = new ArtistModule();
  adv: Advertisement = new  Advertisement();
  song: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  constructor(private apiService: ApiService, private playerService: PlayerService) {
    this.dataSource = new MatTableDataSource(this.myplaylist);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.userConnected();
    this.playlist();
  }

  playlist(){
    this.apiService.getPlaylist(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.myplaylist = value;
      this.dataSource = new MatTableDataSource(this.myplaylist);
      console.log(value);
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

  playTrackS(row) {
    localStorage.removeItem('idTPlayer');
    localStorage.removeItem('idAPlayer');
    localStorage.removeItem('albumPlayer');
    localStorage.removeItem('idSPlayer');
    localStorage.removeItem('titlePlayer');
    localStorage.removeItem('artistPlayer');
    localStorage.setItem('idTPlayer', '');
    localStorage.setItem('albumPlayer', '');
    localStorage.setItem('idAPlayer', this.user.id+'');
    localStorage.setItem('idSPlayer', row[6]);
    localStorage.setItem('titlePlayer', row[0]);
    localStorage.setItem('artistPlayer', row[2]);
    this.playerService.playTrack(row[6]);
    this.apiService.getTrackById(row[6]).subscribe(value => {
      this.updateViews(value);
    }, error => console.log(error));
  }

  playTrackT(row){
    localStorage.removeItem('idSPlayer');
    localStorage.removeItem('idTPlayer');
    localStorage.removeItem('idTPlayer2');
    localStorage.removeItem('idAPlayer');
    localStorage.removeItem('titlePlayer');
    localStorage.removeItem('artistPlayer');
    localStorage.removeItem('albumPlayer');
    localStorage.setItem('idSPlayer', '');
    localStorage.setItem('idAPlayer', this.user.id+'');
    localStorage.setItem('idTPlayer', row[5]);
    localStorage.setItem('idTPlayer2', row[6]);
    localStorage.setItem('titlePlayer', row[0]);
    localStorage.setItem('artistPlayer', row[2]);
    localStorage.setItem('albumPlayer', row[3]);
    this.playerService.playTrack(row[6]);
    this.apiService.getTrackById(row[6]).subscribe(value => {
      this.updateViews(value);
    }, error => console.log(error));
  }

  playTrackWithAdvrt(row){
    if (row[5]===null){
      this.playTrackS(row);
    } else {
      this.playTrackT(row);
    }
    this.song = row[6];
    this.apiService.getAdvertisements().subscribe(value => {
      this.playerService.pauseTrack();
      this.adv = value;
    }, error => console.log(error));
  }

  clickLinkAdvertisement(){
    if (localStorage.getItem('CONNECTED_ID')){
      this.addUserAdvertisement(localStorage.getItem('CONNECTED_ID'), this.adv.id+'');
      this.updatePriceTrack(this.song+'', this.adv.id+'');
      // console.log('add user + update price')
    }
    this.updateAdvertisement(this.adv.id+'');
    // console.log('update advert count')
  }

  playTrackWithoutAdvrt(row){
    if (row[5]===null){
      this.playTrackS(row);
    } else {
      this.playTrackT(row);
    }
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

  updateAdvertisement(advert: string){
    this.apiService.updateAdvertisement(advert).pipe(first())
      .subscribe(
        data => {
          console.log('advertisement updated !!!!');
        },
        error => {
          console.log(error);
        });
  }

  continue(){
    // console.log('hide...');
    this.playerService.playTrack(this.song);
  }

  addUserAdvertisement(user: string, advrt: string){
    this.apiService.userAdvertisement(user, advrt).subscribe(value => {
      // console.log();
    }, error => {
      console.log(error);
    });
  }

  updatePriceTrack(track: string, advrt: string){
    this.apiService.updatePriceTrack(track, advrt).pipe(first())
      .subscribe(
        data => {
          console.log('price updated !!!!');
        },
        error => {
          console.log(error);
        });
  }

}
