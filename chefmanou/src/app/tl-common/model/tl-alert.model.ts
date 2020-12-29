import { ITlAlertProposal } from '../interfaces/tl-alert-proposal.interface'

export class TlAlert{
  
  /**
   * Unique ID of the alert
   */
  public id: string = '';
  
  /**
   * Message
   */
  public message: string = '';
  
  /**
   * Alert custom object, if any
   */
  public customObject: any = null;
  
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
  public proposals: ITlAlertProposal[] = [];
  
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