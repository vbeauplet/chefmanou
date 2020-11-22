import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'miniature',
  host: { 
      '[class]' : 'this.size + " " + this.miniatureStyle + " clickable hor-space-between vert-center row-dir container-block"',
      '[class.margined]' : 'this.margined',
      '[style.background-color]' : 'red'
    },
  templateUrl: './miniature.component.html',
  styleUrls: ['./miniature.component.scss']
})
export class MiniatureComponent implements OnInit {

  /**
   * URL of the minaiture photo.
   * Shall be provided
   */
  @Input() photoUrl: string = '';
  
  /**
   * Label of the miniature
   * Shall be provided
   */
  @Input() label: string = '';
  
  /**
   * Browse link, if any
   * Can be let undocumented if none
   */
  @Input() link: string = '';
  
  /**
   * Size of the miniature container
   */
  @Input() size: string = 'near-full';
  
  /**
   * Miniature height, in px
   * 50 by default
   */
  @Input() height: number = 50;
  
  /**
   * Miniature border radius, in px
   * 10 by default
   */
  @Input() borderRadius: number = 10;
  
  /**
   * Style of the miniature
   * Can be: transparent; outlined
   * Transparent by default
   */
  @Input() miniatureStyle = 'transparent'
  
  /**
   * Tells if the miniature container shall have a margin
   */
  @Input() margined: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
