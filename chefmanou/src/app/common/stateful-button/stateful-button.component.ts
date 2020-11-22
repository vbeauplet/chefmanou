import { Component, OnInit, Input } from '@angular/core';
import { ButtonComponent} from '../button/button.component';

@Component({
  selector: 'stateful-button',
  host: { 
      'class':'flex-block',
      '[class.col-dir]':'this.labelPosition === "bottom"',
      '[class.row-dir]':'this.labelPosition === "right"'
    },
  templateUrl: './stateful-button.component.html',
  styleUrls: [
      '../button/button.component.scss',
      './stateful-button.component.scss'
    ]
})
export class StatefulButtonComponent extends ButtonComponent implements OnInit {

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
