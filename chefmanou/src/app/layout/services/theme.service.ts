import { Injectable } from '@angular/core';

export interface Theme {
  name: string,
  label: string,
  
  mainBgColor: string,
  mainBgPattern: string,
  elementBgColor: string,
  secondaryBgColor: string,
  menuBgColor: string,
  transparentBgColor: string,
  
  mainContentColor: string,
  secondaryContentColor: string,
  outlineContentColor: string,
  successContentColor: string,
  failureContentColor: string,
  neutralContentColor: string,
  softContentColor: string,
  
  lightShadowColor: string,
  darkShadowColor: string,
  sharpLightShadowColor: string,
  sharpDarkShadowColor: string,
  
  lightDomeColor: string,
  darkDomeColor: string
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private lightTheme: Theme = {
    name: 'light',
    label: 'Light',
    
    mainBgColor: '#e2e9ee',
    mainBgPattern: 'url("./assets/img/food_pattern.png")',
    elementBgColor: '#e2e9ee',
    secondaryBgColor: '#2F7045',
    menuBgColor: '#e2e9ee',
    transparentBgColor: 'rgba(255,255,255,0.4)',
    
    mainContentColor: '#212529',
    secondaryContentColor: 'white',
    outlineContentColor: '#FFA101',
    successContentColor: 'green',
    failureContentColor: 'red',
    neutralContentColor: 'orange',
    softContentColor: '#5b7480',
    
    lightShadowColor: '#ffffff',
    darkShadowColor: '#b5babe',
    sharpLightShadowColor: '#ffffff',
    sharpDarkShadowColor: '#b3b8bc',
    
    lightDomeColor: '#f2f9ff',
    darkDomeColor: '#cbd2d6'
  }
  
  private foodTheme: Theme = {
    name: 'food',
    label: 'Food',
    
    mainBgColor: '#192F01',
    mainBgPattern: 'none',
    elementBgColor: '#192F01',
    secondaryBgColor: '#DED369',
    menuBgColor: '#192F01',
    transparentBgColor: 'rgba(0,0,0,0.3)',
    
    mainContentColor: '#F8EFEA',
    secondaryContentColor: '#212529',
    outlineContentColor: '#E0475B',
    successContentColor: 'green',
    failureContentColor: 'red',
    neutralContentColor: 'orange',
    softContentColor: '#5b7480',
    
    lightShadowColor: '#1E3701',
    darkShadowColor: '#152701',
    sharpLightShadowColor: '#1E3701',
    sharpDarkShadowColor: '#152701',
    
    lightDomeColor: '#1b3201',
    darkDomeColor: '#172a01'
  }
  
  private darkTheme: Theme = {
    name: 'dark',
    label: 'Dark',
    
    mainBgColor: '#31383f',
    mainBgPattern: 'url("./assets/img/food_pattern_dark.png")',
    elementBgColor: '#31383f',
    secondaryBgColor: '#8CBDB9',
    menuBgColor: '#31383f',
    transparentBgColor: 'rgba(0,0,0,0.3)',
    
    mainContentColor: '#F2E9EB',
    secondaryContentColor: '#212529',
    outlineContentColor: '#FFA101',
    successContentColor: 'green',
    failureContentColor: 'red',
    neutralContentColor: 'orange',
    softContentColor: '#5b7480',
    
    lightShadowColor: '#3C444D',
    darkShadowColor: '#262C31',
    sharpLightShadowColor: '#3E474F',
    sharpDarkShadowColor: '#24292F',
    
    lightDomeColor: '#343C43',
    darkDomeColor: '#2C3239'
  }

  /**
   * Predefined themes which can be used via the changedTheme method
   * Initialized at service construction
   */
  public themes: Theme[] = [];
  
  /**
   * Default theme
   */
  public defaultTheme: Theme;
  
  /**
   * Currently applied theme
   */
  public currentTheme: Theme;

  constructor() {
    // Initialize default theme
    this.defaultTheme = this.lightTheme;
    
    // Set current theme at init time
    this.currentTheme = this.defaultTheme;
    
    // Initialized public themes
    this.themes.push(this.lightTheme);
    this.themes.push(this.darkTheme);
    this.themes.push(this.foodTheme);
  }
  
  /**
   * Changes the theme choosing from public theees names
   */
  public changeTheme(themeName: string){
    
    // Check theme is different
    if(this.currentTheme.name !== themeName){
      
      // Retrieve theme
      let theme = this.getTheme(themeName);
      
      if(theme != null){
        
        // Set current theme
        this.currentTheme = theme;
        
        // Apply theme
        this.applyTheme(theme);
      }
    }
  }
  
  /**
   * Applies a theme
   */
  public applyTheme(theme: Theme){
      
    document.documentElement.style.setProperty('--main-bg-color', theme.mainBgColor);
    document.documentElement.style.setProperty('--main-bg-pattern', theme.mainBgPattern);
    document.documentElement.style.setProperty('--element-bg-color', theme.elementBgColor);
    document.documentElement.style.setProperty('--secondary-bg-color', theme.secondaryBgColor);
    document.documentElement.style.setProperty('--menu-bg-color', theme.menuBgColor);
    document.documentElement.style.setProperty('--transparent-bg-color', theme.transparentBgColor);
    
    document.documentElement.style.setProperty('--main-content-color', theme.mainContentColor);
    document.documentElement.style.setProperty('--secondary-content-color', theme.secondaryContentColor);
    document.documentElement.style.setProperty('--outline-content-color', theme.outlineContentColor);
    document.documentElement.style.setProperty('--success-content-color', theme.successContentColor);
    document.documentElement.style.setProperty('--failure-content-color', theme.failureContentColor);
    document.documentElement.style.setProperty('--neutral-content-color', theme.neutralContentColor);
    document.documentElement.style.setProperty('--soft-content-color', theme.softContentColor);
    
    document.documentElement.style.setProperty('--light-shadow-color', theme.lightShadowColor);
    document.documentElement.style.setProperty('--dark-shadow-color', theme.darkShadowColor);
    document.documentElement.style.setProperty('--sharp-light-shadow-color', theme.sharpLightShadowColor);
    document.documentElement.style.setProperty('--sharp-dark-shadow-color', theme.sharpDarkShadowColor);
    
    document.documentElement.style.setProperty('--light-dome-color', theme.lightDomeColor);
    document.documentElement.style.setProperty('--dark-dome-color', theme.darkDomeColor);
  }
  
  /**
   * Gets a registered theme by theme name, null otherwise
   */
  public getTheme(themeName: string): Theme{
    for(let i = 0; i < this.themes.length; i++){
      if(this.themes[i].name === themeName){
        return this.themes[i];
      }
    }
    return null;
  }
}
