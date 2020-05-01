import {Component, OnInit, ViewChild} from '@angular/core';
import {Advertisement, ApiService} from '../service/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {ArtistModule} from '../artists/artist.module';
import {AlbumModule} from './album.module';
import {HttpEventType, HttpResponse} from '@angular/common/http';
import {PlayerService} from '../service/player/player.service';
import {TrackModule} from '../tracks/track.module';
import {first, single} from 'rxjs/operators';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {stringify} from 'querystring';
// declare var jquery: any;
// declare var $ :any;

@Component({
  selector: 'app-albums',
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.scss']
})
export class AlbumsComponent implements OnInit {

  artistID: string;
  selectedArtist: ArtistModule = new ArtistModule();
  albums: Observable<string[]>;
  singles: TrackModule[];
  dataSource: MatTableDataSource<TrackModule>;
  displayedColumns: string[] = ['trackImageURL', 'trackNumber', 'trackTitle', 'time', 'releaseDate', 'views', 'rating'];
  countAlbums: number;
  countSingles: number;

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  adv: Advertisement = new  Advertisement();
  song: number;

  constructor(private apiService: ApiService, private router: Router, private playerService: PlayerService, private route: ActivatedRoute) {
    this.dataSource = new MatTableDataSource();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // this.artistID = localStorage.getItem("artistID");
    // if(!this.artistID) {
    //   alert("Invalid action.");
    //   this.router.navigate(['artists']);
    //   return;
    // }
    this.route.params.subscribe(param =>{
      this.artistID=param.id;
      // localStorage.removeItem("artistID");
      // localStorage.setItem("artistID", this.artistID.toString());
      this.apiService.getArtistById(this.artistID).subscribe(value => {
        this.selectedArtist=value;
      });
      this.allAlbums();
      this.apiService.getSinglesByArtist(this.artistID).subscribe(value => {
        // this.dataSource.data = value;
        this.dataSource = new MatTableDataSource(value);
      });
      this.countAll();
    });



    // this.apiService.getArtistById(this.artistID).subscribe(value => {
    //   this.selectedArtist=value;
    // });
    // this.allAlbums();
    // this.allSingles();
  }

  allAlbums(){
    this.albums=this.apiService.getAlbumsByArtist(this.artistID);
  }

  // allSingles(){
  //   this.singles=this.apiService.getSinglesByArtist(this.artistID);
  // }

  // goToTracks(album: AlbumModule){
  //   localStorage.removeItem("albumID");
  //   localStorage.setItem("albumID", album.id.toString());
  //   this.router.navigate(['tracks', album.id, album.albumName]);
  // }

  countAll(){
    this.apiService.countAlbumsByUser(this.artistID).subscribe(value => {
      this.countAlbums=value;
    }, error => {
      console.log(error);
    });
    this.apiService.countSinglesByUser(this.artistID).subscribe(value => {
      this.countSingles=value;
    }, error => {
      console.log(error);
    });
  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  playTrack(single) {
    localStorage.removeItem('idTPlayer');
    localStorage.removeItem('idTPlayer2');
    localStorage.removeItem('idAPlayer');
    localStorage.removeItem('albumPlayer');
    localStorage.removeItem('idSPlayer');
    localStorage.removeItem('titlePlayer');
    localStorage.removeItem('artistPlayer');
    localStorage.setItem('idTPlayer', '');
    localStorage.setItem('idTPlayer2', '');
    localStorage.setItem('albumPlayer', '');
    localStorage.setItem('idAPlayer', this.selectedArtist.id+'');
    localStorage.setItem('idSPlayer', single.id);
    localStorage.setItem('titlePlayer', single.trackTitle);
    localStorage.setItem('artistPlayer', this.selectedArtist.nickname);
    this.song = single.id;
    this.playerService.playTrack(single.id);
    this.updateViews(single);
    this.apiService.getAdvertisements().subscribe(value => {
      this.playerService.pauseTrack();
      this.adv = value;
    }, error => console.log(error));
  }

  clickLinkAdvertisement(){
    if (localStorage.getItem('CONNECTED_ID')){
      this.addUserAdvertisement(localStorage.getItem('CONNECTED_ID'), this.adv.id+'');
      // this.updatePriceTrack(this.song+'', this.adv.id+'');
      // console.log('add user + update price')
    }
    this.updatePriceTrack(this.song+'', this.adv.id+'');
    this.updateAdvertisement(this.adv.id+'');
    // console.log('update advert count')
  }

  playTrackWhitoutAdvrt(single){
    localStorage.removeItem('idTPlayer');
    localStorage.removeItem('idTPlayer2');
    localStorage.removeItem('idAPlayer');
    localStorage.removeItem('albumPlayer');
    localStorage.removeItem('idSPlayer');
    localStorage.removeItem('titlePlayer');
    localStorage.removeItem('artistPlayer');
    localStorage.setItem('idTPlayer', '');
    localStorage.setItem('idTPlayer2', '');
    localStorage.setItem('albumPlayer', '');
    localStorage.setItem('idAPlayer', this.selectedArtist.id+'');
    localStorage.setItem('idSPlayer', single.id);
    localStorage.setItem('titlePlayer', single.trackTitle);
    localStorage.setItem('artistPlayer', this.selectedArtist.nickname);
    this.playerService.playTrack(single.id);
    this.updateViews(single);
  }

  continue(){
    // console.log('hide...');
    this.playerService.playTrack(this.song);
  }

  updateViews(track: TrackModule){
    this.apiService.updateTrack(track).pipe(first())
      .subscribe(
        data => {
          console.log('updated !!!!');
        },
        error => {
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

  addUserAdvertisement(user: string, advrt: string){
    this.apiService.userAdvertisement(user, advrt).subscribe(value => {
      console.log('insert user advrt');
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
