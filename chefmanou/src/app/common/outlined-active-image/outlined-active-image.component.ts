import { Component, OnInit } from '@angular/core';
import { ActiveImageComponent } from '../active-image/active-image.component';
import { UploadService } from 'src/app/services/upload.service';

@Component({
  selector: 'outlined-active-image',
  host: { 
      '[class]' : 'this.size + " col-dir hor-center vert-center outlined container-block"',
      '[class.round]' : 'this.shape === "round"'
    },
  templateUrl: './outlined-active-image.component.html',
  styleUrls: ['./outlined-active-image.component.scss']
})
export class OutlinedActiveImageComponent extends ActiveImageComponent implements OnInit {

  constructor(
    public uploadService: UploadService) {
    super(uploadService);
  }

  ngOnInit(): void {
  }

}
