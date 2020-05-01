import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
// import {MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {fromEvent} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ApiService} from './service/api/api.service';
import {ArtistModule} from './artists/artist.module';
import {TokenStorageService} from './service/auth/token-storage.service';
import {stringify} from 'querystring';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit,AfterViewInit {
  @ViewChild('searchBox') searchInput: ElementRef;
  // (keyup)="search(searchBox.value)"
  private roles: string[];
  authority: string = "";
  le_nom: string ="";
  connected: ArtistModule;
  hideResult:boolean = true;
  searchResults: Array<any> = [];
  currentDate = new Date();

  constructor(private apiService: ApiService, private router: Router, private tokenStorage: TokenStorageService) {}

  ngOnInit(){
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getAuthorities();
      this.le_nom = this.tokenStorage.getUsername();
      this.apiService.getArtistByUsername(this.le_nom).subscribe(value => {
        this.connected = value;
        localStorage.setItem('CONNECTED_ID', this.connected.id+"");
      });
      this.roles.every(role => {
        if (role === 'ARTIST') {
          this.authority = 'artist';
          localStorage.setItem('authority', this.authority);
          return false;
        }
        this.authority = 'user';
        localStorage.setItem('authority', this.authority);
        return true;
      });
    }
  }

  ngAfterViewInit(){
    console.log('ngAfter');
    let buttonStream$=fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(debounceTime(500))
      .subscribe(()=>{
        console.log('ngAfter search');
        console.log('test2 '+this.searchInput.nativeElement.value);
        this.search(this.searchInput.nativeElement.value);
      }, error1 => {
        console.log('ngAfter hide');
        this.hideResult=true;
      });
  }

  onResultClick(){
    // this.goToAlbums(artist);
    // console.log('redirect :');
    this.hideResult=true;
    this.searchInput.nativeElement.value='';
  }

  search(param) {
    if(param.localeCompare('') === 1){
      this.apiService.searchArtists(param).subscribe(
        data => {
          this.hideResult=false;
          this.searchResults = data;
          //console.log(data);
        },
        err => console.log(err)
      );
    }
    else {
      console.log('vide');
      this.hideResult=true;
      //console.log('value1 '+this.searchResults.length);
      //this.searchInput.nativeElement.value = '';
      //this.searchResults.length = 0;
      //console.log('value2 '+this.searchResults.length);
    }
  }

  // goToAlbums(artist: ArtistModule){
  //   localStorage.removeItem("artistID");
  //   localStorage.setItem("artistID", artist.id.toString());
  //   this.router.navigate([artist.id, artist.nickname]);
  //   this.hideResult=true;
  //   this.searchInput.nativeElement.value='';
  // }

  goHome(): void {
    this.router.navigate(['home']);
  };

  goLogout() {
    this.tokenStorage.signOut();
    localStorage.clear();
    window.location.replace('home');
  }
}
