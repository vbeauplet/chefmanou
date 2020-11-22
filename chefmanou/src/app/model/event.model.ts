/**
 * Defines an event structure
 */
export class Event {
  
  /**
   * Unique ID of the event
   */
  public id: string = '';
  
  /**
   * Code which determines the event type
   * Mapping:
   * - 700: Recipe Creation by cooker
   * - 701: Recipe Creation by self
   * - 702: Recipe Modification by cooker
   * - 703: Recipe modification by self
   * - 704: Self Recipe added as favorite by cooker
   * - 705: Self follow a new cooker
   * - 706: Cooker is following self
   * - 707: Comment added on selef recipe
   * - 708: Comment added by self
   * - 709: Cooker profile update
   * - 710: Self profile update
   * - 711: Self account creation
   */
  public code: number = 700;
  
  /**
   * Event time
   */
  public time: number = 0;
  
  /**
   * If needed, reference to a user concerned by the event
   * Meaning depends on event type
   */
  public userRef: string = '';
  
  /**
   * If needed, reference to a recipe concerned by the event
   * Meaning depends on event type
   */
  public recipeRef: string = '';
  
  /**
   * Additionnal message carried by the event
   * Meaning depends on event type
   */
  public message: string = '';
  
  /**
   * Creates an event object
   */
  constructor(){
  }
  
  /**
   * Initialize an event with a unique ID and setting its time to current date
   */
  public init(){
    this.id = new Date().getTime() + '';
    this.time = Date.now();
  }
}


export const eventConverter = {
    toFirestore: function(event: any) {
        return {
            id: event.id,
            code: event.code,
            time: event.time,
            userRef: event.userRef,
            recipeRef: event.recipeRef,
            message: event.message,
          }
    },
    fromFirestore: function(snapshot: any, options: any){
        const data = snapshot.data(options);
        
        // Create corresponding object
        let event = new Event();
        
        // Event attributes
        event.id = data.id;
        event.code = data.code;
        event.time = data.time;
        event.userRef = data.userRef;
        event.recipeRef = data.recipeRef;
        event.message = data.message;
        
        return event;
    }
}