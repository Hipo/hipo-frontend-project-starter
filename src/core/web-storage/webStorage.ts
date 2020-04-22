import {WebStorageStoredValue} from "./webStorageConstants";

const {localStorage, sessionStorage} = window;

const webStorage = {
  local: {
    setItem(itemName: string, itemValue: WebStorageStoredValue) {
      localStorage.setItem(itemName, JSON.stringify(itemValue));
    },
    getItem(itemName: string): WebStorageStoredValue {
      let storedValue = localStorage.getItem(itemName);

      storedValue = storedValue ? JSON.parse(storedValue) : null;

      return storedValue;
    },
    removeItem(itemName: string) {
      localStorage.removeItem(itemName);
    }
  },
  session: {
    setItem(itemName: string, itemValue: WebStorageStoredValue) {
      sessionStorage.setItem(itemName, JSON.stringify(itemValue));
    },
    getItem(itemName: string): WebStorageStoredValue {
      let storedValue = sessionStorage.getItem(itemName);

      storedValue = storedValue ? JSON.parse(storedValue) : null;

      return storedValue;
    },
    removeItem(itemName: string) {
      sessionStorage.removeItem(itemName);
    }
  },
  cookie: {
    getCookie(name: string) {
      const nameEQ = `${name}=`;
      let cookieValue = "";

      document.cookie.split(";").forEach((cookie) => {
        let currentCookie = cookie;

        while (cookie.charAt(0) === " ") {
          currentCookie = currentCookie.substring(1, cookie.length);
        }

        if (currentCookie.indexOf(nameEQ) === 0) {
          cookieValue = currentCookie.substring(nameEQ.length, cookie.length);
        }
      });

      return cookieValue || null;
    },
    deleteCookie(name: string) {
      document.cookie = `${name}=; Max-Age=-99999999;`;
    }
  },
  getFromWebStorage(itemName: string): WebStorageStoredValue {
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
