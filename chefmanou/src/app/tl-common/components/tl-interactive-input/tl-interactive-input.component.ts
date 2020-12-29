import { Component, OnInit, Input, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-interactive-input',
  host: {
      '[class]' : 'this.size + " row-dir vert-center flex-block"'
    },
  templateUrl: './tl-interactive-input.component.html',
  styleUrls: ['./tl-interactive-input.component.scss']
})
export class TlInteractiveInputComponent implements OnInit {

  /**
   * Size of the interactive container. 'full' by default
   */
  @Input() size: string = 'full';

  /**
   * Placeholder input. Mandatory, shall be documented. Usually taken from modeld node value
   * Use alternative placehoder if not sure given value is set
   */
  @Input() placeholder: string;
  
  /**
   * Alterantive placeholder in case placeholder is null or empty.
   * Usually is a plain string that indicae what to do with this input
   */
  @Input() altPlaceholder: string;

  /**
   * Id of the input. Mandatory, shall be documented
   */
  @Input() inputId: string;
  
  /**
   * Text align property of the input. 'left' by default
   */
  @Input() inputTextAlign: string = 'left';
  
  /**
   * Label of the input, if any. May be undocumented for none
   */
  @Input() inputLabel: string = '';
  
  /**
   * Optional. Label width (css property). If not set, automatically adapt to content
   */
  @Input() inputLabelWidth: string = 'fit-content';

  /**
   * Output event for the component: change value
   * New value is the carried payload
   */
  @Output() changeValue: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Loading status notified via a stateful spinner during potential update on sdb
   * Shall be overriden to be used, not used in the frame of this component yet
   */
  public sdbLoadingStatus = -1;
  
  /**
   * Tells if the input of the interactive-input is currently in focus
   */
  public inputInFocus: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  
  /**
   * Triggered blurring input. Shall emit the blur event of the component with the input content, 
   * if this content is not null nore empty
   */
  public onBlurInput(event: any){
    let inputValue: string = event.srcElement.value;
    
    // Tell inut is not on focus anymore
    this.inputInFocus = false;
    
    // Emit change value event, if consistent
    if(inputValue != null && inputValue != ""){
      this.changeValue.emit(inputValue);
    }
  }
  
  public onFocusInput(){
    this.inputInFocus = true; 
  }
  
  /**
   * Handles the click on the edit markup
   * Shall focus the text input
   */
  public onClickEditMarkup(id:string){
    if(!this.inputInFocus){
      document.getElementById(id).focus();
    }
  }
  
  /**
   * Handles the click on the edit markup when loading
   */
  public onClickEditMarkupWhenLoading(id:string){
    // Do nothing
  }
  
  /**
   * Get placeholder to display
   */
  public getPlaceholder(): string {
    if (this.placeholder != null && this.placeholder !== '') {
      return this.placeholder;
    }
    return this.altPlaceholder;
  }

}
