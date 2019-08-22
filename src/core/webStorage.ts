const {localStorage, sessionStorage} = window;

const webStorage = {
  local: {
    setItem(itemName: string, itemValue: any) {
      localStorage.setItem(itemName, JSON.stringify(itemValue));
    },
    getItem(itemName: string) {
      let storedValue = localStorage.getItem(itemName);

      storedValue = storedValue ? JSON.parse(storedValue) : null;

      return storedValue;
    },
    removeItem(itemName: string) {
      localStorage.removeItem(itemName);
    }
  },
  session: {
    setItem(itemName: string, itemValue: any) {
      sessionStorage.setItem(itemName, JSON.stringify(itemValue));
    },
    getItem(itemName: string) {
      let storedValue = sessionStorage.getItem(itemName);

      storedValue = storedValue ? JSON.parse(storedValue) : null;

      return storedValue;
    },
    removeItem(itemName: string) {
      sessionStorage.removeItem(itemName);
    }
  },
  getFromWebStorage(itemName: string) {
    let itemValue = webStorage.local.getItem(itemName);

    if (!itemValue) {
      itemValue = webStorage.session.getItem(itemName);
    }

    return itemValue;
  },
  removeFromWebStorage(itemName: string) {
    webStorage.session.removeItem(itemName);
    webStorage.local.removeItem(itemName);
  }
};

export default webStorage;
