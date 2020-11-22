import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/model/user.model';
import { UserService } from 'src/app/services/user.service';
import * as firebase from 'firebase';

/**
 * User picker is a UI/behavior component that enables to select user among a list of users
 */
@Component({
  selector: 'user-picker',
  host: { 
    '[class]' : 'this.size + " margined row-dir flex-block"',
    },
  templateUrl: './user-picker.component.html',
  styleUrls: ['./user-picker.component.scss']
})
export class UserPickerComponent implements OnInit {

  /**
   * Size of the string picker container. Full by default
   */
  @Input() size: string = 'full';
  
  /**
   * Height of the user miniatures of the user picker, in px
   */
  @Input() userSize: number = 50;
  
  /**
   * List of initially selected users
   */
  @Input() initialSelectedUsers: User[] = [];
  
  /**
   * Synchronize selected users with initial selected users input
   * It means if true anytime table provided as initialSelectedUsers changes,
   * table of component selected users is updated accordingly.
   *
   * If false, initialSelectedItems are copied only once at component initialization and compoennt lives its life afterward
   *
   * False by default to avoid misunderstanding
   */
  @Input() synchrone: boolean = false;
  
  /**
   * Tells if only one user can be selected via the user picker
   */
  @Input() singleSelection: boolean = false;
  
  /**
   * Max number of result for a user search
   */
  @Input() searchMaxNumber: number = 5;
  
  /**
   * Target SDB Document Node for the property to be updated on server
   * Can be let undocumented if update on server is not wanted
   */
  @Input() sdbDocNode: string = '';
  
  /**
   * Target SDB property to be updated on server, for the provided document node.
   * Property shall point toward a user array.
   * Can be let undocumented if update on server is not wanted
   */
  @Input() sdbProperty: string = '';
  
  /**
   * Event that is raised when a user is clicked
   * User that is clicked is carried by the event
   */
  @Output() clickUser: EventEmitter<User> = new EventEmitter<User>();
  
  /**
   * Event that is raised when user selection is changed
   * List of all selected users is carried by this event at any trigger
   */
  @Output() selectUsers: EventEmitter<User[]> = new EventEmitter<User[]>();
  
  /**
   * Event that is raised when a user is selected
   * Selected user is carried by this event
   */
  @Output() selectUser: EventEmitter<User> = new EventEmitter<User>();
  
  /**
   * Event that is raised when a user is unselected
   * Unselected item is carried by this event
   */
  @Output() unselectUser: EventEmitter<User> = new EventEmitter<User>();
  
  /**
   * Bindable selected users
   */
  public selectedUsers: User[] = [];
  
  /**
   * Bindable proposed users
   */
  public proposedUsers: User[] = [];
  
  /**
   * Tells if a user search is runnning
   */
  public isSearching: boolean = false;
  
  /**
   * Gives user that are submitted to a loading operation
   * Only used if user-picker is linked to a SDB node for upload/download operations
   */
  public userLoading: User[] = [];
  
  /**
   * Last user search input value
   */
  public lastSearch: string = '';
  
  
  /**
   * Tells if the component UI is flipped or not
   * Initially unflipped
   */
  public isFlipped = false;

  constructor(
      private userService: UserService) { }

  ngOnInit(): void {
    this.refreshFromInitialSelectedUsers();
  }
  
  ngOnChanges(): void {
    // React to any change on initial selected items only if component is synchrone
    if(this.synchrone){
      this.refreshFromInitialSelectedUsers();
    }
  }
  
  /**
   * Refreshes / Resets component from current value of the initialSelectedUsers value  
   */
  public refreshFromInitialSelectedUsers() {
    this.selectedUsers = [...this.initialSelectedUsers];
      
    // Launch search
    this.search('');
  }
  
  public onClickUser(user: User){
    // Emit the clickUser event
    this.clickUser.emit(user);
    
    // Switch user status: if selected, unselect it; if not select it
    this.switchUserStatus(user);
    
    // Emit the selctItems event
    this.selectUsers.emit(this.selectedUsers);
  }
  
  /**
   * Tells if component shall act directly on server
   */
  private shallActOnServer(){
    return this.sdbDocNode !== '' && this.sdbProperty != '';
  }
  
