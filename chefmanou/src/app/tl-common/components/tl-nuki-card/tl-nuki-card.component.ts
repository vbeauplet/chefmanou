import { Component, OnInit, Input } from '@angular/core';
/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-nuki-card',
  host: { 
      '[class]' : 'this.size + " margined flex-block"'
    },
  templateUrl: './tl-nuki-card.component.html',
  styleUrls: ['./tl-nuki-card.component.scss']
})
export class TlNukiCardComponent implements OnInit {

  /**
   * Mandatory, image src link for the head of the nuki card
   */
  @Input() imageSrc: string = '';
  
  /**
   * Size of the card, can be big, medium, small (...). Medium by default
   */ 
  @Input() size: string = 'medium';
  
  /**
   * Tells if card is loading and shall therefore display a loader as content
   */
  @Input() isLoading: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
