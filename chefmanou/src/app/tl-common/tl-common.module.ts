import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';

import { TlActiveImageComponent } from './components/tl-active-image/tl-active-image.component';
import { TlButtonComponent } from './components/tl-button/tl-button.component';
import { TlButtonTogglerComponent } from './components/tl-button-toggler/tl-button-toggler.component';
import { TlCardComponent } from './components/tl-card/tl-card.component';
import { TlColorPickerComponent } from './components/tl-color-picker/tl-color-picker.component';
import { TlHamburgerComponent } from './components/tl-hamburger/tl-hamburger.component';
import { TlIndicatorComponent } from './components/tl-indicator/tl-indicator.component';
import { TlInteractiveInputComponent } from './components/tl-interactive-input/tl-interactive-input.component';
import { TlLoaderComponent } from './components/tl-loader/tl-loader.component';
import { TlMiniatureComponent } from './components/tl-miniature/tl-miniature.component';
import { TlNukiCardComponent } from './components/tl-nuki-card/tl-nuki-card.component';
import { TlOutlinedActiveImageComponent } from './components/tl-outlined-active-image/tl-outlined-active-image.component';
import { TlSearchBarComponent } from './components/tl-search-bar/tl-search-bar.component';
import { TlShapeBlockComponent } from './components/tl-shape-block/tl-shape-block.component';
import { TlSpinnerComponent } from './components/tl-spinner/tl-spinner.component';
import { TlSquareIconComponent } from './components/tl-square-icon/tl-square-icon.component';
import { TlStatefulButtonComponent } from './components/tl-stateful-button/tl-stateful-button.component';
import { TlStepperComponent } from './components/tl-stepper/tl-stepper.component';
import { TlStringPickerComponent } from './components/tl-string-picker/tl-string-picker.component';
import { TlTimelineCardComponent } from './components/tl-timeline-card/tl-timeline-card.component';
import { TlTogglerComponent } from './components/tl-toggler/tl-toggler.component';
import { TlUserMiniatureComponent } from './components/tl-user-miniature/tl-user-miniature.component';
import { TlAlertComponent } from './overlay-components/tl-alert/tl-alert.component';
import { TlMobileMenuComponent } from './overlay-components/tl-mobile-menu/tl-mobile-menu.component';
import { TlDateAgoPipe } from './pipes/tl-date-ago.pipe';
 

@NgModule({ 
  declarations: [
    TlActiveImageComponent,
    TlButtonComponent,
    TlButtonTogglerComponent,
    TlCardComponent,
    TlColorPickerComponent,
    TlHamburgerComponent,
    TlIndicatorComponent,
    TlInteractiveInputComponent,
    TlLoaderComponent,
    TlMiniatureComponent,
    TlNukiCardComponent,
    TlOutlinedActiveImageComponent,
    TlSearchBarComponent,
    TlShapeBlockComponent,
    TlSpinnerComponent,
    TlSquareIconComponent,
    TlStatefulButtonComponent,
    TlStepperComponent,
    TlStringPickerComponent,
    TlTimelineCardComponent,
    TlTogglerComponent,
    TlUserMiniatureComponent,
    TlAlertComponent,
    TlMobileMenuComponent,
    TlDateAgoPipe
  ],
  imports: [
    HttpClientModule,
    CommonModule
  ],
  exports: [
    TlActiveImageComponent,
    TlButtonComponent,
    TlButtonTogglerComponent,
    TlCardComponent,
    TlColorPickerComponent,
    TlHamburgerComponent,
    TlIndicatorComponent,
    TlInteractiveInputComponent,
    TlLoaderComponent,
    TlMiniatureComponent,
    TlNukiCardComponent,
    TlOutlinedActiveImageComponent,
    TlSearchBarComponent,
    TlShapeBlockComponent,
    TlSpinnerComponent,
    TlSquareIconComponent,
    TlStatefulButtonComponent,
    TlStepperComponent,
    TlStringPickerComponent,
    TlTimelineCardComponent,
    TlTogglerComponent,
    TlUserMiniatureComponent,
    TlAlertComponent,
    TlMobileMenuComponent,
    TlDateAgoPipe
  ],
  providers: []
})
export class TlCommonModule {
}
