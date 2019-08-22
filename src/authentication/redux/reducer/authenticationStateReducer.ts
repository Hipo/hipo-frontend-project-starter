import {
  generateInitialAuthenticationState,
  TAuthenticationState
} from "../authenticationState";
import {TReduxActionWithPayload} from "../../../core/redux/models/action";

function authenticationStateReducer(
  state = generateInitialAuthenticationState(),
  action: TReduxActionWithPayload
): TAuthenticationState {
  switch (action.type) {
    default:
      return state;
  }
}

export {authenticationStateReducer};
