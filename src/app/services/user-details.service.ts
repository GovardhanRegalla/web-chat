import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserDetailService {
    userSelected = new EventEmitter<any>();
    chatHistory = new EventEmitter<any>();
    receivedNotificationObj = new EventEmitter<any>();
    receivedCurrentUserChat = new EventEmitter<any>();
    constructor(
        private http: HttpClient
    ){
    }
    getLoggedInUserDetails(url,token){
        return this.http.get(url,{
          headers: {'QB-Token': token,'content-type':'application/json'}
        });
    }
    getUsersList(token, url){
        return this.http.get(url,{
            headers: {'QB-Token': token,'content-type':'application/json'}
        });
    }
    getChatId(url, token){
        return this.http.get(url,{
          headers: {'QB-Token': token,'content-type':'application/json'}
        })
    }
    getChatHistoryContent(url, token){
        return this.http.get(url,{
          headers: {'QB-Token': token,'content-type':'application/json'}
        })
    }
}

