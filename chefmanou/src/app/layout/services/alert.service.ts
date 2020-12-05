import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';
import { Alert, IAlertProposal } from 'src/app/model/alert.model';

/**
 * Gathers all services related to alert handling
 */
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  /**
   * Bindable list of alerts
   */
  public alerts: Alert[] = [];

  /**
   * The Alert subject, in order to inform all related components and services when an alert is raised
   */
  public alertSubject: Subject<Alert> = new Subject<Alert>();
  
  /**
   * The Alert Response subject, in order to inform all subscribers that a response to an alert has been provided
   * In this case, payload is the alert with its response set
   */
  public alertResponseSubject: Subject<Alert> = new Subject<Alert>();

  /**
   * Bindable number of alerts
   */
  public alertNumber: number = 0;

  constructor() {
  }

  /**
   * Raises an info alert
   */
  public raiseInfo(message: string){
    let alert = new Alert();
    alert.date = Date.now();
    alert.message = message;
    alert.severity = 1;
    this.alert(alert);
  }
  
  /**
   * Raises a warning alert
   */
  public raiseWarning(message: string){
    let alert = new Alert();
    alert.date = Date.now();
    alert.message = message;
    alert.severity = 2;
    this.alert(alert);
    
  }
  
  /**
   * Raises an error alert
   */
  public raiseError(message: string){
    let alert = new Alert();
    alert.date = Date.now();
    alert.message = message;
    alert.severity = 3;
    this.alert(alert);
    
  }
  
  /**
   * Raises a confirmation alert
   * Returns a promise which carries user response as potential payload
   */
  public raiseConfirmationAlert(message: string, severity: number, id?:string): Promise<string>{
    let alert = new Alert();
    if(id != undefined){
      alert.id = id;
    }
    alert.date = Date.now();
    alert.message = message;
    alert.severity = severity;
    alert.proposals = [
        {
          name: 'accept',
          icon: 'W',
          color: 'success',
          label: ''
        },
        {
          name: 'decline',
          icon: 'X',
          color: 'failure',
          label: ''
        }
      ];
    this.alert(alert);
    return this.waitResponse(alert.id);
  }
  
  /**
   * Raises a decision alert, with multiple custom proposals
   * Returns a promise which carries user response as potential payload
   */
  public raiseDecisionAlert(message: string, proposals: IAlertProposal[], severity: number, id?:string): Promise<string>{
    let alert = new Alert();
    if(id != undefined){
      alert.id = id;
    }
    alert.date = Date.now();
    alert.message = message;
    alert.severity = severity;
    alert.proposals = proposals;
    this.alert(alert);
    return this.waitResponse(alert.id);
  }

  /**
   * Raises an alert
   */
  public alert(alert: Alert) {
    this.alerts.unshift(alert);
    this.alertNumber++;
    this.emitAlertSubject(alert);
  }
  
  /**
   * Sets the alert response to the chosen proposal name
   * and emit the alertResponse subject with the alert as payload
   */
  public selectProposal(alert: Alert, proposal: IAlertProposal){
    alert.response = proposal.name;
    this.emitAlertResponseSubject(alert);
  }
  
  /**
   * Wait for a given alert response
   * Retuns a promise carrying the response as payload
   */
  public waitResponse(alertId: string): Promise<string>{
    return new Promise<string>((resolve) => {
        let responseSubscription = this.alertResponseSubject.subscribe((alert: Alert) => {
          if(alert.id === alertId){
            
            // Resolve response
            resolve(alert.response);
            
            // Unsubscribe, as alert has been answered
            responseSubscription.unsubscribe();
          }
        });
      });
    
  }

  /**
   * Resets the alert service
   */
  public reset() {
    this.alertNumber = 0;
    this.alerts = [];
  }
  
  
  
  /**
   * Emit the Alert subject, in order to infom (and let suscribe) components and services
   * that uses the Alert Service that an Alert has been raised
   */
  private emitAlertSubject(alert: Alert) {
    this.alertSubject.next(alert);
  }
  
  /**
   * Emit the Alert subject, in order to infom (and let suscribe) components and services
   * that uses the Alert Service that an Alert has been raised
   */
  private emitAlertResponseSubject(alert: Alert) {
    this.alertResponseSubject.next(alert);
  }
}

