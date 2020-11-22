import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'nuki-card',
  host: { 
      '[class]' : 'this.size + " margined flex-block"'
    },
  templateUrl: './nuki-card.component.html',
  styleUrls: ['./nuki-card.component.scss']
})
export class NukiCardComponent implements OnInit {

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
