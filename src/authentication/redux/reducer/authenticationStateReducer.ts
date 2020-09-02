import {
  generateInitialAuthenticationState,
  AuthenticationState
} from "../authenticationState";
import {ReduxActionWithPayload} from "../../../core/redux/models/action";

function authenticationStateReducer(
  state = generateInitialAuthenticationState(),
  action: ReduxActionWithPayload
): AuthenticationState {
  const newState = state;

  switch (action.type) {
    default:
      break;
  }

  return newState;
}

export default authenticationStateReducer;
