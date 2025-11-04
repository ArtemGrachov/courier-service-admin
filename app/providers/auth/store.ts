import { makeAutoObservable } from 'mobx';

export class AuthStore {
  public isAuthorized = false;

  constructor() {
    makeAutoObservable(this);
  }

  public authorize(isAuthorized: boolean) {
    this.isAuthorized = isAuthorized;
  }
}
