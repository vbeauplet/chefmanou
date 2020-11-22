import { Injectable } from '@angular/core';

import { AuthService, AuthInfos } from '../auth/services/auth.service';

import { User } from "../model/user.model";

import * as firebase from 'firebase';

export const userConverter = {
    toFirestore: function(user: any) {
        return {
            userId: user.userId,
            name: user.name,
            nameSearchTerm: user.nameSearchTerm,
            pseudo: user.pseudo,
            pseudoSearchTerm: user.pseudoSearchTerm,
            email: user.email,
            avatarUrl: user.avatarUrl,
            photoUrl: user.photoUrl,
            followers: user.followers,
            followings: user.followings,
            pinnedRecipe: user.pinnedRecipe,
            latestRecipes: user.latestRecipes,
          }
    },
    fromFirestore: function(snapshot: any, options: any){
        const data = snapshot.data(options);
        return userConverter.fromFirestoreData(data);
    },
    fromFirestoreData: function(data: any){
        let user = new User();
        user.userId = data.userId;
        user.name = data.name;
        user.nameSearchTerm = data.nameSearchTerm
        user.pseudo = data.pseudo;
        user.pseudoSearchTerm = data.pseudoSearchTerm;
        user.email = data.email;
        user.avatarUrl = data.avatarUrl;
        user.photoUrl = data.photoUrl;
        user.followers = data.followers;
        user.followings = data.followings;
        user.pinnedRecipe = data.pinnedRecipe;
        user.latestRecipes = data.latestRecipes;
        return user;
    }
}

/**
 * Gather all static services related to user handling between app and database
 * For information reagrding currently logged user, please use the primary service ProfileService 
 * that maintains the websocket connexion toward these infos
 */
@Injectable({ 
  providedIn: 'root'
})
export class UserService {
  
  /**
   * Builds a user service
   * Subscribe to any authentication creation to create associated user in database
   */
  constructor(private authService: AuthService) {
    
    // Subscribe to any new auth creation to create associated user
    this.authService.newAuthInfosSubject.subscribe(
      (authInfos: AuthInfos) => {
        this.createNewUserOnServer(authInfos.userId, authInfos.email);
      }
    );
  }
  
  /**
   * Retrieves the number of followers of a particular user
   */
  public retrieveFollowersNb(user: User): number {
    if (user.followers != null){
      return user.followers.length;
    }
    return 0;
  }
  
  /**
   * Retrieves the number of followings of a particular user
   */
  public retrieveFollowingsNb(user: User): number {
    if (user.followings != null){
      return user.followings.length - 1;
    }
    return 0;
  }
  
  /**
   * Tells if users are the same
   */
  public areSameUser(user1: User, user2: User): boolean {
    return user1.userId === user2.userId;
  }
  
  /**
   * Creates a new user on database from UID and name
   * May be called after a new Authentication object has been created
   */
  public createNewUserOnServer(userId: string, email: string){
    let user: User = new User();
    user.userId = userId
    user.email = email;
    user.pseudo = email.split("@")[0];
    user.pseudoSearchTerm = user.pseudo.toLowerCase();
    user.avatarUrl = 'https://firebasestorage.googleapis.com/v0/b/chefmanou-1705a.appspot.com/o/images%2Favatar_default.png?alt=media&token=34df0a7d-6f23-4b5f-93ea-8472b7bb6d18';
    user.photoUrl = 'https://firebasestorage.googleapis.com/v0/b/chefmanou-1705a.appspot.com/o/images%2Favatar_default.png?alt=media&token=34df0a7d-6f23-4b5f-93ea-8472b7bb6d18';
    user.followings = [userId];
    
    const userDoc = firebase.firestore().collection("users").doc(userId)
    userDoc.withConverter(userConverter).set(user);
  }
  
  /**
   * Add a following user to origin on server
   */
  public addFollowingOnServer(origin:User, following: User) {
    return new Promise((resolve, reject) => {
      const originRef = firebase.firestore().collection('users').doc(origin.userId);
      originRef.update({
          followings: firebase.firestore.FieldValue.arrayUnion(following.userId)
        })
        .then(function() {
            resolve();
          })
        .catch(function(error) {
            reject(error);
          });
    });
  }
  
  /**
   * Remove a following user to origin on server
   */
  public removeFollowingOnServer(origin:User, following: User) {
    return new Promise((resolve, reject) => {
      const originRef = firebase.firestore().collection('users').doc(origin.userId);
      originRef.update({
          followings: firebase.firestore.FieldValue.arrayRemove(following.userId)
        })
        .then(function() {
            resolve();
          })
        .catch(function(error) {
            reject(error);
          });
    });
  }
  
