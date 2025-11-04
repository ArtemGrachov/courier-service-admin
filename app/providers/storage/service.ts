export const useStorageService = () => {
  const setItem = (key: string, content: string) => {
    localStorage.setItem(key, content);
  }

  const getItem = <T = any, >(key: string): T | null => {
    return localStorage.getItem(key) as T | null;
  }

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  }

  const setItemJSON = (key: string, content: any, throwError = false) => {
    try {
      setItem(key, JSON.stringify(content));
    } catch (err) {
      if (throwError) {
        throw err;
      }
    }
  }

  const getItemJSON = <T = any, >(key: string, throwError = false): T | null => {
    try {
      const raw = getItem<string>(key);

      if (raw == null) {
        return raw;
      }

      const result = JSON.parse(raw);
      return result;
    } catch (err) {
      if (throwError) {
        throw err;
      }

      return null;
    }
  }

  return {
    setItem,
    getItem,
    removeItem,
    setItemJSON,
    getItemJSON,
  };
}
