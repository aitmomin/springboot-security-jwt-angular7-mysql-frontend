import {Component, OnInit, ViewChild} from '@angular/core';
import {PlayerService} from '../service/player/player.service';
import {TrackModule} from '../tracks/track.module';
import {ApiService} from '../service/api/api.service';
import {ArtistModule} from '../artists/artist.module';
import {Router} from '@angular/router';
import {TokenStorageService} from '../service/auth/token-storage.service';
declare var $: any;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @ViewChild('player')
  playerRef;
  player: any;
  //single: TrackModule=new TrackModule();
  //artist: ArtistModule=new ArtistModule();
  show: boolean=false;
  idS: string='';
  idT: string='';
  idT2: string='';
  idA: string='';
  title: string='';
  artist: string='';
  album: string='';
  connected: boolean=false;
  liked: boolean=true;
  disliked: boolean=false;
  isAlreadyLiked: boolean;

  constructor(private playerSer: PlayerService, private api: ApiService, private router: Router, private tokenStorage: TokenStorageService) {
    playerSer.playTrack$.subscribe(previewUrl => {
      this.playTrack(previewUrl);
    });
    playerSer.pauseTrack$.subscribe(() => {
      this.pauseTrack();
    });
  }

  ngOnInit() {
    $('.ui.rating').rating();
    $('.ui.rating').popup();
    this.player = this.playerRef.nativeElement;
  }

  playTrack(previewUrl) {
    this.player.src = previewUrl;
    this.player.play().catch(function() {
      // console.log('hi here --**==')
    });
    if(this.tokenStorage.getToken()){
      this.connected=true;
    }
    this.idS=localStorage.getItem('idSPlayer');
    this.idT=localStorage.getItem('idTPlayer');
    this.idT2=localStorage.getItem('idTPlayer2');
    this.idA=localStorage.getItem('idAPlayer');
    this.title=localStorage.getItem('titlePlayer');
    this.artist=localStorage.getItem('artistPlayer');
    this.album=localStorage.getItem('albumPlayer');
    this.liked=true;
    this.disliked=false;
    if (this.tokenStorage.getToken()){
      if(this.idS !== ''){
        console.log('single : '+this.idS)
        this.api.alreadyLiked(localStorage.getItem('CONNECTED_ID'), this.idS).subscribe(value => {
          this.isAlreadyLiked = value;
        }, error => {
          console.log(error);
        });
      }else {
        this.api.alreadyLiked(localStorage.getItem('CONNECTED_ID'), this.idT2).subscribe(value => {
          this.isAlreadyLiked = value;
        }, error => {
          console.log(error);
        });
      }
    }
  }

  goToArtist(id, artist){
    this.router.navigate([id, artist, 'albums']);
  }

  pauseTrack() {
    this.player.pause();
  }

  playerEnded() {
    this.playerSer.trackEnded();
  }

  like() {
    if (this.idS !== ''){
      this.api.like(localStorage.getItem('CONNECTED_ID'), this.idS).subscribe(value => {
        this.disliked=true;
        this.liked=false;
        console.log('liked...');
      });
    }else {
      this.api.like(localStorage.getItem('CONNECTED_ID'), this.idT2).subscribe(value => {
        this.disliked=true;
        this.liked=false;
        console.log('liked...');
      });
    }
  }

  dislike() {
    if (this.idS !== ''){
      this.api.dislike(localStorage.getItem('CONNECTED_ID'), this.idS).subscribe(value => {
        this.liked=true;
        this.disliked=false;
        this.isAlreadyLiked=false;
        console.log('disliked...');
      }, error => {
        console.log(error);
      });
    }else {
      this.api.dislike(localStorage.getItem('CONNECTED_ID'), this.idT2).subscribe(value => {
        this.liked=true;
        this.disliked=false;
        this.isAlreadyLiked=false;
        console.log('disliked...');
      });
    }
  }

}
