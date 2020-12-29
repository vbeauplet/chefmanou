import { Component, OnInit, Input, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-hamburger',
  templateUrl: './tl-hamburger.component.html',
  styleUrls: ['./tl-hamburger.component.scss']
})
export class TlHamburgerComponent implements OnInit {

  /**
   * Gives the hamburger status: false if off, true if on (clicked)
   */
  @Input() status: boolean = false;
  
  /**
   * Output events
   */
  @Output() on: EventEmitter<any> = new EventEmitter();
  @Output() off: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
    // Emit on/off event at init stage because status is an input
    this.emit();
  }
  
  /**
   * On click on the hamburger, change its status and emit corresponding event (onOn or OnOff events)
   */
  public onClickHamburger(){
    this.status = !this.status;
    
    // Emit event
    this.emit();
  }
  
  /**
   * Emit On/Off event corresponding to status
   */
  private emit(){
    if(this.status){
      this.on.emit(null);
    }
    else{
      this.off.emit(null);
    }
  }

}
