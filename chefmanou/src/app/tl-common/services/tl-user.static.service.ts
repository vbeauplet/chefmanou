import { Injectable } from '@angular/core';

import { TlUser } from "../model/tl-user.model";

/**
 * Gather all static services related to tl-user handling
 * 
 * @author vbeauplet
 */
@Injectable({ 
  providedIn: 'root'
})
export class TlUserStaticService {
  
  constructor() {
  }
  
  /**
   * Tells if users are the same
   */
  public areSameUser(user1: TlUser, user2: TlUser): boolean {
    return user1.userId === user2.userId;
  }
  
  /**
   * Tells if the provided array of users contains the given user
   */
  public containsUser(userArray: TlUser[], user: TlUser): boolean {
    for (let userInArray of userArray) {
      if(this.areSameUser(userInArray, user)) {
        return true;
      }
    }
    return false;
  }
}