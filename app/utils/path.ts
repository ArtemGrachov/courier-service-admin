export const getPathFromUrl = (fullPath: string) => {
  const url = new URL(fullPath);
  return url.pathname;
}

export const comparePaths = (urlA: string, urlB: string) => {
  const pathA = getPathFromUrl(urlA);
  const pathB = getPathFromUrl(urlB);

  return pathA === pathB;
}

