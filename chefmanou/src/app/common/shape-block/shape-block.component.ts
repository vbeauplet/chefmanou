import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'shape-block',
  host: { 
      '[class]' : 'this.size + " flex-block"',
    },
  templateUrl: './shape-block.component.html',
  styleUrls: ['./shape-block.component.scss']
})
export class ShapeBlockComponent implements OnInit {

  /**
   * Size of the shape-block
   */
  @Input() size: string = 'full'
  
  /**
   * Shape. may be 'square', 'rectangle', 'three-four', 'sixteen-nine', 'round'
   */
  @Input() shape: string = 'square';

  constructor() { }

  ngOnInit(): void {
  }

}
