import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { TlCommonModule } from '../tl-common/tl-common.module';

import { TlFbaseActiveImageComponent } from './components/tl-fbase-active-image/tl-fbase-active-image.component';
import { TlFbaseButtonTogglerComponent } from './components/tl-fbase-button-toggler/tl-fbase-button-toggler.component';
import { TlFbaseColorPickerComponent } from './components/tl-fbase-color-picker/tl-fbase-color-picker.component';
import { TlFbaseInteractiveInputComponent } from './components/tl-fbase-interactive-input/tl-fbase-interactive-input.component';
import { TlFbaseOutlinedActiveImageComponent } from './components/tl-fbase-outlined-active-image/tl-fbase-outlined-active-image.component';
import { TlFbaseStringPickerComponent } from './components/tl-fbase-string-picker/tl-fbase-string-picker.component';
import { TlFbaseTogglerComponent } from './components/tl-fbase-toggler/tl-fbase-toggler.component';
import { TlFbaseUserPickerComponent } from './components/tl-fbase-user-picker/tl-fbase-user-picker.component';


@NgModule({ 
  declarations: [
    TlFbaseActiveImageComponent,
    TlFbaseButtonTogglerComponent,
    TlFbaseColorPickerComponent,
    TlFbaseInteractiveInputComponent,
    TlFbaseOutlinedActiveImageComponent,
    TlFbaseStringPickerComponent,
    TlFbaseTogglerComponent,
    TlFbaseUserPickerComponent
  ],
  imports: [
    HttpClientModule,
    CommonModule,
    TlCommonModule
  ],
  exports: [
    TlFbaseActiveImageComponent,
    TlFbaseButtonTogglerComponent,
    TlFbaseColorPickerComponent,
    TlFbaseInteractiveInputComponent,
    TlFbaseOutlinedActiveImageComponent,
    TlFbaseStringPickerComponent,
    TlFbaseTogglerComponent,
    TlFbaseUserPickerComponent
  ],
  providers: []
})
export class TlFbaseCommonModule {
}
