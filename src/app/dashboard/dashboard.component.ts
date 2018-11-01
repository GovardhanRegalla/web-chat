import { Component, OnInit } from '@angular/core';
import { UserDetailService } from '../services/user-details.service';
import { APP_END_POINTS, APP_CREDENTIALS,urlsList } from "../constants";

declare var QB: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit { 
  _usersList : any = [];
  _userDetails : any = {};
  _loginParams : any;
  _loginSessonData : any; 
  _chatHistory: any = [];
  _loggedInUSerId : any;
  _selectedUser : any = {
    user: {
      full_name :''
    }
  };
  _recievedMsg : any ;

  public endpoints:any = APP_END_POINTS;
  public CREDENTIALS:any = APP_CREDENTIALS;
  public urls = urlsList;
  public user : any = {
    token : ''
  };
  constructor(
    public UserDetailService: UserDetailService
  ) { 
  }
  MessagesFromUsers = (userId,msg) => {
    this._recievedMsg = {
      from : userId,
      body: msg.body
    }
    this.UserDetailService.receivedNotificationObj.emit(this._recievedMsg);
  }
  sendMessage(userId, value) {
    QB.chat.send(userId, {
      type:'chat',
      body: value.form.value.message,
      extension: {save_to_history: 1}
    });
    this._chatHistory.push({'message': value.form.value.message,'sender_id': this._userDetails.id });
  }
  updateScroll(){
    var element = document.getElementById("chat-parent");
    element.scrollTop = element.scrollHeight;
  }
  fnGetChatHistory(from, to, token){
    var url = this.endpoints.api_endpoint + '//chat/Dialog.json?occupants_ids=';
    if(from > to)
      {    
          let occupants = to + "," + from;
          url += occupants;
      }
      else{
          let occupants = from + "," + to;
          url += occupants;
      }
      this.UserDetailService.getChatId(url, token)
      .subscribe((data: any) => {
        if(data.items.length > 0){
          let chatdialId = data.items[0]._id;
          let url = this.endpoints.api_endpoint + "/chat/Message.json?chat_dialog_id="+ chatdialId;
          this.UserDetailService.getChatHistoryContent(url,token)
            .subscribe((data: any) => {
            this._chatHistory = data.items;
            setTimeout(this.updateScroll,1000);
            this.UserDetailService.chatHistory.emit(this._chatHistory);
          });
        }else{
          this._chatHistory = [];
        }
      });
  }

  ngOnInit(){
    this._loginParams = JSON.parse(sessionStorage.getItem('loginDetails'));
    this._loginSessonData = JSON.parse(sessionStorage.getItem('sessionDetails'));
    let token = this._loginSessonData.token;
    let id = this._loginSessonData.user_id;
    this._loggedInUSerId = id;
    let params = {
      userId  : id,
      password : this._loginParams.password
    };
    let userDetailsUrl = this.urls.userdetails+ this._loginParams.username;
    this.UserDetailService.getLoggedInUserDetails(userDetailsUrl,token)
      .subscribe((data:any) => {
        this._userDetails = data.user;
      });
    let urlListUrl = this.urls.usersList+ id;
    this.UserDetailService.getUsersList(token, urlListUrl)
      .subscribe((data:any) => {
        this._usersList = data.items;
        QB.init(this.CREDENTIALS.appId, this.CREDENTIALS.authKey, this.CREDENTIALS.authSecret, this.endpoints );
        QB.chat.connect(params, (err, roster) => {
        if (err) {
            console.log(err);
        } else { ;
          QB.chat.onMessageListener = this.MessagesFromUsers;    
        }
        });
    });
    this.UserDetailService.userSelected
        .subscribe((user: any) => {
          this._selectedUser = user;
          this._chatHistory = [];
          this.fnGetChatHistory(id, user.user.id,token);
        });
        this.UserDetailService.receivedCurrentUserChat
        .subscribe((object) => {
          this._chatHistory.push({'message': object.body});
          setTimeout(this.updateScroll,1000);
        })
  }
}
