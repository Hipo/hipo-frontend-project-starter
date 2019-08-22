import {UserProfileModel} from "../model/authenticationEndpointModels";

export type TAuthenticationState = ReturnType<typeof generateInitialAuthenticationState>;
export type TAuthenticatedProfile = TAuthenticationState["authenticatedProfile"];

function generateInitialAuthenticationState(profile?: UserProfileModel) {
  return {
    authenticatedProfile: profile || null
  };
}

export {generateInitialAuthenticationState};
