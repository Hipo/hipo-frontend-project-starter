import webStorage from "../../core/web-storage/webStorage";
import {WEB_STORAGE_KEY} from "../../core/web-storage/webStorageConstants";

type AuthenticationToken = string | null;

const authenticationManager = {
  token: webStorage.getFromWebStorage(
    WEB_STORAGE_KEY.AUTHENTICATION_TOKEN
  ) as AuthenticationToken,

  getToken() {
    return this.token;
  },

  updateToken(token: AuthenticationToken, shouldPersistToLocalStorage?: boolean) {
    this.token = token;

    if (token) {
      if (shouldPersistToLocalStorage) {
        webStorage.local.setItem(WEB_STORAGE_KEY.AUTHENTICATION_TOKEN, token);
      } else {
        webStorage.session.setItem(WEB_STORAGE_KEY.AUTHENTICATION_TOKEN, token);
      }
    } else {
      webStorage.removeFromWebStorage(WEB_STORAGE_KEY.AUTHENTICATION_TOKEN);
    }
  },

  clearAuthenticatedProfileData() {
    this.token = null;
    webStorage.removeFromWebStorage(WEB_STORAGE_KEY.AUTHENTICATION_TOKEN);
  }
};

export default authenticationManager;
export {AuthenticationToken};
