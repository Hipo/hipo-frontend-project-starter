import {networkManager} from "../..";
import {UserProfileModel} from "./authenticationApiModels";
import apiHandler from "../../core/network-manager/apiHandler";

const authenticationApi = {
  getAuthUser() {
    return apiHandler<UserProfileModel>(networkManager, "get", "/users/me/");
  }
};

export default authenticationApi;
