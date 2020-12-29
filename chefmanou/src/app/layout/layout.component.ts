import { Component, OnInit, HostListener } from '@angular/core';

import { Event } from "../model/event.model";

import { ITlMenuItem } from '../tl-common/interfaces/tl-menu-item.interface'
import { AuthService } from '../auth/services/auth.service';

import { TlAlert } from '../tl-common/model/tl-alert.model';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  
  /** 
   * Chef Manou menu items
   */
  public menuItems: ITlMenuItem[] = [
    {
      label:'Home',
      icon:'ï',
      route:'/activity'
    },
    {
      label:'Profil',
      icon:'+',
      route:'/profile'
    },
    {
      label:'Recettes',
      icon:'l',
      route:'/kitchen'
    },
    {
      label:'Plus',
      icon:'ö',
      subItems: [
        {
          label:'Créer une recette',
          icon:']',
          route:'/recipe/new'
        },
        {
          label:'Brouillons',
          icon:'l',
          route:'/draft'
        },
        {
          label:'Historique',
          icon:'t',
          route:'/history'
        },
        {
          label:'Ajouter un cuisinier',
          icon:'-',
          route:'/user/follow'
        }
      ]
    }
  ];
  
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit() { 
    
  }
  
  /**
   * Tells if an alert is an event alert
   */
  public isEventAlert(alert:TlAlert): boolean{
    return alert.customObject != null  && alert.customObject instanceof Event;
  }
  
  public toto(){
    return "bibi";
  }

}
