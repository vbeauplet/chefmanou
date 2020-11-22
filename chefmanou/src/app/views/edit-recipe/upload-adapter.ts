
import * as firebase from 'firebase';

export class UploadAdapter {
  private loader;
  
  constructor (loader:any) {
    this.loader = loader;
    
  }
  
  public upload(): Promise<any> {
    
    return new Promise(
      (resolve, reject) => {
        
        this.loader["file"].then(
          (data) => {
            const almostUniqueFileName = Date.now().toString();
            const upload = firebase.storage().ref()
              .child('images/' + almostUniqueFileName + data.name).put(data);
         
            upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
              () => {
                console.log('Chargement…');
              },
              (error) => {
                console.log('Erreur de chargement ! : ' + error);
                reject();
              },
              () => {
                upload.snapshot.ref.getDownloadURL().then(
                  (data) => {
                    resolve({default: data.toString()});
                  }
                );
              }
            );
          }
        );
        
        
      }
    );
  }
}