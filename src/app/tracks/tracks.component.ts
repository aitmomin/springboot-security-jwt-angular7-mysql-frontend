import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {Advertisement, ApiService} from '../service/api/api.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AlbumModule} from '../albums/album.module';
import {ArtistModule} from '../artists/artist.module';
import {TrackModule} from './track.module';
import {first} from 'rxjs/operators';
import {PlayerService} from '../service/player/player.service';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TokenStorageService} from '../service/auth/token-storage.service';


@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss']
})
export class TracksComponent implements OnInit {

  routeParams;
  albumID: string;
  artistID: string;
  selectedAlbum: AlbumModule = new AlbumModule();
  selectedArtist: ArtistModule = new ArtistModule();
  //tracks: TrackModule[];
  dataSource: MatTableDataSource<TrackModule>;
  displayedColumns: string[] = ['trackNumber', 'trackTitle', 'time', 'releaseDate', 'views', 'rating'];

  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;

  adv: Advertisement = new  Advertisement();
  song: number;

  constructor(private token: TokenStorageService,private apiService: ApiService, private router: Router, private playerService: PlayerService, private route: ActivatedRoute) {
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // this.token.signOut();
    // console.log(localStorage.getItem('CONNECTED_ID'));

    // this.albumID = localStorage.getItem("albumID");
    // this.artistID = localStorage.getItem("artistID");
    // if(!this.albumID) {
    //   alert("Invalid action.")
    //   this.router.navigate(['albums']);
    //   return;
    // }
    this.route.params.subscribe(params =>{
      this.artistID=params.id;
      this.albumID=params.id_Album;
      this.routeParams=params;
      this.apiService.getArtistById(this.artistID).subscribe(value => {
        this.selectedArtist=value;
      });
      this.apiService.getAlbumById(this.albumID).subscribe(value => {
        this.selectedAlbum=value;
      });
      this.apiService.getTracksByAlbum(this.albumID).subscribe(value => {
        this.dataSource.data = value;
        //console.table(value);
      });
    });

    // this.apiService.getArtistById(this.artistID).subscribe(value => {
    //   this.selectedArtist=value;
    // });
    // this.apiService.getAlbumById(this.albumID).subscribe(value => {
    //   this.selectedAlbum=value;
    // });
    // this.allTracks();
    //this.dataSource.data = this.tracks;
  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
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

  playTrack(track) {
    localStorage.removeItem('idSPlayer');
    localStorage.removeItem('idTPlayer');
    localStorage.removeItem('idTPlayer2');
    localStorage.removeItem('idAPlayer');
    localStorage.removeItem('titlePlayer');
    localStorage.removeItem('artistPlayer');
    localStorage.removeItem('albumPlayer');
    localStorage.setItem('idSPlayer', '');
    localStorage.setItem('idAPlayer', this.selectedArtist.id+'');
    localStorage.setItem('idTPlayer', this.selectedAlbum.id+'');
    localStorage.setItem('idTPlayer2', track.id);
    localStorage.setItem('titlePlayer', track.trackTitle);
    localStorage.setItem('artistPlayer', this.selectedArtist.nickname);
    localStorage.setItem('albumPlayer', this.selectedAlbum.albumName);
    this.song = track.id;
    this.playerService.playTrack(track.id);
    this.updateViews(track);
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

  playTrackWhitoutAdvrt(track){
    localStorage.removeItem('idSPlayer');
    localStorage.removeItem('idTPlayer');
    localStorage.removeItem('idTPlayer2');
    localStorage.removeItem('idAPlayer');
    localStorage.removeItem('titlePlayer');
    localStorage.removeItem('artistPlayer');
    localStorage.removeItem('albumPlayer');
    localStorage.setItem('idSPlayer', '');
    localStorage.setItem('idAPlayer', this.selectedArtist.id+'');
    localStorage.setItem('idTPlayer', this.selectedAlbum.id+'');
    localStorage.setItem('idTPlayer2', track.id);
    localStorage.setItem('titlePlayer', track.trackTitle);
    localStorage.setItem('artistPlayer', this.selectedArtist.nickname);
    localStorage.setItem('albumPlayer', this.selectedAlbum.albumName);
    this.playerService.playTrack(track.id);
    this.updateViews(track);
  }

  continue(){
    // console.log('hide...');
    this.playerService.playTrack(this.song);
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
