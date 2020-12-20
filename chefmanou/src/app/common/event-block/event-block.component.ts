import { Component, OnInit, Input } from '@angular/core';

import { Event } from "../../model/event.model";

@Component({
  selector: 'event-block',
  host: { 
      '[class]' : 'this.size + " container-block"',
      '[class.margined]' : 'this.margined',
      '[class.padded]' : 'this.padded',
      '[class.outlined]' : 'this.outlined'
    },
  templateUrl: './event-block.component.html',
  styleUrls: ['./event-block.component.scss']
})
export class EventBlockComponent implements OnInit {

  /**
   * Event input
   */
  @Input() event: Event = new Event();

  /**
   * Block size
   */
  @Input() size: string = 'full'
  
  /**
   * Tells if block shall be margined
   */
  @Input() margined: boolean = true;
  
  /**
   * Tells if block shall be padded
   */
  @Input() padded: boolean = true;
  
  /**
   * Tells if block shall be outlined
   */
  @Input() outlined: boolean = true;
  
  /**
   * Tells if date shall be shown
   */
  @Input() showDate: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
