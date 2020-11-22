import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

export interface AuthInfos {
  isAuth: boolean;
  userId: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public authInfos: AuthInfos = {
      isAuth: false,
      userId: "",
      email: ""
    };
    
  public authInfosSubject : Subject<AuthInfos> = new Subject<AuthInfos>();
  public newAuthInfosSubject : Subject<AuthInfos> = new Subject<AuthInfos>();

  constructor() {
    firebase.auth().onAuthStateChanged(
      (user) => {
        if(user) {
          this.authInfos.isAuth = true;
          this.authInfos.userId = user.uid;
          this.authInfos.email = user.email;
        } else {
          this.authInfos.isAuth = false;
        }
        this.emitAuthInfos();
      }
    );
  }
  
  public emitAuthInfos() {
    this.authInfosSubject.next(this.authInfos);
  }
  
  public emitNewAuthInfos() {
    this.newAuthInfosSubject.next(this.authInfos);
  }
  
  public createNewAuth(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().createUserWithEmailAndPassword(email, password).then(
          (auth) => {
            this.authInfos.userId = auth.user.uid;
            this.authInfos.email = auth.user.email;
            this.emitNewAuthInfos();
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  
  /**
   * Can only be called if user is authenticated
   */
  public updateUser(name: string, photoUrl: string) {
    var user = firebase.auth().currentUser;

    user.updateProfile({
      displayName: name,
      photoURL: photoUrl
    });
  }
  
  public signInUser(email: string, password: string) {
    return new Promise(
      (resolve, reject) => {
        firebase.auth().signInWithEmailAndPassword(email, password).then(
          () => {
            resolve();
          },
          (error) => {
            reject(error);
          }
        );
      }
    );
  }
  
  public signOutUser() {
    firebase.auth().signOut();
  }
}
