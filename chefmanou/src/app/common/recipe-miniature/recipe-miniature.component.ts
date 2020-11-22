import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Recipe } from 'src/app/model/recipe.model';
import { MiniatureComponent } from '../miniature/miniature.component';

@Component({
  selector: 'recipe-miniature',
  host: { 
      '[class]' : 'this.size + " " + this.miniatureStyle + " clickable hor-space-between row-dir container-block"',
      '[class.margined]' : 'this.margined',
    },
  templateUrl: './recipe-miniature.component.html',
  styleUrls: [
    './recipe-miniature.component.scss',
    '../miniature/miniature.component.scss']
})
export class RecipeMiniatureComponent extends MiniatureComponent implements OnInit {

  /**
   * Recipe input, mandatory
   */
  @Input() recipe: Recipe;

  /**
   * Event to emit when a tag is clicked
   * Carried payload is the clicked tag string
   */
  @Output() clickTag: EventEmitter<string> = new EventEmitter<string>();
  
  constructor() {
    super();
  }

  ngOnInit(): void {
  }
  
  /**
   * Handes click on tag
   */
  public onClickTag(tag: string){
    this.clickTag.emit(tag);
  }

}
