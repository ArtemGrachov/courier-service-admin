import { makeAutoObservable } from 'mobx';

import { EStatus } from '~/constants/status';

import type { IGetClientsResponse } from '~/types/api/clients';

export interface IClientsStoreData {
  getStatus: EStatus;
  getError: any;
  data: IGetClientsResponse | null;
}

export class ClientsStore implements IClientsStoreData {
  getStatus: EStatus = EStatus.INIT;
  getError: any = null;
  data: IGetClientsResponse | null = null;

  constructor(initialData?: IClientsStoreData) {
    if (initialData) {
      Object.assign(this, initialData);
    }

    makeAutoObservable(this);
  }

  public setData(data: Partial<IClientsStoreData>) {
    if (data.getStatus === EStatus.ERROR) {
      delete data.data;
    }

    Object.assign(this, data);
  }

  public doGetInit() {
    this.getStatus = EStatus.PROCESSING;
  }

  public doGetSuccess(data: IGetClientsResponse) {
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

  public get isSuccess() {
    return this.getStatus === EStatus.SUCCESS;
  }

  public get isError() {
    return this.getStatus === EStatus.ERROR;
  }
}
