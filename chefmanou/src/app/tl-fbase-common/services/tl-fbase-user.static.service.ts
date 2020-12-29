import { Injectable } from '@angular/core';

import { TlUser } from "../../tl-common/model/tl-user.model";
import { TlUserStaticService } from "../../tl-common/services/tl-user.static.service";

import * as firebase from 'firebase';

export const tlUserConverter = {
    toFirestore: function(user: any) {
        return {
            userId: user.userId,
            name: user.name,
            pseudo: user.pseudo,
            avatarUrl: user.avatarUrl,
            photoUrl: user.photoUrl
          }
    },
    fromFirestore: function(snapshot: any, options: any){
        const data = snapshot.data(options);
        return tlUserConverter.fromFirestoreData(data);
    },
    fromFirestoreData: function(data: any){
        let user = new TlUser();
        user.userId = data.userId;
        user.name = data.name;
        user.pseudo = data.pseudo;
        user.avatarUrl = data.avatarUrl;
        user.photoUrl = data.photoUrl;
        return user;
    }
}

/**
 * Gather all static services related to tl-user handling between app and a firebase database
 */
@Injectable({ 
  providedIn: 'root'
})
export class TlFbaseUserStaticService extends TlUserStaticService {
  
  constructor() {
    super();
  }
  
  /**
   * Retrieve user object from user ID; Browses database to perform the operations
   */
  public getUserFromIdOnServer(userId: string): Promise<TlUser> {
    return new Promise((resolve, reject) => {
      const userRef = firebase.firestore().collection('users').doc(userId);
      userRef.withConverter(tlUserConverter).get()
        .then(function(doc) {
          if (doc.exists){
            // Convert to TlUser object
            resolve(doc.data());
          }
        }).catch(function(error) {
            reject(error);
        });
    });
  }

  /**
   * Get users in database
   */
  public getUsersOnServer(maxNumber: number): Promise<TlUser[]>{
    return new Promise((resolve) => {
      let result: TlUser[] = [];
      firebase.firestore().collection("users").limit(maxNumber)
        .withConverter(tlUserConverter).get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                result.push(doc.data())
              });
            resolve(result);
        })
        .catch(function(error) {
            console.log("Error getting users", error);
        });
      });
  }
  
  /**
   * Search users from any string value in database
   */
  public searchUsersOnServer(maxNumber: number, value: string, excludedUsers: TlUser[]): Promise<TlUser[]>{
    const that = this;
    return new Promise((resolve) => {
      let result: TlUser[] = [];
      
      // Search from user name
      let isQueryFromNameOver: boolean = false;
      firebase.firestore().collection("users")
        .limit(maxNumber + excludedUsers.length)
        .orderBy('nameSearchTerm')
        .where('nameSearchTerm', '>=', value.toLowerCase())
        .where('nameSearchTerm', '<=', value.toLowerCase() + '\uf8ff')
        .withConverter(tlUserConverter)
        .get()
        .then(function(querySnapshot) {
            // Browse through all query result
            querySnapshot.forEach(function(doc) {
                let user: TlUser = doc.data();
                
                // Add user if not excluded and not already found
                if(!that.containsUser(excludedUsers, user) && !that.containsUser(result, user)) {
                  result.push(user)
                }
                
                // Ending condition: max number of result is reached
                if(result.length >= maxNumber){
                  resolve(result);
                }
              });
            
            // Notify query is over
            isQueryFromNameOver = true;
            
            // Ending condition: all queries are over
            if(isQueryFromNameOver && isQueryFromPseudoOver){
              resolve(result);
            }
        })
        .catch(function(error) {
            console.log("Error getting users", error);
        });
        
      // Search from user name
      let isQueryFromPseudoOver: boolean = false;
      firebase.firestore().collection("users")
        .limit(maxNumber + excludedUsers.length)
        .orderBy('pseudoSearchTerm')
        .where('pseudoSearchTerm', '>=', value.toLowerCase())
        .where('pseudoSearchTerm', '<=', value.toLowerCase() + '\uf8ff')
        .withConverter(tlUserConverter)
        .get()
        .then(function(querySnapshot) {
            // Browse through all query result
            querySnapshot.forEach(function(doc) {
                let user: TlUser = doc.data();
                
                // Add user if not excluded and not already found
                if(!that.containsUser(excludedUsers, user) && !that.containsUser(result, user)) {
                  result.push(user)
                }
                
                // Ending condition: max number of result is reached
                if(result.length >= maxNumber){
                  resolve(result);
                }
              });
            
            // Notify query is over
            isQueryFromPseudoOver = true;
            
            // Ending condition: all queries are over
            if(isQueryFromNameOver && isQueryFromPseudoOver){
              resolve(result);
            }
        })
        .catch(function(error) {
            console.log("Error getting users", error);
        });
        
      });
  }
}