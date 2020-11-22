import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'card',
  host: { 
      '[class]' : 'this.size + " outlined margined container-block"'
    },
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  /**
   * Size of the card, can be big, medium, small. Medium by default
   */ 
  @Input() size: string = 'medium';
 
  /**
   * Fixed height, in px. If not provided, height is auto
   */
  @Input() fixedHeight: number = -1;
 
  /**
   * Tells if card is loading and shall therefore display a loader as content
   */
  @Input() isLoading: boolean = false;
  
  /**
   * Card padding, in px. 0 by default
   */
  @Input() padding: number = 0;
  
  
  // Ad photo url, miniture url, show-controls, editable-photo, clickable, clicked url

  constructor() { }

  ngOnInit(): void {
  }

}
