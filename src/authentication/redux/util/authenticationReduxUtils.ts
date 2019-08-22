import {ReduxStoreShape} from "../../../core/redux/models/store";

function authenticationProfileSelector(state: ReduxStoreShape) {
  return state.authenticationState.authenticatedProfile;
}

export {authenticationProfileSelector};
