import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'search-bar',
  host: { 
    '[class]' : 'this.size + " row-dir hor-space-between flex-block"'
    },
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  /**
   * Size of the search bar container. Full (100%) by default
   */
  @Input() size: string = 'full';
  
  /**
   * Search bar input placeholder
   */
  @Input() placeholder: string = 'Rechercher';
  
  
  /**
   * Unique ID (displayed on the page) of the searchbar. Shall be provided if multiple searchbars are displayed
   */
  @Input() searchBarUniqueId: string = 'searchbar';
  
  /**
   * Output event which is emitted in case a new search has been asked by search-bar
   * Payload of the event is the search input content
   */
  @Output() searchValue: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }


  /**
   * Handle press enter button on search-bar input
   */
  public onPressEnter(searchValue: string) {
    this.emitSearchEvent(searchValue);
  }
  
  /**
   * Handle click on the search button
   */
  public onClickSearchButton() {
    let searchInput: any = document.getElementById(this.searchBarUniqueId);
    this.emitSearchEvent(searchInput.value);
  }
  
  /**
   * Emits the search event
   */
  private emitSearchEvent(value: string){
    this.searchValue.emit(value);
  }
}
