import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

export interface IMenuItem {
  label: string,
  icon: string,
  route?: string,
  subItems?: IMenuItem[]
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  /**
   * Subject wrapper for the selected item, so that any change on the selected menu item 
   * can be subscribed and act over from any other depending compoennt or service
   */
  public selectedMenuItemSubject: Subject<IMenuItem> = new Subject<IMenuItem>();

  /**
   * Bindable list of enu items
   */
  public menuItems: IMenuItem[] = [
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

  /**
   * Currently selected menu item
   */
  public selectedMenuItem: IMenuItem = null;
  
  /**
   * Wrapping flag for the application menu
   */
  public isWrapped: boolean = true;
  
  /**
   * Store an unwrapped menu item
   */
  public unwrappedMenuItem: IMenuItem = null;
  
  constructor(
    private router: Router) { 
      // Subscribe to any route update
      router.events.subscribe((router:any) => {
        if(router.url != undefined){
          this.refreshFromRoute(router.url);
        }
      });
      
      // Get initial route
      this.refreshFromRoute(router.url);
  }
  
  /**
   * Refreshes the selected menu items from currently selected route
   */
  public refreshFromRoute(route:string){
    for(let item of this.menuItems){
      if(item.route === route){
        this.selectedMenuItem = item;
        break;
      }
      if(item.subItems != undefined){
        for(let subItem of item.subItems){
          if(subItem.route === route){
            this.selectedMenuItem = subItem;
            break;
          }
        }
      }
    }
  }
  
  
  /**
   * Handles selection of a particular menu item
   */
  public selectMenuItem(menuItem: IMenuItem){
    
    // Emit selected item and emit associated subject
    this.selectedMenuItemSubject.next(this.selectedMenuItem);
    
    // If menu item has an associated route, route it
    if(menuItem.route != undefined){
      
      // Navigate to route      
      this.router.navigate([menuItem.route]);
      
      // Wrap if already unwrapped
      this.unwrappedMenuItem = null;
    }
    
    // If menu item has an associated subMenu, unwrap or wrap it, depending on its status
    if(menuItem.subItems != undefined){
      
      // Unwrap if not yet unwraped
      if(menuItem != this.unwrappedMenuItem){
        this.unwrappedMenuItem = menuItem;
      }
      
      // Wrap if already unwrapped
      else{
        this.unwrappedMenuItem = null;
      }
    }
  }
  
}
