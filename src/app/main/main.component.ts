import { Component, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { Users } from '../users';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
declare var QB: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  usersList : any = [];
  selectedUser: any;
  notificationObj :any;
  public endpoints:any = 
    {
      "api_endpoint": "https://api.quickblox.com",
      "chat_endpoint": "chat.quickblox.com",
      "turnserver_endpoint": "turnserver.quickblox.com"
  };
  public CREDENTIALS:any = {
    appId: 74282,
    authKey: 'ENFggvVB2trchUa',
    authSecret: 'MQTsDR6cFLWHdOq'
  };
  public user : any = {
    name: 'gregalla',
    login: 'gregalla',
    pass: 'innominds@123',
    id: '',
    token : ''
  };
  constructor(
    private router: Router,
    private route : ActivatedRoute ,
    public userService: UsersService
  ) { 
    this.user.token = route.snapshot.params['token'];
  }
  receiveMessage = (userId,msg) => {
    this.notificationObj = {
      from : userId,
      body: msg.body
    }
    this.userService._notificationObj.emit(this.notificationObj);
  }
  ngOnInit() {
    let token = this.route.snapshot.params.token;
    let id = this.route.snapshot.params.id;
    let params = {
      userId  : id,
      password : this.user.pass
    };
    this.userService.getUsers(token, id)
        .subscribe((data:any) => {
          this.usersList = data.items;
          QB.init(this.CREDENTIALS.appId, this.CREDENTIALS.authKey, this.CREDENTIALS.authSecret, this.endpoints );
          QB.chat.connect(params, (err, roster) => {
          if (err) {
              console.log(err);
          } else { ;
            QB.chat.onMessageListener = this.receiveMessage;    
          }
          });
        });
    this.userService.userSelected
        .subscribe((user: any) => {
          this.selectedUser = user;
        });
  }
}
