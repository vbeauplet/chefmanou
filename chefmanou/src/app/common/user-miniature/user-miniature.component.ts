import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { MiniatureComponent } from '../miniature/miniature.component';

@Component({
  selector: 'user-miniature',
  host: { 
      '[class]' : 'this.size + " " + this.miniatureStyle + " clickable hor-space-between row-dir container-block"',
      '[class.margined]' : 'this.margined',
    },
  templateUrl: './user-miniature.component.html',
  styleUrls: [
    './user-miniature.component.scss',
    '../miniature/miniature.component.scss']
})
export class UserMiniatureComponent extends MiniatureComponent implements OnInit {

  /**
   * User input, mandatory
   */
  @Input() user: User;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
