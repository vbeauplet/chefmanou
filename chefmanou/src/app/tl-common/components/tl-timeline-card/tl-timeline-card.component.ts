import { Component, OnInit, Input } from '@angular/core';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-timeline-card',
  host: { 
      '[class]' : 'this.size + " outlined flex-block"',
      '[class.row-dir]' : 'this.direction === "column"',
      '[class.hor-left]' : 'this.direction === "column"',
      '[class.vert-center]' : 'this.direction === "column"',
      '[class.timeline-left]' : 'this.direction === "column"',
      '[class.col-dir]' : 'this.direction === "row"',
      '[class.hor-center]' : 'this.direction === "row"',
      '[class.timeline-top]' : 'this.direction === "row"'
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
   * Timeline (chain of timeline cards) direction
   * May be 'row' or 'column'.
   * Column by default
   */
  @Input() direction: string = 'column'; 
  
  /**
   * Date, ( standard > in ms since 1970) corresponding to the timeline card
   * If none (0) date is not shown
   */
  @Input() date: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
