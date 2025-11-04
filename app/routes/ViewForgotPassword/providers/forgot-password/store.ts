import { makeAutoObservable } from 'mobx';
import { EStatus } from '~/constants/status';

export class ForgotPasswordStore {
  submitStatus: EStatus = EStatus.INIT;
  submitError: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  public doSubmitInit() {
    this.submitStatus = EStatus.PROCESSING;
    this.submitError = null;
  }

  public doSubmitSuccess() {
    this.submitStatus = EStatus.SUCCESS;
    this.submitError = null;
  }

  public doSubmitError(error?: any) {
    this.submitStatus = EStatus.ERROR;
    this.submitError = error;
  }
}
