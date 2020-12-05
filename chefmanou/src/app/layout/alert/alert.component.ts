import { Component, OnInit, Output } from '@angular/core';
import { Alert, IAlertProposal } from 'src/app/model/alert.model';
import { AlertService } from 'src/app/layout/services/alert.service';

interface IAlertDisplayStatus{
  transitory: boolean
}

@Component({
  selector: 'alert',
  host: { 
      'class' : 'full hor-center col-dir flex-block'
    },
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  /**
   * Duration, in ms, of the transition animation to display and undisplay the alert
   */
  private ALERT_APPEARANCE_TRANSITION_TIME: number = 200;

  /**
   * Bindable list of displayed alerts
   * Alert are stored in a map so that it is associated to its display status
   */
  public alerts: Map<Alert, IAlertDisplayStatus> = new Map<Alert, IAlertDisplayStatus>();
  
  constructor(
    private alertService: AlertService
  ) {
  }

  ngOnInit(): void {
    // Subscrbe to any alert raised by the Alert service
    this.alertService.alertSubject.subscribe((alert: Alert) => {
      this.onAlert(alert);
    })
  }
  
  /**
   * Behavior when an alert is raised
   */
  public onAlert(alert: Alert){
    
    // Display alert
    this.displayAlert(alert);
    
    // If no proposals, automatically undisplay alerts after a given timeout
    if(alert.proposals.length == 0){
      setTimeout(() =>{
          this.undisplayAlert(alert, this.ALERT_APPEARANCE_TRANSITION_TIME);
        }, 5000)
        
    }
  }
  
  /**
   * Handles click on proposal button of an alert
   */
  public onClickProposal(alert: Alert, proposal: IAlertProposal){
    
    // Emit 'select proposal' event
    this.alertService.selectProposal(alert, proposal);
    
    // Undisplay (after button animation)
    setTimeout(() =>{
          this.undisplayAlert(alert, this.ALERT_APPEARANCE_TRANSITION_TIME);
        }, 100)
  }
  
  /**
   * Display an alert
   */
  public displayAlert(alert:Alert){
    // First put the alert in the map of displayed alert.
    // Display status is initialially set as
    // -Transitory state set to true, so that transition to permanent status acan be performed
    this.alerts.set(alert, {transitory: true});
    
    // 'Display status' is then set:
    // - Transitory: false so that transsition to permanent state can begin
    setTimeout(() =>{
        this.alerts.get(alert).transitory = false;
      }, 100);
  }
  
  /**
   * Undisplay a displayed alert
   */
  public undisplayAlert(alert: Alert, transitionTime: number){
    // Undisplay begins by telling the alert is not in a permanent state anymore (transitory flag set to true)
    this.alerts.get(alert).transitory = true;
    
    // At the end of the transistion, fully undisplay the alert an push it out from the map of displayed alert
    setTimeout(() =>{
        this.alerts.delete(alert);
      }, transitionTime);
        
  }

}
