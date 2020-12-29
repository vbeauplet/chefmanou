import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { TlColorPickerComponent } from '../../../tl-common/components/tl-color-picker/tl-color-picker.component';

import * as firebase from 'firebase';

export interface ColorItem {
  label: string,
  payload: string, // >> Two color items are equals if payload are the same. Paylaod is what is uplaoded on server
  colors: string[]  
}

/**
 * Component to help selection of one or multiple elements among a list of strings
 * If a firestore endpoint is provided, a firestore string attribute or list single selection or not) is consistently updated
 */
@Component({
  selector: 'tl-fbase-color-picker',
  host: { 
    '[class]' : 'this.size + " margined row-dir vert-center flex-block"',
    '[class.hor-left]' : 'this.alignment !== "center"'
    },
  templateUrl: '../../../tl-common/components/tl-color-picker/tl-color-picker.component.html',
  styleUrls: ['../../../tl-common/components/tl-color-picker/tl-color-picker.component.scss']
})
export class TlFbaseColorPickerComponent extends TlColorPickerComponent implements OnInit, OnChanges {

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
   * Event that is raised when a color item is clicked
   * Color item that is clicked is carried by the event
   */
  @Output() clickItem: EventEmitter<ColorItem> = new EventEmitter<ColorItem>();
  
  /**
   * Event that is raised when selection is changed
   * List of all selected items is carried by this event
   */
  @Output() selectItems: EventEmitter<ColorItem[]> = new EventEmitter<ColorItem[]>();
  
  /**
   * Event that is raised when an item is selected
   * Selected item is carried by this event
   */
  @Output() selectItem: EventEmitter<ColorItem> = new EventEmitter<ColorItem>();
  
  /**
   * Event that is raised when an item is unselected
   * Unselected item is carried by this event
   */
  @Output() unselectItem: EventEmitter<ColorItem> = new EventEmitter<ColorItem>();


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
   * Switch selected status of a color item
   *
   * @Override
   */
  protected switchItemStatus(item: ColorItem){
    
    // If only one selection is allowed
    if (this.singleSelection){
      
      // Retrieve selected item
      let selectedItem: ColorItem = {
          payload: 'null',
          label:'',
          colors: []
        };
      if(this.selectedItems.length != 0){
        selectedItem = this.selectedItems[0];
      }
      
      // If item is the selected one
      if (this.checkEquals(selectedItem, item)){
        
        // Unselect it if the 'force 1 selected item' option is not set
        if (!this.forceSelectOne){
          // Empty selected items array
          this.selectedItems = []
          
          // Emit unselectselect item event
          this.unselectItem.emit(item);
          
          // Act on server setting an empty string, if wanted
          if(this.shallActOnServer()){
            this.updateItemOnServer(null);
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
   * Value used for the updated string is the payload of the provided ColorItem
   * Only used if this is a single selection string picker
   */
  private updateItemOnServer(colorItem: ColorItem){
    let that = this;
    
    // Get value to uplaad
    let newValue = '';
    if(colorItem != null){
       newValue = colorItem.payload;
    }
    
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
   * Value used is the payload of the provided ColorItem
   */
  private addItemOnServer(colorItem: ColorItem){
    let that = this;
    
    // Update loading status
    this.loadingStatus = 0;
    
    // Get value to uplaad
    let value = '';
    if(colorItem != null){
       value = colorItem.payload;
    }
    
    // Create property update
    let sdbPropertyUpdate = {};
    sdbPropertyUpdate[this.sdbProperty] = firebase.firestore.FieldValue.arrayUnion(value);
    
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
   * Value to remove is the payload of the provided ColorItem
   */
  private removeItemOnServer(colorItem: ColorItem) {
    let that = this;
    
    // Update loading status
    this.loadingStatus = 0;
    
    // Get value to uplaad
    let value = '';
    if(colorItem != null){
       value = colorItem.payload;
    }
    
    // Create property update
    let sdbPropertyUpdate = {};
    sdbPropertyUpdate[this.sdbProperty] = firebase.firestore.FieldValue.arrayRemove(value);
    
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
