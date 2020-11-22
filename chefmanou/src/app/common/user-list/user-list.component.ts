import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../model/user.model';

@Component({
  selector: 'user-list',
  host: {'class' : 'full col-dir hor-center flex-block'},
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  /**
   * Tells if list is being loaded
   */
  @Input() isLoading: boolean = false;
  
  /**
   * List of users to be displayed
   */
  @Input() users: User[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
