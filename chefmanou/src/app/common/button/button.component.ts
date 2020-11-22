import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'neumorphic-button',
  host: { 
      'class':'vert-center hor-center flex-block',
      '[class.col-dir]':'this.labelPosition === "bottom"',
      '[class.row-dir]':'this.labelPosition === "right"'
    },
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  /**
   * Button literal icon
   */
  @Input() icon: string = '';
  
  /**
   * Button literal icon style
   * May be 'simple-icon' or 'modern-icon'
   * Simple icon by default
   */
  @Input() iconPackage: string = 'simple-icon';
  
  /**
   * Button shape: 'round' or 'square'. Default value is 'round'
   */
  @Input() shape: string = 'round';
  
  /**
   * Label of the icon, if any
   * Can be let undocumented if none
   */
  @Input() label: string = '';
  
  /**
   * Default size of the icon button, in px
   * 50 by default
   */
  @Input() size: number = 50;
  
  /**
   * Margin of the button, in px
   */
  @Input() margin: number = 10;

  /**
   * Label position, if any
   * May be 'right' of 'bottom'
   * Bottom by default
   */
  @Input() labelPosition: string = 'bottom';
  
  /**
   * Icon color when status is -1 (for stateful buttons, always otherwise)
   * Possible values are "main", "soft", 'failure', "neutral", "success", "outline"
   * "main" by default
   */
  @Input() color: string = 'main';


  constructor() { }

  ngOnInit(): void {
  }
}
