import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TrackModule} from '../../tracks/track.module';
import {AlbumModule} from '../../albums/album.module';
import {ArtistModule} from '../../artists/artist.module';
import {Playlist} from '../../playlist/playlist.component';

const httpOptions = {
  headers: new HttpHeaders({  'Content-Type': 'application/json'})
};


export class Advertisement {
  id: number;
  logo: any;
  title: string;
  image: any;
  description: string;
  website: string;
  facebook: string;
  twitter: string;
  instagram: string;
  youtube: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  url: string = 'http://localhost:8080/';
  albumsURL: string ='http://localhost:8080/artist/albums';
  tracksURL: string ='http://localhost:8080/album/tracks';
  artistsURL: string ='http://localhost:8080/artists';
  singlesURL: string ='http://localhost:8080/artist/singles';
  uploadTrackURL: string='http://localhost:8080/upload';
  updateViewsURL: string ='http://localhost:8080/update/views';

  constructor(private http: HttpClient) { }


  searchArtists(name: string): Observable<string[]> {
    return this.http.get<string[]>(this.url+'search/artists/'+name);
  }

  getArtists(): Observable<string[]> {
    return this.http.get<string[]>(this.url+'artists');
  }

  getAlbumsByArtist(artist: string): Observable<string[]> {
    return this.http.get<string[]>(this.url+'artist/albums/'+artist);
  }

  getMyAlbums(artist: string): Observable<string[]> {
    return this.http.get<string[]>(this.url+'artist/myAlbums2/'+artist);
  }

  getAlbumsByConnected(artist: string) {
    return this.http.get<AlbumModule[]>(this.url+'artist/myAlbums/'+artist);
  }

  getTracksByAlbum(album: string){
    return this.http.get<TrackModule[]>(this.url+'album/tracks/'+album);
  }

  getSinglesByArtist(artist: string){
    return this.http.get<TrackModule[]>(this.url+'artist/singles/'+artist);
  }

  updateTrack(track: TrackModule){
    if (localStorage.getItem('CONNECTED_ID')){
      let artist = localStorage.getItem('CONNECTED_ID');
      return this.http.post(this.url+'update/views/'+artist+'/'+track.id, { responseType: 'text' });
    } else {
      return this.http.put(this.url+'update/views/'+track.id, null);
    }
  }

  getArtistById(artist: string){
    return this.http.get<ArtistModule>(this.url+'artist/'+artist);
  }

  getTrackById(track: string){
    return this.http.get<TrackModule>(this.url+'track/'+track);
  }

  getArtistByUsername(artist: string){
    return this.http.get<ArtistModule>(this.url+'artist/username/'+artist);
  }

  getAlbumById(album: string){
    return this.http.get<AlbumModule>(this.url+'album/'+album);
  }

  getUsersRandom(){
    return this.http.get<ArtistModule[]>(this.url+'artists/random');
    //return this.http.get(this.url+'artists/random', { responseType: 'text' });
  }

  // getUsersRandom(){
  //   return this.http.get(this.url+'artists/random');
  // }

  createNewAlbum(album: AlbumModule, file: File){
    let formData: FormData=new FormData();
    for (var key in album){
      formData.append(key, album[key]);
    }
    formData.set('photo', file);
    return this.http.post(this.url+'create/new/album', formData, { responseType: 'text' });
  }

  createNewTrack(track: TrackModule, file: File){
    let formData: FormData=new FormData();
    for (var key in track){
      formData.append(key, track[key]);
    }
    formData.set('track', file);
    return this.http.post(this.url+'create/new/track', formData, { responseType: 'text' });
  }

  createNewSingle(single: TrackModule, file: File, file2: File){
    let formData: FormData=new FormData();
    for (var key in single){
      formData.append(key, single[key]);
    }
    formData.set('single', file);
    formData.set('photo', file2);
    return this.http.post(this.url+'create/new/single', formData, { responseType: 'text' });
  }

  countAlbumsByUser(id: string){
    return this.http.get<number>(this.url+'count/albums/'+id);
  }

  countSinglesByUser(id: string){
    return this.http.get<number>(this.url+'count/singles/'+id);
  }

  updateUserImage(file: File): Observable<HttpEvent<{}>> {
    let data: FormData = new FormData();
    data.append('photo', file);
    const req = new HttpRequest('PUT', this.url+'update/user/image/'+localStorage.getItem('CONNECTED_ID'), data, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  updateUser(user: ArtistModule){
    return this.http.put(this.url+'update/user/'+localStorage.getItem('CONNECTED_ID'), user, { responseType: 'text' });
  }

  upgradeToArtist(nickname: string){
    return this.http.put(this.url+'upgrade/'+localStorage.getItem('CONNECTED_ID'), nickname,  { responseType: 'text' });
  }

  like(user: string, track: string) {
    return this.http.post(this.url+'rating/like/'+user+'/'+track, null, { responseType: 'text' });
  }

  dislike(user: string, track: string) {
    return this.http.delete(this.url+'rating/dislike/'+user+'/'+track,{ responseType: 'text' });
  }

  alreadyLiked(user: string, track: string){
    return this.http.get<boolean>(this.url+'already/liked/'+user+'/'+track);
  }

  sumViewsByUserAlbum(id: string){
    return this.http.get<number>(this.url+'sum/album/views/'+id);
  }

  sumRatingByUserAlbum(id: string){
    return this.http.get<number>(this.url+'sum/album/rating/'+id);
  }

  sumViewsByUserTrack(id: string){
    return this.http.get<number>(this.url+'sum/track/views/'+id);
  }

  sumRatingByUserTrack(id: string){
    return this.http.get<number>(this.url+'sum/track/rating/'+id);
  }

  sumPriceByUserTrack(id: string){
    return this.http.get<number>(this.url+'sum/track/price/'+id);
  }

  sumPriceByAlbum(id: string){
    return this.http.get<number>(this.url+'sum/album/price/'+id);
  }

  getStatisticsAlbums(id: string): Observable<AlbumModule[]>{
    return this.http.get<AlbumModule[]>(this.url+'dashboard/albums/'+id);
  }

  getStatisticsSingles(id: string): Observable<TrackModule[]>{
    return this.http.get<TrackModule[]>(this.url+'dashboard/singles/'+id);
  }

  getStatisticsTracks(id: string): Observable<TrackModule[]>{
    return this.http.get<TrackModule[]>(this.url+'dashboard/tracks/'+id);
  }

  getAdvertisements(): Observable<Advertisement>{
    if (localStorage.getItem('CONNECTED_ID') !== null){
      let artist = localStorage.getItem('CONNECTED_ID');
      return this.http.get<Advertisement>(this.url+'random/advertisements/'+artist);
    } else {
      return this.http.get<Advertisement>(this.url+'random/advertisements');
    }
  }

  updateAdvertisement(advrt: string){
    return this.http.put(this.url+'update/advertisement/'+advrt, null);
  }

  userAdvertisement(user: string, advrt: string) {
    return this.http.post(this.url+'user/advertisement/'+user+'/'+advrt, null, { responseType: 'text' });
  }

  updatePriceTrack(track: string, advrt: string){
    return this.http.put(this.url+'update/price/'+track+'/'+advrt, null);
  }

  getPlaylist(id: string): Observable<Playlist[]>{
    return this.http.get<Playlist[]>(this.url+'playlist/'+id);
  }

}
