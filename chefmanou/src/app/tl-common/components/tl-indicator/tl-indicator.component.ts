import { Component, OnInit, Input } from '@angular/core';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-indicator',
  host: { 
      '[class]':'this.size + " vert-center hor-center flex-block"',
      '[class.col-dir]':'this.textPosition === "bottom"',
      '[class.row-dir]':'this.textPosition === "right"'
    },
  templateUrl: './tl-indicator.component.html',
  styleUrls: ['./tl-indicator.component.scss']
})
export class TlIndicatorComponent implements OnInit {

  /**
   * Size of the indicator container. 'initial-size' by default
   */
  @Input() size: string = 'initial-size';

  /**
   * Button literal icon
   */
  @Input() icon: string = '';
  
  /**
   * Default size of the icon, in px
   * 30 by default
   */
  @Input() iconSize: number = 30;
  
  /**
   * Margin of the indicator icon, in px
   * 5 by default
   */
  @Input() iconMargin: number = 5;
  
  /**
   * Button literal icon style
   * May be 'simple-icon' or 'modern-icon'
   * Simple icon by default
   */
  @Input() iconPackage: string = 'simple-icon';
  
  /**
   * Text of the indicator
   */
  @Input() text: string = '';
  
  /**
   * Text alignment
   */
  @Input() textAlign: string = '';

  /**
   * Text position
   * May be 'right' of 'bottom'
   * Bottom by default
   */
  @Input() textPosition: string = 'bottom';
  
  /**
   * Indicator default color
   * Possible values are "main", "soft", 'failure', "neutral", "success", "outline"
   * "main" by default
   */
  @Input() color: string = 'main';


  constructor() { }

  ngOnInit(): void {
  }
}
