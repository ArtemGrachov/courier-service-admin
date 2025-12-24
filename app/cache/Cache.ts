interface ICacheRecord<T = any> {
  data: T;
  lifetime?: number;
  timestamp: number;
}

export class Cache {
  private static _instance: Cache;

  public static readonly DEFAULT_LIFETIME_MS = 30000;

  private _cacheData = new Map<any, ICacheRecord>();

  private constructor() {}

  public static get instance(): Cache {
    if (!Cache._instance) {
      Cache._instance = new Cache();
    }

    return Cache._instance;
  }

  public get<T = any>(key: any) {
    const record = this._cacheData.get(key);

    if (!record) {
      return null;
    }
  
    const currentTime = new Date().getTime();

    if (currentTime - record.timestamp > (record.lifetime ?? Cache.DEFAULT_LIFETIME_MS)) {
      return null;
    }

    return record.data as T;
  }

  public set(key: any, data: any, lifetime?: number) {
    const record: ICacheRecord = {
      data,
      lifetime,
      timestamp: new Date().getTime(),
    };

    this._cacheData.set(key, record);
  }

  public clear(key?: any) {
    if (key) {
      this._cacheData.delete(key);
      return;
    }

    this._cacheData.clear();
  }
}

