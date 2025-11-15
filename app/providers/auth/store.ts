import { makeAutoObservable } from 'mobx';

export class AuthStore {
  public isAuthorized = false;
  public isInitialized = false;

  constructor() {
    makeAutoObservable(this);
  }

  public authorize(isAuthorized: boolean) {
    this.isAuthorized = isAuthorized;
  }

  public initialize() {
    this.isInitialized = true;
  }
}
