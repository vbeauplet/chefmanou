import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ITlStep } from '../../interfaces/tl-step.interface';

@Component({
  selector: 'tl-stepper',
  host: { 
      '[class]' : 'this.size + " row-dir vert-up flex-block"'
  },
  templateUrl: './tl-stepper.component.html',
  styleUrls: ['./tl-stepper.component.scss']
})
export class TlStepperComponent implements OnInit {
   
  /**
   * Stepper initial steps
   * Use of an input property setter because if the stepper is synchrone, it shall react to any change on this input
   * If synchrone, any change on initial state shall be applied on component-binded steps
   */
  private _initialSteps: ITlStep[] = [];  
  @Input() set initialSteps(value: ITlStep[]) {
     this._initialSteps = value;
     if(this.synchrone){
       this.refreshStepsFromInitialValue();
     }
  }
  
  /**
   * Stepper initial current step index
   * Use of an input property setter because if the stepper is synchrone, it shall react to any change on this input
   * If synchrone, any change on initial current step index shall change component binadable currrent step
   */
  private _initialCurrentStepIndex: number = 0;  
  @Input() set initialCurrentStepIndex(value: number) {
     this._initialCurrentStepIndex = value;
     if(this.synchrone){
      this.refreshCurrentStepIndexFromInitialValue();
     }
  }
  
  /**
   * Size of the stepper
   * 'full' by default
   */
  @Input() size: string = 'full';
  
  /**
   * SIze, in px, of the stepper dots
   */
  @Input() dotSize: number = 50;
  
  /**
   * Style of the stepper dots. May be outlined, neumorphic, transparent, glassmorphic
   */
  @Input() style: string = 'outlined';
  
  /**
   * Tells if stepper shall be active, which means clicking on it can modify process state
   * True by default
   */
  @Input() active: boolean = true;
  
  /**
   * Tells a 'next' button shall be displayed
   * True by default
   */
  @Input() showNextButton: boolean = true;
  
  /**
   * If the synchrone flag is set to true, component reacts accordingly to any change of the initial step list
   * False by default
   */
  @Input() synchrone: boolean = false;

  /**
   * Event that is raised when current step is changed
   * Carried payload is the name of the new current step
   */
  @Output() changeStep: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Event that is raised when a step is completed
   * Carried payload is the name of the completed step
   */
  @Output() completeStep: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Stepper bindable list of steps
   */
  public steps: ITlStep[] = [];
  
  /**
   * Stepper bindable curent step index
   */
  public currentStepIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.refreshStepsFromInitialValue();
    this.refreshCurrentStepIndexFromInitialValue();
  }
  
  /**
   * Refreshes bindable steps list from initial steps list
   * Only works if component is synchrone
   */
  public refreshStepsFromInitialValue(){
    // Refresh steps
    this.steps = [...this._initialSteps];
  }
  
  /**
   * Refreshes current step index from initial steps list
   * Only works if component is synchrone
   */
  public refreshCurrentStepIndexFromInitialValue(){
    // Set current step from input
    this.currentStepIndex = this._initialCurrentStepIndex;
    
    // If not already, tell current step is seen
    if(this.steps[this.currentStepIndex].status == undefined || this.steps[this.currentStepIndex].status == 0){
      this.steps[this.currentStepIndex].status = 1;
    } 
  }
  
  /**
   * Go to next step, completing current one
   */
  public next(){
    // Check it is possible
    if(this.steps.length > this.currentStepIndex + 1){
      
      // Change current step status
      this.steps[this.currentStepIndex].status = 2;
      
      // Emit complete event
      this.completeStep.emit(this.steps[this.currentStepIndex].name);
      
      // Reach next step
      this.reachStep(this.currentStepIndex + 1);
    }
    
    else if (this.steps.length == this.currentStepIndex + 1){
      
      // Change current step status
      this.steps[this.currentStepIndex].status = 2;
      
      // Emit complete event
      this.completeStep.emit(this.steps[this.currentStepIndex].name);
      
    }
  }
  
  /**
   * Reaches a particular step of the stepper, without completing current step
   */
  public reachStep(index: number){
      // Change current step
      this.currentStepIndex = index;
      
      // Change new step status if still not seen
      if(this.steps[this.currentStepIndex].status == 0){
        this.steps[this.currentStepIndex].status = 1;
      }
      
      // Emit change step
      this.changeStep.emit(this.steps[this.currentStepIndex].name);
  }
  
  /**
   * Handles click on a step
   */
  public onClickStep(index: number){
    if(this.active){
      this.reachStep(index);
    }
  }

}
