/**
 * Defines a user structure for Tl Common needs
 *
 * May be overriden by depending libraries or applications
 */
export class TlUser {
  
  /**
   * Unique ID of the user
   */
  public userId: string = '';
  
  /**
   * Name of the user
   */
  public name: string = ''
  /**
   * Unique pseudo to identify the user
   */
  public pseudo: string = '';
  
  /**
   * URL of the user's avatar
   */
  public avatarUrl: string = '';
 
  /**
   * URL of the user's photo
   */
  public photoUrl: string = '';
  

  constructor() {
    // Nothing to do here
  }
  
  public isUndefined(): boolean {
    return this.userId === "";
  }
}