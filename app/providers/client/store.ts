import { makeAutoObservable } from 'mobx';

import { EStatus } from '~/constants/status';

import type { IGetClientResponse } from '~/types/api/clients';


export interface IClientStoreData {
  getStatus: EStatus;
  getError: any;
  data: IGetClientResponse | null;
}

export class ClientStore implements IClientStoreData {
  getStatus: EStatus = EStatus.INIT;
  getError: any = null;
  data: IGetClientResponse | null = null;

  constructor(initialData?: IClientStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public doGetInit() {
    this.getStatus = EStatus.PROCESSING;
  }

  public doGetSuccess(data: IGetClientResponse) {
    this.getStatus = EStatus.SUCCESS;
    this.getError = null;
    this.data = data;
  }

  public doGetError(error?: any) {
    this.getStatus = EStatus.ERROR;
    this.getError = error;
  }

  public get isProcessing() {
    return this.getStatus === EStatus.PROCESSING;
  }

  public get isSuccess(){
    return this.getStatus === EStatus.SUCCESS;
  }

  public get isError(){
    return this.getStatus === EStatus.ERROR;
  }
}
