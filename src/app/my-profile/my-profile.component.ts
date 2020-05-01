import {AfterViewInit, Component, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ApiService} from '../service/api/api.service';
import {ArtistModule} from '../artists/artist.module';
import {Observable} from 'rxjs';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {TrackModule} from '../tracks/track.module';
import {Router} from '@angular/router';
import {PlayerService} from '../service/player/player.service';
import {first} from 'rxjs/operators';
import {TokenStorageService} from '../service/auth/token-storage.service';
import {AlbumModule} from '../albums/album.module';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpEventType, HttpResponse} from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  isLinear = false;
  form: FormGroup;
  form2: FormGroup;
  etape1: FormGroup;
  etape2: FormGroup;

  selectedFiles: FileList;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  updated: boolean=false;
  fileValide: boolean=true;

  showAlbums: boolean=true;
  showTracks: boolean=false;
  user: ArtistModule = new ArtistModule();
  selectedAlbum: AlbumModule = new AlbumModule();
  albums: Observable<string[]>;

  dataSource: MatTableDataSource<TrackModule>;
  displayedColumns2: string[] = ['trackNumber', 'trackTitle', 'time', 'releaseDate', 'views', 'rating'];
  authority: string = "";
  private roles: string[];
  mytracks: TrackModule[] = [];
  @ViewChild(MatPaginator) private paginator: MatPaginator;
  @ViewChild(MatSort) private sort: MatSort;
  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router, private playerService: PlayerService, private tokenStorage: TokenStorageService) {
    this.dataSource = new MatTableDataSource(this.mytracks);
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    $('.icon').popup();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.etape1 = this.formBuilder.group({
      lastname: ['', Validators.required],
      firstname: ['', Validators.required],
      birthdate: ['', Validators.required],
      address: ['', Validators.required],
      gender: ['', Validators.required],
      city: ['', Validators.required]
    });
    this.etape2 = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      username: ['', Validators.required],
      password: ['', Validators.required],
      confirmpassword: ['', Validators.required]
    });
    this.form = this.formBuilder.group({
      etape1 : this.etape1,
      etape2 : this.etape2,
    });
    this.form2 = this.formBuilder.group({
      nickname: ['', Validators.required]
    });

    this.roles = this.tokenStorage.getAuthorities();
    this.roles.every(role => {
      if (role === 'ARTIST') {
        this.authority = 'artist';
        return false;
      }
      this.authority = 'user';
      return true;
    });
    this.userConnected();
    this.myAlbums();
    //this.mySingles();
  }

  getErrorEmail() {
    return this.etape2.get('email').hasError('pattern') ? 'entrer un email valide':'';
  }

  userConnected(){
    this.apiService.getArtistById(localStorage.getItem('CONNECTED_ID')).subscribe(value => {
      this.user = value;
      this.initProfile();
    }, error => {
      console.log(error);
    });
  }

  myAlbums(){
    this.albums=this.apiService.getMyAlbums(localStorage.getItem('CONNECTED_ID'));
  }

  myTracks(album: AlbumModule){
    this.selectedAlbum=album;
    this.apiService.getTracksByAlbum(album.id+"").subscribe(value => {
      this.mytracks = value;
      this.dataSource = new MatTableDataSource(this.mytracks);
    },
      error => console.error(error)
    );
    this.showAlbums=false;
    this.showTracks=true;
  }

  applyFilter(filterValue: string) {

    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  playTrackT(track) {
    localStorage.removeItem('idSPlayer');
    localStorage.removeItem('idTPlayer');
    localStorage.removeItem('idAPlayer');
    localStorage.removeItem('titlePlayer');
    localStorage.removeItem('artistPlayer');
    localStorage.removeItem('albumPlayer');
    localStorage.setItem('idSPlayer', '');
    localStorage.setItem('idAPlayer', this.user.id+'');
    localStorage.setItem('idTPlayer', this.selectedAlbum.id+'');
    localStorage.setItem('titlePlayer', track.trackTitle);
    localStorage.setItem('artistPlayer', this.user.nickname);
    localStorage.setItem('albumPlayer', this.selectedAlbum.albumName);
    this.playerService.playTrack(track.id);
    this.updateViews(track);
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

  backToAlbums(){
    this.showTracks=false;
    this.showAlbums=true;
  }

  initProfile(){
    //console.log('init... :');
    this.etape1.get('lastname').setValue(this.user.lastname);
    this.etape1.get('firstname').setValue(this.user.firstname);
    this.etape1.get('birthdate').setValue(this.user.birthdate);
    this.etape1.get('city').setValue(this.user.city);
    this.etape1.get('gender').setValue(this.user.gender);
    this.etape1.get('address').setValue(this.user.address);
    this.etape2.get('username').setValue(this.user.username);
    this.etape2.get('email').setValue(this.user.email);
  }

  modifier(){
    let user: ArtistModule = new ArtistModule();
    user.lastname=this.etape1.get('lastname').value;
    user.firstname=this.etape1.get('firstname').value;
    user.birthdate=this.etape1.get('birthdate').value;
    user.city=this.etape1.get('city').value;
    user.gender=this.etape1.get('gender').value;
    user.address=this.etape1.get('address').value;
    user.username=this.etape2.get('username').value;
    user.password=this.etape2.get('password').value;
    user.email=this.etape2.get('email').value;
    this.apiService.updateUser(user).subscribe(value => {
      this.updated=true;
      this.form.reset();
      this.userConnected();
    }, error => {
      this.updated=false;
      console.log(error);
    });
  }

  selectFile(event) {
    const test = event.target.files.item(0);
    if (test !== null) {
      if (test.type.match('image.*')) {
        this.selectedFiles = event.target.files;
        this.fileValide = true;
      } else {
        this.fileValide = false;
      }
    } else {
      this.fileValide = true;
    }

  }

  upload(){
    this.progress.percentage = 0;
    this.currentFileUpload = this.selectedFiles.item(0);
    console.log('start !!!');
    this.apiService.updateUserImage(this.currentFileUpload).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        console.log('File is completely uploaded!');
        window.location.reload(false);
        // this.ngOnInit();
        // this.router.navigateByUrl('/profile', {skipLocationChange: true}).then(()=>
        //   this.router.navigate(["profile"]));
      }
    }, error => {
      console.log(error)
    });
  }

  upgrade(){
    this.apiService.upgradeToArtist(this.form2.get('nickname').value).subscribe(value => {
      console.log('upgrade !');
      //window.location.replace('home');
      this.tokenStorage.signOut();
      localStorage.clear();
      window.location.replace('auth/login');
    }, error => {
      console.log(error);
    });
  }
}
