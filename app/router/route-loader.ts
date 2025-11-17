import { PrevRoute } from '~/router/prev-route';
import { Cache } from '~/cache/Cache';

export default async function routeLoader<T = any>(url: string, loader: () => Promise<T>) {
  const cache = Cache.instance;
  const prevRoute = PrevRoute.instance;
  const isSamePath = prevRoute.comparePath(url);
  const isSameUrl = prevRoute.compareUrl(url);

  const cachedData = cache.get<T>(url);

  if (!isSameUrl && cachedData) {
    prevRoute.updatePath(url);
    return cachedData;
  }

  let result: T;

  try {
    result = await loader();
  } catch (err) {
    if (cachedData) {
      result = cachedData;
    } else if (!isSamePath) {
      throw err;
    }
  }

  cache.set(url, result!);

  return result!;
}
