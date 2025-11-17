import { comparePaths } from '~/utils/path';

export class PrevRoute {
  private static _instance: PrevRoute;

  private _path: string | null = null;

  private constructor() {}

  public static get instance(): PrevRoute {
    if (!PrevRoute._instance) {
      PrevRoute._instance = new PrevRoute();
    }

    return PrevRoute._instance;
  }

  public updatePath(path: string) {
    this._path = path;
  }

  public comparePath(path: string) {
    if (this._path == null) {
      return false;
    }

    return comparePaths(path, this._path);
  }

  public compareUrl(url: string) {
    return url === this._path;
  }
}

