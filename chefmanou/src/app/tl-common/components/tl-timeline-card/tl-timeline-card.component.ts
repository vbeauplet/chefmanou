import { Component, OnInit, Input } from '@angular/core';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-timeline-card',
  host: { 
      '[class]' : 'this.size + " outlined flex-block"',
      '[class.row-dir]' : '!this.rowDirection',
      '[class.hor-left]' : '!this.rowDirection',
      '[class.vert-center]' : '!this.rowDirection',
      '[class.timeline-left]' : '!this.rowDirection',
      '[class.col-dir]' : 'this.rowDirection',
      '[class.hor-center]' : 'this.rowDirection',
      '[class.timeline-top]' : 'this.rowDirection'
    },
  templateUrl: './tl-timeline-card.component.html',
  styleUrls: ['./tl-timeline-card.component.scss']
})
export class TlTimelineCardComponent implements OnInit {

  /**
   * Size of the card, can be big, medium, small. Medium by default
   */ 
  @Input() size: string = 'medium';

  /**
   * Override this input if timeline (chain of timeline cards) direction is horizontal
   * Set to true if direction of the timeline is horizontal
   * False by default (vertical)
   */
  @Input() rowDirection: boolean = false; 
  
  /**
   * Date, ( standard > in ms since 1970) corresponding to the timeline card
   * If none (0) date is not shown
   */
  @Input() date: number = 0;
  
  /**
   * CSS width property of the date div
   * Inherit by default, may be set if wanted
   */
  @Input() dateWidth: string = 'unset';

  constructor() { }

  ngOnInit(): void {
  }

}
