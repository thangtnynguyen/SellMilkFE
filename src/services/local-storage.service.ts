const LocalStorageService = {

  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  },

  getItem(key: string): any {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  removeItem(key: string): void {
    localStorage.removeItem(key);
  },

  clear(): void {
    localStorage.clear();
  },

  containsKey(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
};

export default LocalStorageService;
