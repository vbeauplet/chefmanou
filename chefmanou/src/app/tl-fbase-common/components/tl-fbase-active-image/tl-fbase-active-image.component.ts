import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TlFbaseUploadService } from '../../services/tl-fbase-upload.service';

import * as firebase from 'firebase';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-fbase-active-image',
  host: { 
      '[class]' : 'this.size + " flex-block"',
    },
  templateUrl: './tl-fbase-active-image.component.html',
  styleUrls: ['./tl-fbase-active-image.component.scss']
})
export class TlFbaseActiveImageComponent implements OnInit {

  /**
   * Tells if overlay shall be displayed when use hovers the active image
   */
  @Input() hasOverlay: boolean = true;

  /**
   * Tells if overlay shall provide an uplaod button, in case image shal be modifiable on server by user
   */
  @Input() hasUploadButton: boolean = true;
  
  /**
   * Gives the document node endpoint within SDB
   * DOcument will be used to store url and miniature url of the uploaded image
   * Shall be provided if upload button is active
   */
  @Input() sdbDocNode: string = "";
  
  /**
   * Gives the SDB property name within the document to the image url
   * Shall be provided if upload button is active
   */
  @Input() imageUrlSdbProperty: string = "";
  
  /**
   * Gives the SDB property name within the document to the miniature image url
   * Shall be provided if upload button is active
   */
  @Input() miniatureImageUrlSdbProperty: string = "";
  
  /**
   * Link to the url image. interactive: if modified (via upload on corresponding node for instance), image is updated
   * Shall be provided
   */
  @Input() imageSrc: string;
  
  /**
   * Size of the active image
   */
  @Input() size: string = 'small';
  
  /**
   * Shape of the active image. may be 'square' (default), 'round', 'rectangle'
   */
  @Input() shape: string = 'square';
  
  /**
   * Event that is emitted when image has been modified
   */
  @Output() changeImage: EventEmitter<string> = new EventEmitter<string>();
  
  
  /**
   * Gives the upload action spinner status, in case upload is active
   */
  public imageLoadingStatus: number = -1;
  
  /**
   * Gives the upload spiner message, in case upload is active
   */
  public imageLoadingMessage: string = '';
  
  /**
   * Tels if active image is on focus, which means overlay shall stay visible, even not on hover
   */
  public onFocus: boolean = false;
  
  /**
   * Uses the image upload service
   */
  constructor(
    public uploadService: TlFbaseUploadService) { }

  ngOnInit(): void {
  }
  
  /**
   * Triggers when the change image button is used by user and image is selected
   */
  public onChangeImage(event: any) {
    var file = event.target.files[0]
    this.imageLoadingStatus = 0;
    this.onFocus = true;
    
    // Try upload image
    this.uploadService.uploadFile(file).then(
      (rawUrl: string) => {
        // Set additionnal timeout to wait for post actions on image by server
        setTimeout(() => {
          
          let that = this;
          
          // Compute minaiture image URL
          const extensionIndex = rawUrl.lastIndexOf('.');
          const url = rawUrl.substring(0, extensionIndex) + '_2000x2000' + rawUrl.substring(extensionIndex, rawUrl.length);
          const miniatureUrl = rawUrl.substring(0, extensionIndex) + '_400x400' + rawUrl.substring(extensionIndex, rawUrl.length);
          
          // Compute property update to perform at selected document node
          let sdbPropertyUpdate = {};
          sdbPropertyUpdate[this.imageUrlSdbProperty] = url;
          sdbPropertyUpdate[this.miniatureImageUrlSdbProperty] = miniatureUrl;
          firebase.firestore().doc(this.sdbDocNode).update(sdbPropertyUpdate)
            .then(function() {
                // Set upload status
                that.imageLoadingStatus = 1;
                
                // Emit image modification event
                that.changeImage.emit(url);
                
                // Release status after the 3 second validation time span
                setTimeout(() => {
                  that.imageLoadingStatus = -1;
                  that.onFocus = false;
                }, 3000);
              })
            .catch(function(error) {
                // If any, notify failure to user
                that.imageLoadingStatus = 2;
                that.onFocus = false;
              });
            
        }, 5000);
      }
    );
  }

}
