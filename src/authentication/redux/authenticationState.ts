import {UserProfileModel} from "../api/authenticationApiModels";

export type AuthenticationState = ReturnType<typeof generateInitialAuthenticationState>;
export type AuthenticatedProfile = AuthenticationState["authenticatedProfile"];

function generateInitialAuthenticationState(profile?: UserProfileModel) {
  return {
    authenticatedProfile: profile || null
  };
}

export {generateInitialAuthenticationState};
