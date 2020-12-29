import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TlActiveImageComponent } from '../tl-active-image/tl-active-image.component';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-outlined-active-image',
  host: { 
      '[class]' : 'this.size + " col-dir hor-center vert-center outlined container-block"',
      '[class.round]' : 'this.shape === "round"'
    },
  templateUrl: './tl-outlined-active-image.component.html',
  styleUrls: ['./tl-outlined-active-image.component.scss']
})
export class TlOutlinedActiveImageComponent extends TlActiveImageComponent implements OnInit {
  
  /**
   * Re-emit click icon event
   */
  @Output() clickIcon: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
