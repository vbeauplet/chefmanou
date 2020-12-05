export interface IAlertProposal{
  name: string,
  icon: string,
  color:string,
  label: string
}

export class Alert{
  
  /**
   * Unique ID of the alert
   */
  public id: string = '';
  
  /**
   * Message
   */
  public message: string = '';
  
  /**
   * Severity of the alert message
   * 1: info
   * 2: warning
   * 3: error
   */
  public severity: number = 0;
  
  /**
   * Proposals that may (shall?) be clicked by user
   */
  public proposals: IAlertProposal[] = [];
  
  /**
   * Time of the alert
   */
  public date: number = 0;
  
  /**
   * Finally selected proposal, if any
   */
  public response: string = '';
  
  
  constructor(){
    this.id = Date.now() + '';
  }
  
}