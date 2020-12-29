import { Component, OnInit, Input } from '@angular/core';
import { TlButtonComponent} from '../tl-button/tl-button.component';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-stateful-button',
  host: { 
      'class':'flex-block',
      '[class.col-dir]':'this.labelPosition === "bottom"',
      '[class.row-dir]':'this.labelPosition === "right"'
    },
  templateUrl: './tl-stateful-button.component.html',
  styleUrls: [
      '../tl-button/tl-button.component.scss',
      './tl-stateful-button.component.scss'
    ]
})
export class TlStatefulButtonComponent extends TlButtonComponent implements OnInit {

  /**
   * Status of the stateful-button, standard by default
   */
  @Input() status: number = -1; // -1: Standard, 0: isLoading, 1:Success, 2: Failure
  
  constructor() {
    super();
  }

  ngOnInit(): void {
  }

}
