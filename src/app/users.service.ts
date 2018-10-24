import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of} from 'rxjs';

import { Users } from './users';
import { USERS } from './mock-users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  _session: any;
  _loginDetails : any;
  userSelected = new EventEmitter<any>();
  loggedInUserId = new EventEmitter<any>();
  _notificationObj = new EventEmitter<any>();
  _receivedChatObj = new EventEmitter<any>();

  constructor(
    private http: HttpClient
  ) { }
  setsession(value){
    this._session = value;
  }

  getsession(){
      return this._session;
  }
  setLoginDetails(obj){
    this._loginDetails = obj;
  }
  getLoginDetails(){
    return this._loginDetails;
  }
  getUsersList(): Observable<Users[]> {
    return of(USERS);
  }
  getLoggedInUserDetails(uname,token){
    return this.http.get("https://api.quickblox.com/users/by_login.json?login="+uname,{
      headers: {'QB-Token': token,'content-type':'application/json'}
    });
  }
  getUsers(token , id){
    return this.http.get("https://api.quickblox.com/users.json?filter[]=number+id+ne+"+id,{
      headers: {'QB-Token': token,'content-type':'application/json'}
    });
  }
  getChatId(url, token){
    return this.http.get(url,{
      headers: {'QB-Token': token,'content-type':'application/json'}
    })
  }
  getChatHistory(url, token){
    return this.http.get(url,{
      headers: {'QB-Token': token,'content-type':'application/json'}
    })
  }
}