  /**
   * Add a follower user to origin on server
   */
  public addFollowerOnServer(origin: User, follower: User) {
    return new Promise((resolve, reject) => {
      const originRef = firebase.firestore().collection('users').doc(origin.userId);
      originRef.update({
          followers: firebase.firestore.FieldValue.arrayUnion(follower.userId)
        })
        .then(function() {
            resolve();
          })
        .catch(function(error) {
            reject(error);
          });
    });
  }
  
  /**
   * Remove a follower user to origin on server
   */
  public removeFollowerOnServer(origin: User, follower: User) {
    return new Promise((resolve, reject) => {
      const originRef = firebase.firestore().collection('users').doc(origin.userId);
      originRef.update({
          followers: firebase.firestore.FieldValue.arrayRemove(follower.userId)
        })
        .then(function() {
            resolve();
          })
        .catch(function(error) {
            reject(error);
          });
    });
  }
  
  public updateLatestRecipesOnServer(user: User, newLatestRecipes: string[]){
    return new Promise((resolve, reject) => {
      const userRef = firebase.firestore().collection('users').doc(user.userId);
      userRef.update({
          latestRecipes: newLatestRecipes
        })
        .then(function() {
            resolve();
          })
        .catch(function(error) {
            reject(error);
          });
    });
  }

  /**
   * Retrieve user object from user ID; Browses database to perform the operations
   */
  public getUserFromIdOnServer(userId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const userRef = firebase.firestore().collection('users').doc(userId);
      userRef.withConverter(userConverter).get()
        .then(function(doc) {
          if (doc.exists){
            // Convert to City object
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
  public getUsersOnServer(maxNumber: number): Promise<User[]>{
    return new Promise((resolve) => {
      let result: User[] = [];
      firebase.firestore().collection("users").limit(maxNumber)
        .withConverter(userConverter).get()
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
  public searchUsersOnServer(maxNumber: number, value: string, excludedUsers: User[]): Promise<User[]>{
    const that = this;
    return new Promise((resolve) => {
      let result: User[] = [];
      
      // Search from user name
      let isQueryFromNameOver: boolean = false;
      firebase.firestore().collection("users")
        .limit(maxNumber + excludedUsers.length)
        .orderBy('nameSearchTerm')
        .where('nameSearchTerm', '>=', value.toLowerCase())
        .where('nameSearchTerm', '<=', value.toLowerCase() + '\uf8ff')
        .withConverter(userConverter)
        .get()
        .then(function(querySnapshot) {
            // Browse through all query result
            querySnapshot.forEach(function(doc) {
                let user: User = doc.data();
                
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
        .withConverter(userConverter)
        .get()
        .then(function(querySnapshot) {
            // Browse through all query result
            querySnapshot.forEach(function(doc) {
                let user: User = doc.data();
                
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
  
  /**
   * Resolve followers list from a given user, getting User objects associated to followers ID in database
   */
  public getFollowersOnServer(user: User): Promise<User[]> {
    return new Promise((resolve) => {
        let result: User[] = [];
        
        if(user.followers != null){
          for (var followerId of user.followers) {
            this.getUserFromIdOnServer(followerId).then(
              (follower: User) => {
                  result.push(follower);
                }
              );
          }
          resolve(result);
        }
        else {
          resolve([]);
        }
      });
  }
  
  /**
   * Resolve followings list from user, getting User objects associated to followings ID in database
   * Note: User that carry the ''followings' list is in this list in database, but shall not appear in this following list
   */
  public getFollowingsOnServer(user: User): Promise<User[]> {
    return new Promise((resolve) => {
        let result: User[] = [];
        let that = this;
        
        if(user.followings != null){
          for (var followingId of user.followings) {
            this.getUserFromIdOnServer(followingId).then(
              (following: User) => {
                  if(!that.areSameUser(user, following)){
                    result.push(following);
                  }
                }
              );
          }
          resolve(result);
        }
        else {
          resolve([]);
        }
      });
  }
  
  /**
   * Tells if the provided array of users contains the given user
   */
  public containsUser(userArray: User[], user: User): boolean {
    for (let userInArray of userArray) {
      if(this.areSameUser(userInArray, user)) {
        return true;
      }
    }
    return false;
  }
}