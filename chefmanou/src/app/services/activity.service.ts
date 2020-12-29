import { Injectable } from '@angular/core';
import { EventService } from './event.service';
import { ProfileService } from './profile.service';
import { Profile } from '../model/profile.model';

import { Event } from "../model/event.model";

import * as firebase from 'firebase';
import { eventConverter } from '../model/event.model';

import { TlAlertService } from '../tl-common/services/tl-alert.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  /**
   * Bindable list of events (to be displayed in an activity feed)
   */
  public events: Event[] = [];

  /**
   * Reference to the firestore collection gathering all events for the currently connected user
   */
  public eventCollectionRef: string = '';
  
  /**
   * Currently connected user ID
   */
  public connectedUserRef: string = '';
  
  /**
   * Observation unsubscription to a new event
   */
  private newEventObservationUnsubscription = null;
  
  /**
   * Tells if the activity service is loaded, which mean all bindable events are loaded
   */
  public isLoaded: boolean = false;

  constructor(
      private alertService: TlAlertService,
      private eventService: EventService,
      private profileService: ProfileService
    ) {
    
    // Subscribe to any profile change so that, if connected user change, activity feed is reloaded
    this.profileService.profileSubject.subscribe((profile: Profile) => {
        if(this.profileService.isLoaded && profile.user.userId != this.connectedUserRef){
          
          // Refresh service
          this.refresh();
        }
      });
      
    // If possible initially refresh service
    if(this.profileService.isLoaded){
      this.refresh();
    }
  }
  
  /**
   * Refreshes the actiivty service, reloading all latest events of interest for the connected user
   * May be called at init, manually, or when connected user changes
   */
  public refresh(){
    
    // If any, stop latest observation to new event
    if(this.newEventObservationUnsubscription != null){
      this.newEventObservationUnsubscription();
    }
    
    // Set connected user and compute event collection ref
    this.connectedUserRef = this.profileService.profile.user.userId
    this.eventCollectionRef = this.eventService.computeEventCollectionRef(this.connectedUserRef);
    
    // Load 10 latest events
    this.load(10);
    
    // Observe for any new event, after a 2s timeout
    setTimeout(() => {
      this.observeNewEvent();
    }, 2000);
  }
  
  /**
   * Loads a given amount of events (latest ones) within the activity bindable list of events
   */
  public load(numberOfEvents: number){
    
    // Tell service is not loaded anymore
    this.isLoaded = false;
    this.events = [];
    
    // Load from database
    let that = this;
    let counter = 0;
    firebase.firestore().collection(this.eventCollectionRef)
      .orderBy('time', 'desc')
      .limit(numberOfEvents)
      .withConverter(eventConverter)
      .get()
      .then(function(querySnapshot) { 
          querySnapshot.forEach(function(doc) {            
            counter++;
            
            // Get event from snapshot
            const event: Event = doc.data();
            
            // Launch event resolution
            that.eventService.resolveEvent(event);
            
            // Add to events list
            that.events.push(event);
            
            // At the end of the query execution, tell it is loaded
            if(counter === querySnapshot.size){
              that.isLoaded = true;
            }
          });
      });
  }
  
  /**
   * Listens for any new events that may occur during activity service running time
   */
  public observeNewEvent(){
  
    // Load from database
    let that = this;
    this.newEventObservationUnsubscription = firebase.firestore().collection(this.eventCollectionRef)
      .orderBy('time', 'desc')
      .limit(1)
      .withConverter(eventConverter)
      .onSnapshot(function(querySnapshot) { 
          querySnapshot.forEach(function(doc) {
            
            // Get new event from snapshot
            const event: Event = doc.data();
            
            if(!that.containsEvent(event)){
              
              that.alertService.raiseCustomObjectAlert(event, [], 1);
              
              // Launch event resolution
              that.eventService.resolveEvent(event);
              
              // Add to events list
              that.events.unshift(event);
            }
            
          });
      });
  }
  
  /**
   * Resets the activity service
   */
  public reset(){
    this.events = [];
    this.eventCollectionRef = '';
    this.connectedUserRef = '';
  }
  
  /**
   * Tells if acitivity service event collection already contains the provided event
   */
  private containsEvent(event: Event){
    for(let registeredEvent of this.events){
      if(event.id === registeredEvent.id){
        return true;
      }
    }
    return false;
  }
  
}
