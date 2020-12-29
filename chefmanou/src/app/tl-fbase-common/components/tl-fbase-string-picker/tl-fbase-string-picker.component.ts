import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

import { TlStringPickerComponent } from '../../../tl-common/components/tl-string-picker/tl-string-picker.component';

import * as firebase from 'firebase';

/**
 * Component to help selection of one or multiple elements among a list of strings
 * If a firestore endpoint is provided, a firestore string attribute or list single selection or not) is consistently updated
 *
 * @author vbeauplet
 */
@Component({
  selector: 'tl-fbase-string-picker',
  host: { 
    '[class]' : 'this.size + " margined row-dir vert-center flex-block"',
    '[class.hor-left]' : 'this.alignment !== "center"'
    },
  templateUrl: '../../../tl-common/components/tl-string-picker/tl-string-picker.component.html',
  styleUrls: ['../../../tl-common/components/tl-string-picker/tl-string-picker.component.scss']
})
export class TlFbaseStringPickerComponent extends TlStringPickerComponent implements OnInit, OnChanges {

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
   * Event that is raised when an item is clicked
   * String that is clicked is carried by the event
   */
  @Output() clickItem: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Event that is raised when selection is changed
   * List of all selected items is carried by this event
   */
  @Output() selectItems: EventEmitter<string[]> = new EventEmitter<string[]>();
  
  /**
   * Event that is raised when an item is selected
   * Selected item is carried by this event
   */
  @Output() selectItem: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Event that is raised when an item is unselected
   * Unselected item is carried by this event
   */
  @Output() unselectItem: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Event that is raised when an item is created
   */
  @Output() createItem: EventEmitter<string> = new EventEmitter<string>();

  constructor() {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  
  ngOnChanges(): void {
    super.ngOnChanges();
  }
  
  /**
   * Switch selected status of an item
   *
   * @Override
   */
  protected switchItemStatus(item: string){
    
    // If only one selection is allowed
    if (this.singleSelection){
      
      // Retrieve selected item
      let selectedItem = '';
      if(this.selectedItems.length != 0){
        selectedItem = this.selectedItems[0];
      }
      
      // If item is the selected one
      if (selectedItem === item){
        
        // Unselect it if the 'force 1 selected item' option is not set
        if (!this.forceSelectOne){
          // Empty selected items array
          this.selectedItems = []
          
          // Emit unselectselect item event
          this.unselectItem.emit(item);
          
          // Act on server setting an empty string, if wanted
          if(this.shallActOnServer()){
            this.updateItemOnServer('');
          }
        }
        
        // If not, do nothing
        
      }
      
      // If the item was not the selected one
      else {
        // Update selected array with the new item
        this.selectedItems = [item]
        
        // Emit select item event
        this.selectItem.emit(item);
        
        // Update on server if wanted
        if(this.shallActOnServer()){
          this.updateItemOnServer(item);
        }
      }
    }
    
    // Else if multiple selections are allowed
    else{
      
      // If item is selected, unselect it
      if (this.selectedItems.includes(item)){
        const index = this.selectedItems.indexOf(item);
        this.selectedItems.splice(index, 1);
        
        // Emit unselect item event
        this.unselectItem.emit(item);
        
        // Removes on server is wanted
        if(this.shallActOnServer()){
          this.removeItemOnServer(item);
        }
        
      }
      
      // Else if item is not, select it
      else {
        this.selectedItems.push(item);
        
        // Emit select item event
        this.selectItem.emit(item);
        
        // Add or update items on server if wanted
        if(this.shallActOnServer()){
          this.addItemOnServer(item);
        }
      }
      
    }
  }
  
  /**
   * Tells if component shall act directly on server
   */
  private shallActOnServer(){
    return this.sdbDocNode !== '' && this.sdbProperty != '';
  }
  
  /**
   * Updates a string attribute on server at the povided string attribute node.
   * Only used if this is a single selection string picker
   */
  private updateItemOnServer(newValue: string){
    let that = this;
    
    // Update loading status
    this.loadingStatus = 0;
    
    // Create property update
    let sdbPropertyUpdate = {};
    sdbPropertyUpdate[this.sdbProperty] = newValue;
    
    firebase.firestore().doc(this.sdbDocNode).update(sdbPropertyUpdate).
      then(function() {
          // Tell it is ok
          that.loadingStatus = 1;
          
          // Release status after the 3 second validation time span
          setTimeout(() => {
              that.loadingStatus = -1;
            }, 3000);
      })
      .catch(function() {
          // Tell it is nok
          that.loadingStatus = 2;
          
          // Release status after the 3 second validation time span
          setTimeout(() => {
              that.loadingStatus = -1;
            }, 3000);
      });
  }
  
  /**
   * Adds an item string on server at the povidedstring list node
   */
  private addItemOnServer(item: string){
    let that = this;
    
    // Update loading status
    this.loadingStatus = 0;
    
    // Create property update
    let sdbPropertyUpdate = {};
    sdbPropertyUpdate[this.sdbProperty] = firebase.firestore.FieldValue.arrayUnion(item);
    
    firebase.firestore().doc(this.sdbDocNode).update(sdbPropertyUpdate).
      then(function() {
          // Tell it is ok
          that.loadingStatus = 1;
          
          // Release status after the 3 second validation time span
          setTimeout(() => {
              that.loadingStatus = -1;
            }, 3000);
      })
      .catch(function() {
          // Tell it is nok
          that.loadingStatus = 2;
          
          // Release status after the 3 second validation time span
          setTimeout(() => {
              that.loadingStatus = -1;
            }, 3000);
      });
  }
  
  /**
   * Removes an item string on server at the povidedstring list node
   */
  private removeItemOnServer(item: string) {
    let that = this;
    
    // Update loading status
    this.loadingStatus = 0;
    
    // Create property update
    let sdbPropertyUpdate = {};
    sdbPropertyUpdate[this.sdbProperty] = firebase.firestore.FieldValue.arrayRemove(item);
    
    firebase.firestore().doc(this.sdbDocNode).update(sdbPropertyUpdate).
      then(function() {
          // Tell it is ok
          that.loadingStatus = 1;
          
          // Release status after the 3 second validation time span
          setTimeout(() => {
              that.loadingStatus = -1;
            }, 3000);
      })
      .catch(function() {
          // Tell it is nok
          that.loadingStatus = 2;
          
          // Release status after the 3 second validation time span
          setTimeout(() => {
              that.loadingStatus = -1;
            }, 3000);
      });
  }

}
