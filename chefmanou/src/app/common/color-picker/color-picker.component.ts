import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';

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
  selector: 'color-picker',
  host: { 
    '[class]' : 'this.size + " margined row-dir vert-center flex-block"',
    '[class.hor-left]' : 'this.alignment !== "center"'
    },
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit, OnChanges {

  /**
   * Size of the Color Picker container block. Full by default
   */
  @Input() size: string = 'full';
  
  /**
   * Size of the color items circles, in px
   * 50 by default
   */
  @Input() colorCircleSize: number = 50;
  
  /**
   * Margin between each color items of the color picker, in px
   */
  @Input() elementMargin: number = 6;
  
  /**
   * Alignment of the proposals. May be 'left' or 'center' (default)
   */
  @Input() alignment: string = 'center';
  
  /**
   * Tells if status spinner (for loading status) shall be displayed
   */
  @Input() displayStatusSpinner = false;
  
  /**
   * Tells if only one color item can be selected
   * True by default
   */
  @Input() singleSelection: boolean = true;
  
  /**
   * Only matters if the color picker runs in single selection mode
   * If this option is set to true and single selection too, selcted item cannot be unselected
   * At any time, there will be only one selected item
   * False by default
   */
  @Input() forceSelectOne: boolean = true;
  
  /**
   * List of all initial color items among which to select
   * Mandatory, empty by default
   */
  @Input() initialItems: ColorItem[] = [];
  
  /**
   * List of initially selected color items
   */
  @Input() initialSelectedItems: ColorItem[] = [];
  
  /**
   * Synchronize selected items with initial selected items input
   * It means if true anytime table provided as initialSelectedItems changes,
   * table of component selected item is updated accordingly.
   *
   * If false, initialSelectedItems are copied only once at component initialization and compoennt lives its life afterward
   *
   * False by default
   */
  @Input() synchrone: boolean = false;
  
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
  
  /**
   * Bindable list of items
   */
  public items: ColorItem[] = [];
  
  /**
   * Bindable selected items
   */
  public selectedItems: ColorItem[] = [];
  
  /**
   * Loading status of the spinner, telling if operations are running on server
   */
  public loadingStatus: number = -1;

  constructor() { }

  ngOnInit(): void {
    // Set initial items
    this.items = [...this.initialItems];
    
    // Set selected items
    this.refreshFromInitialSelectedItems();
  }
  
  ngOnChanges(): void {
    // React to any change on initial selected items only if component is synchrone
    if(this.synchrone){
      this.refreshFromInitialSelectedItems();
    }
  }
  
  /**
   * Refreshes / Resets component from current value of the initialSelectedUsers value  
   */
  public refreshFromInitialSelectedItems() {
    this.selectedItems = [...this.initialSelectedItems];
  }
  
  /**
   * Handle click on a proposed item
   */
  public onClickItem(item: ColorItem){
    // Emit the clickItem event
    this.clickItem.emit(item);
    
    // Switch color item status: if selected, unselect it; if not select it
    this.switchItemStatus(item);
    
    // Emit the selctItems event
    this.selectItems.emit(this.selectedItems);
  }
  
  /**
   * Switch selected status of a color item
   */
  private switchItemStatus(item: ColorItem){
    
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
  
  /**
   * Check if 2 color items are equals
   * ColorItems are equal if payload are equals
   */
  public checkEquals(item1: ColorItem, item2: ColorItem): boolean{
    return item1.payload === item2.payload;
  }
  
  /**
   * Check if a color item list includes a color item
   */
  public checkIncludes(itemList: ColorItem[], item: ColorItem): boolean{
    for (let i = 0; i < itemList.length; i++) {
      if(this.checkEquals(itemList[i], item)){
        return true;
      }
    }
    return false;
  }

}