  /**
   * Switch selected status of a user
   */
  private switchUserStatus(user: User){
    // Tells user is loading
    this.userLoading.push(user);

    // If item is selected, unselect it
    if (this.selectedUsers.includes(user)){
      if(this.shallActOnServer()){
        this.removeUserOnServer(user)
          .then(() => {
            // Tell it is not loading anymore
            const index = this.userLoading.indexOf(user);
            this.userLoading.splice(index, 1);
            
            // Remove of list of selected user
            const index2 = this.selectedUsers.indexOf(user);
            this.selectedUsers.splice(index2, 1);
            
            // Relaunch search
            this.search(this.lastSearch);
            
          }).catch(() => {
            // Tell it is not loading anymore
            const index = this.userLoading.indexOf(user);
            this.userLoading.splice(index, 1);
          });
      }
      else {
        // Tell it is not loading anymore
        const index = this.userLoading.indexOf(user);
        this.userLoading.splice(index, 1);
        
        // Remove of list of selected user
        const index2 = this.selectedUsers.indexOf(user);
        this.selectedUsers.splice(index2, 1);
        
        // Relaunch search
        this.search(this.lastSearch);
      }
      
      // Emit unselect item event
      this.unselectUser.emit(user);
    }
    
    // Else if item is not, select it
    else {
      
      // First, if component runs in single selection mode and a user is selected, unselect it
      if(this.singleSelection){
        if(this.selectedUsers.length != 0){
          this.switchUserStatus(this.selectedUsers[0]);
        }
      }
      
      if(this.shallActOnServer()){
        this.addUserOnServer(user)
          .then(() => {
            // Tell it is not loading anymore
            const index = this.userLoading.indexOf(user);
            this.userLoading.splice(index, 1);
            
            // Add to list of selected user
            this.selectedUsers.push(user);
            
            // Flip view
            this.isFlipped = false;
            
            // Relaunch search
            this.search(this.lastSearch);
            
          }).catch(() => {
            // Tell it is not loading anymore
            const index = this.userLoading.indexOf(user);
            this.userLoading.splice(index, 1);
          });
      }
      else{
        // Tell it is not loading anymore
        const index = this.userLoading.indexOf(user);
        this.userLoading.splice(index, 1);
        
        // Add to list of selected user
        this.selectedUsers.push(user);
        
        // Flip view
        this.isFlipped = false;
        
        // Relaunch search
        this.search(this.lastSearch);
      }
      
      // Emit select item event
      this.selectUser.emit(user);
    }
  }
  
  /**
   * Search among all SDB users and update component accordingly
   */
  public search(inputValue: string) {
    this.isSearching = true;
    this.userService.searchUsersOnServer(this.searchMaxNumber, inputValue, this.selectedUsers)
      .then((result: User[]) => {
          this.proposedUsers = result;
          this.isSearching = false;
          this.lastSearch = inputValue;
        });
  }
  
  /**
   * Adds a user within the selected server document
   * Promise is resolved if update of the recipe went well, rejected if not
   */
  public addUserOnServer(user: User) {
    // Create property update
    let sdbPropertyUpdate = {};
    sdbPropertyUpdate[this.sdbProperty] = firebase.firestore.FieldValue.arrayUnion(user.userId);
    
    // Update on server
    return new Promise<any>((resolve, reject) => {
        firebase.firestore().doc(this.sdbDocNode).update(sdbPropertyUpdate).
          then(function() {
              resolve(user);
          })
          .catch(function(error) {
              reject(error);
          });
      });
  }
  
  /**
   * Removes a user within the selected server document
   * Promise is resolved if update of the recipe went well, rejected if not
   */
  public removeUserOnServer(user: User) {
    // Create property update
    let sdbPropertyUpdate = {};
    sdbPropertyUpdate[this.sdbProperty] = firebase.firestore.FieldValue.arrayRemove(user.userId);
    
    // Update on server
    return new Promise<any>((resolve, reject) => {
        firebase.firestore().doc(this.sdbDocNode).update(sdbPropertyUpdate).
          then(function() {
              resolve(user);
          })
          .catch(function(error) {
              reject(error);
          });
      });
  }

}
