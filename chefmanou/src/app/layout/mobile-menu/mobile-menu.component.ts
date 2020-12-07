import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MenuService } from '../services/menu.service';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrls: ['./mobile-menu.component.scss']
})
export class MobileMenuComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public profileService: ProfileService,
    public menuService: MenuService
  ) { }

  ngOnInit(): void {
  }

}
