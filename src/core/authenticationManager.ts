import webStorage from "./webStorage";
import {TAccessToken} from "./network-manager/networkModels";

const authenticationManager = {
  token: webStorage.getFromWebStorage("token"),

  getToken() {
    return this.token;
  },

  updateToken(token: TAccessToken, shouldPersistToLocalStorage: boolean) {
    this.token = token;

    if (token) {
      if (shouldPersistToLocalStorage) {
        webStorage.local.setItem("token", token);
      } else {
        webStorage.session.setItem("token", token);
      }
    } else {
      webStorage.removeFromWebStorage("token");
    }
  },

  clearAuthenticatedProfileData() {
    this.token = null;
    webStorage.removeFromWebStorage("token");
  }
};

export default authenticationManager;
