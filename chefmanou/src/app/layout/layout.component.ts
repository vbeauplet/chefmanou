import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  
  /**
   * Tells if menu shall be displayed (unwrapped)
   */
  public displayMenu : boolean = false;
  
  constructor() { }

  ngOnInit() { 
    
  }
  
  public onOnHamburger(){
    this.displayMenu = true;
  }
  
  public onOffHamburger(){
    this.displayMenu = false;
  }
  
  /*
   * Detect click ouside layout
   */
   
  private wasClickInside: boolean = false;
  
  @HostListener('click')
  clickInside() {
    this.wasClickInside = true;
  }
  
  @HostListener('document:click')
  clickout() {
    if (!this.wasClickInside) {
      // Action to perform when click outside
      this.displayMenu = false;
    }
    this.wasClickInside = false;
  }

}
