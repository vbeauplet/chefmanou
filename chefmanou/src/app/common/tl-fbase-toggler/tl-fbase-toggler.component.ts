import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { TogglerComponent } from '../toggler/toggler.component';
import * as firebase from 'firebase';

@Component({
  selector: 'tl-fbase-toggler',
  templateUrl: '../toggler/toggler.component.html',
  styleUrls: ['../toggler/toggler.component.scss']
})
export class TlFbaseTogglerComponent extends TogglerComponent implements OnInit, OnChanges {

  /**
   * Target SDB Document Node for the property to be updated on server.
   * Can be let undocumented if update on server is not wanted
   */
  @Input() sdbDocNode: string = '';
  
  /**
   * Target SDB property to be updated on server, for the provided document node.
   * Can be let undocumented if update on server is not wanted
   */
  @Input() sdbProperty: string = '';

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

  ngOnChanges(): void {
    if(this.synchrone){
      // Reset target state from initial value after a given timeout
      setTimeout(() => {
        super.ngOnInit();
      }, 1000);
    }
  }
  
  /**
   * Handles click on toggler
   */
  public onClickToggler(){
    // Toggle target state
    this.targetState = !this.targetState;
    
    // Emit toggle event
    (this.targetState)?this.toggleOn.next():this.toggleOff.next();
    
    // Tell it is loading
    this.togglerLoadingStatus = 0;
    
    // Update property on server
    let sdbPropertyUpdate = {};
    sdbPropertyUpdate[this.sdbProperty] = this.targetState;
    setTimeout(() => {
      let that = this;
      firebase.firestore().doc(this.sdbDocNode).update(sdbPropertyUpdate)
        .then(function() {
            // Continue and set miniature URL
            that.togglerLoadingStatus = 1;
            
            // Emit the success event
            (that.targetState)?that.toggleOnConfirmed.next():that.toggleOffConfirmed.next();
            
            // Release status after the 3 second validation time span
            setTimeout(() => {
              that.togglerLoadingStatus = -1;
            }, 3000);
          })
        .catch(function(error) {
            console.log(error);
          
            // If any, notify failure to user
            that.togglerLoadingStatus = 2;
            
            // Reset toggler
            that.targetState = !that.targetState;
            
            // Release status after the 3 second validation time span
            setTimeout(() => {
              that.togglerLoadingStatus = -1;
            }, 3000);
          });
     },500);

    
  }

}
