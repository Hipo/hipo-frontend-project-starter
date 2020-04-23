import {LocationDescriptorObject} from "history";

function generateRedirectStateFromLocation(location: LocationDescriptorObject) {
  return {
    from: location,
    ...location.state
  };
}

export {generateRedirectStateFromLocation};
