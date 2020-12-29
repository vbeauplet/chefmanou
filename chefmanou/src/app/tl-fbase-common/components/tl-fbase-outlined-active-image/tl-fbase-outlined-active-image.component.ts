import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TlFbaseActiveImageComponent } from '../tl-fbase-active-image/tl-fbase-active-image.component';
import { TlFbaseUploadService } from '../../services/tl-fbase-upload.service';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-fbase-outlined-active-image',
  host: { 
      '[class]' : 'this.size + " col-dir hor-center vert-center outlined container-block"',
      '[class.round]' : 'this.shape === "round"'
    },
  templateUrl: './tl-fbase-outlined-active-image.component.html',
  styleUrls: ['./tl-fbase-outlined-active-image.component.scss']
})
export class TlFbaseOutlinedActiveImageComponent extends TlFbaseActiveImageComponent implements OnInit {
  
  /**
   * Event that is emitted when image has been modified
   */
  @Output() changeImage: EventEmitter<string> = new EventEmitter<string>();
  
  constructor(
    public uploadService: TlFbaseUploadService) {
    super(uploadService);
  }

  ngOnInit(): void {
  }

}
