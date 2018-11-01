import { Component, OnInit,Input,OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { UserDetailService } from '../../services/user-details.service';


@Component({
  selector: 'users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  userData : any;
  loggedInUser : any;
  userLoginDetails : any;
  selectedUser : any;
  receivedChatObj : any;
  userLastmsg : any = '';
  notifiedChatObj : any;
  @Input() users: any;
  //users: Users[] = [];
  constructor(
    private userDetailService: UserDetailService
  ) { }
  
  chatwithSelectedUser(user){
    var list = document.getElementsByClassName('active');
    if(list.length > 0){
    list[0].classList.remove('active');
    }
    var item = document.getElementById(user.user.id);
    item.className = 'active';
    this.selectedUser = user;
    this.userDetailService.userSelected.emit(user);
  }
  
  ngOnChanges(changes: SimpleChanges) {
    const list: SimpleChange = changes.users;
    if(list.currentValue !== list.previousValue && list.currentValue.length >0){
      let selected = list.currentValue[0];
      this.selectedUser = selected;
      this.userDetailService.userSelected.emit(selected);
    }
  }
  // We are getting the required details for the user list content on loading the page
  ngOnInit() {
    this.userDetailService.chatHistory
        .subscribe((history: any) => {
          this.userLastmsg = history[history.length-1].message;
        });
    this.userDetailService.receivedNotificationObj
        .subscribe((data) => {
            this.notifiedChatObj = data;
            if( this.selectedUser == undefined || this.selectedUser.user.id !== data.from){
              var d = document.getElementById(data.from);
              d.className += " notify-active";
            }else{
              this.userDetailService.receivedCurrentUserChat.emit(this.notifiedChatObj);
            }
        })
  }
}
