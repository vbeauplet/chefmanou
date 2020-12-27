import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TogglerComponent } from '../toggler/toggler.component';

@Component({
  selector: 'button-toggler',
  templateUrl: './button-toggler.component.html',
  styleUrls: ['./button-toggler.component.scss']
})
export class ButtonTogglerComponent extends TogglerComponent implements OnInit {

  /**
   * Button shape: 'round' or 'square'. Default value is 'round'
   */
  @Input() shape: string = 'round';

  /**
   * Event that is raised when toggler is toggled on
   */
  @Output() toggleOn: EventEmitter<any> = new EventEmitter();
  
  /**
   * Event that is raised when toggler is toggled off
   */
  @Output() toggleOff: EventEmitter<any> = new EventEmitter();
  
  /**
   * Only if synchrone
   * Event that is raised when toggler is toggled on and confirmed back by intial value change
   */
  @Output() toggleOnConfirmed: EventEmitter<any> = new EventEmitter();
  
  /**
   * Only if synchrone
   * Event that is raised when toggler is toggled off and confirmed back by intial value change
   */
  @Output() toggleOffConfirmed: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

}
