import { Injectable } from '@angular/core';
import {HttpClient, HttpEvent, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ArtistModule} from '../../artists/artist.module';
import {JwtResponse} from './jwt-response';
import {AuthLoginInfo} from './auth-login-info';
import {SignUpInfo} from './signup-info';
import {stringify} from 'querystring';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loginUrl = 'http://localhost:8080/auth/login';
  private signupUrl = 'http://localhost:8080/auth/register';
  private signupUrlNoImg = 'http://localhost:8080/auth/register/noimg';

  constructor(private http: HttpClient) { }

  attemptAuth(credentials: AuthLoginInfo): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(this.loginUrl, credentials);
  }

  // signUp(user: ArtistModule): Observable<string> {
  //   return this.http.post<string>(this.signupUrl, user, httpOptions);
  // }

  signUp(user: ArtistModule, file: File): Observable<string> {
    let formdata: FormData = new FormData();

    formdata.append('lastname', user.lastname);
    formdata.append('firstname', user.firstname);
    formdata.append('birthdate', user.birthdate);
    formdata.append('city', user.city);
    formdata.append('gender', user.gender);
    formdata.append('address', user.address);
    formdata.append('username', user.username);
    formdata.append('password', user.password);
    formdata.append('email', user.email);

    if(file === null){
      return this.http.post<string>(this.signupUrlNoImg, formdata);
    }else {
      formdata.append('profile', file);
      return this.http.post<string>(this.signupUrl, formdata);
    }
  }

}
