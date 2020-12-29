import { Injectable } from '@angular/core';

import * as firebase from 'firebase'

/**
 * @author vbeauplet
 */
@Injectable({
  providedIn: 'root'
})
export class TlFbaseUploadService {

  constructor() { }
  
  /**
   * Uploads filte to firebase container
   */
  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement...');
          },
          (error) => {
            console.log('Erreur de chargement ! : ' + error);
            reject();
          },
          () => {
            resolve(upload.snapshot.ref.getDownloadURL());
          }
        );
      }
    );
  }
}
