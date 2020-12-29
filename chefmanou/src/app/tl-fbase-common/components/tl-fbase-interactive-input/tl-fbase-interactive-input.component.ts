import { Component, OnInit, Input, Output } from '@angular/core';

import { EventEmitter } from '@angular/core';

import { TlInteractiveInputComponent } from '../../../tl-common/components/tl-interactive-input/tl-interactive-input.component';

import * as firebase from 'firebase';

/**
 * @author vbeauplet
 */
@Component({
  selector: 'tl-fbase-interactive-input',
  host: {
      '[class]' : 'this.size + " row-dir vert-center flex-block"'
    },
  templateUrl: '../../../tl-common/components/tl-interactive-input/tl-interactive-input.component.html',
  styleUrls: ['../../../tl-common/components/tl-interactive-input/tl-interactive-input.component.scss']
})
export class TlFbaseInteractiveInputComponent extends TlInteractiveInputComponent implements OnInit {

  /**
   * Target SDB Document Node for the property to be updated on server.
   * Can be let undocumented if update on server is not wanted
   */
  @Input() sdbDocNode: string = '';
  
  /**
   * Target SDB property to be updated on server, for the provided document node.
   * Can be let undocumented if update on server is not wanted
   */
  @Input() sdbProperty: string = '';
  
  /**
   * Enable search term update corresponding to the sdbPropery
   * If value provided via input as sdbProperty if "SamPle", 
   * search term is uploaded as sdbProperty + 'SearchTerm' with value sample
   *
   * Using 'search term' corresponding to a property eases search request if property value is made of 1 word
   */
  @Input() enableSearchTermUpdate: boolean = false;
  
  /**
   * Enable search terms array update corresponding to the value
   * If the uploaded value corresponding to sdbProperty is 'Lemon Pie', search terms to be uploaded are 'lemon' and 'pie'.
   * If this input is set to true, these search terms are uploaded as an array in the sdbProperty + 'SearchTerms' attribute of the document
   *
   * Using 'search terms' corresponding to a property eases search request if property value is made of multiple words
   */
  @Input() enableSearchTermsUpdate: boolean = false
  
  /**
   * Output event for the component: change value
   * New value is the carried payload
   */
  @Output() changeValue: EventEmitter<string> = new EventEmitter<string>();
  
  /**
   * Output event for the component:
   * On success (loading on SDB is done and it is a success)
   */
  @Output() success: EventEmitter<any> = new EventEmitter();

  constructor() {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
  
  /**
   * Triggered blurring input. Shall emit the blur event of the component with the input content, 
   * if this content is not null nore empty
   *
   * @Override
   */
  public onBlurInput(event: any){
    let inputValue: string = event.srcElement.value;
    
    // Tell inut is not on focus anymore
    this.inputInFocus = false;
    
    // Emit blur event
    if(inputValue != null && inputValue != ""){
      this.changeValue.emit(inputValue);
    }
    
    if (inputValue != '') {
      // Update value on SDB at provided node, if any
      if (this.sdbDocNode !== '') {
        let that = this;
        that.sdbLoadingStatus = 0;
        
        setTimeout(() => {
          
          let sdbPropertyUpdate = {};
          sdbPropertyUpdate[this.sdbProperty] = inputValue;
          if(this.enableSearchTermUpdate) {
            sdbPropertyUpdate[this.sdbProperty + 'SearchTerm'] = inputValue.toLowerCase();
          }
          if(this.enableSearchTermsUpdate) {
            sdbPropertyUpdate[this.sdbProperty + 'SearchTerms'] = this.computeSearchTerms(inputValue);
          }
          firebase.firestore().doc(this.sdbDocNode).update(sdbPropertyUpdate)
            .then(function() {
                // Continue and set miniature URL
                that.sdbLoadingStatus = 1;
                
                // Emit the success event
                that.success.emit(inputValue);
                
                // Release status after the 3 second validation time span
                setTimeout(() => {
                  that.sdbLoadingStatus = -1;
                }, 3000);
              })
            .catch(function(error) {
                // If any, notify failure to user
                that.sdbLoadingStatus = 2;
              });

          }, 1000);
      }
    }
  }
  
  /**
   * Handles the click on the edit markup when loading
   */
  public onClickEditMarkupWhenLoading(id:string){
    // Do nothing
  }
  
  public computeSearchTerms(value: string): string[] {
    let result: Set<string> = new Set<string>();
    
    // Push splitted terms
    let splittedValues = value.split(' ');
    for(let splittedValue of splittedValues){
      result.add(splittedValue.toLowerCase());
    }
    
    // Push full term
    result.add(value.toLowerCase());
        
    // Push all substrings of the search terms
    let substrings: string[] = []
    for(let searchTerm of result){
      if(searchTerm.length > 2){
        for(let i = 2; i < searchTerm.length; i++){
          substrings.push(searchTerm.substring(0, i).toLowerCase());
        }
      }
    }
    for(let substring of substrings){
      result.add(substring.toLowerCase());
    }
    return [...result.values()];
  }

}
