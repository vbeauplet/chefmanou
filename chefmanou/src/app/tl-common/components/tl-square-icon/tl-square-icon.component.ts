import { Component, OnInit, Input } from '@angular/core';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-square-icon',
  templateUrl: './tl-square-icon.component.html',
  styleUrls: ['./tl-square-icon.component.scss']
})
export class TlSquareIconComponent implements OnInit {

  /**
   * Size of the square icon, in px
   */
  @Input() size: number = 40;
  
  /**
   * Color of the icon
   * Shall fit app color theme. Possible values are "main", "soft", 'failure', "neutral", "success", "outline"
   * "main" by default
   */
  @Input() color: string = 'main';
  
  /**
   * Icon font package to use
   */
  @Input() iconPackage: string = 'simple-icon';
  
  /**
   * Mandatory: Icon to use, from font package literal
   */
  @Input() icon: string;

  constructor() { }

  ngOnInit(): void {
  }

  /**
   * Computes the font size
   */
  public getFontSize(): number {
    if (this.iconPackage === 'simple-icon') {
      return this.size * 5/3;
    }
    return this.size * 4/3;
  }
  
  /**
   * Computes the line height
   */
  public getLineHeight(): number {
    if (this.iconPackage === 'simple-icon') {
      return this.size * 1/6;
    }
    return this.size * 1/2
  }

}
