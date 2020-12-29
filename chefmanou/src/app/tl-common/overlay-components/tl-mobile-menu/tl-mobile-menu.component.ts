import { Component, OnInit, Input } from '@angular/core';

import { TlMenuService } from '../../services/tl-menu.service';
import { ITlMenuItem } from '../../interfaces/tl-menu-item.interface';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-mobile-menu',
  templateUrl: './tl-mobile-menu.component.html',
  styleUrls: ['./tl-mobile-menu.component.scss']
})
export class TlMobileMenuComponent implements OnInit {

  /**
   * Menu items of the mpobile component
   */
  @Input() menuItems: ITlMenuItem[]

  constructor(
    public menuService: TlMenuService
  ) { }

  ngOnInit(): void {
    // Intialize menu service from input menu items
    this.menuService.init(this.menuItems);
  }

}
