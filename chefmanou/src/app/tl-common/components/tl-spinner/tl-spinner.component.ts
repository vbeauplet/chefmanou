import { Component, OnInit, Input } from '@angular/core';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-spinner',
  templateUrl: './tl-spinner.component.html',
  styleUrls: ['./tl-spinner.component.scss']
})
export class TlSpinnerComponent implements OnInit {

  /**
   * Size of the spinner, in px
   */
  @Input() size: number = 20;
  
  /**
   * Spinner color
   * Possible values are "main", "soft", 'failure', "neutral", "success", "outline"
   * "outline" by default
   */
  @Input() color: string = 'outline';
  
  /**
   * Spinner loading status
   * 0: isLoading, 1:Success, 2: Failure
   */
  @Input() loadingStatus: number = 0;
  
  constructor() { }

  ngOnInit(): void {
  }
  
  public getBorderSize() {
    return this.size / 7;
  }

}
