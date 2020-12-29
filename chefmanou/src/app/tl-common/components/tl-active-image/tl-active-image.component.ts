import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ITlNamedIcon } from '../../interfaces/tl-named-icon.interface';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-active-image',
  host: { 
      '[class]' : 'this.size + " flex-block"',
    },
  templateUrl: './tl-active-image.component.html',
  styleUrls: ['./tl-active-image.component.scss']
})
export class TlActiveImageComponent implements OnInit {

  /**
   * Tells if overlay with active icons shall be displayed when use hovers the active image
   */
  @Input() hasOverlay: boolean = true;
  
  /**
   * Link to the url image. interactive: if modified (via upload on corresponding node for instance), image is updated
   * Shall be provided
   */
  @Input() imageSrc: string;
  
  /**
   * Size of the active image
   */
  @Input() size: string = 'small';
  
  /**
   * Shape of the active image. may be 'square' (default), 'round', 'rectangle'
   */
  @Input() shape: string = 'square';
  
  /**
   * Controls the active image message, if any. Empty string if none
   */
  @Input() message: string = '';
  
  /**
   * Active icons to diplay in active image overlay
   * Note: 'Expand Image' icon (show original image) is displayed by default
   */
  @Input() activeIcons: ITlNamedIcon[] = [];
  
  /**
   * Event to raise when clicking on an active icon
   * Payload is te name of the named icon
   */
  @Output() clickIcon: EventEmitter<string> = new EventEmitter<string>()
  
  /**
   * Controls the image spinner, ic case an action takes time.
   * -1 by default (-1 means not displayed)
   */
  public loadingStatus: number = -1;
  
  /**
   * Tells if active image is on focus, which means overlay shall stay visible, even not on hover
   */
  public onFocus: boolean = false;
  
  /**
   * Uses the image upload service
   */
  constructor() { }

  ngOnInit(): void {
  }
  
  /**
   * Handles click on active icon
   * May be overriden for specific active images
   */
  public onClickActiveIcon(actionName: string){
    
    // Emit corresponding event
    this.clickIcon.emit(actionName); 
  }

}
