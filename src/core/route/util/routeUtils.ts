function generateRedirectStateFromLocation(
  location: any,
  shouldOverwriteState?: boolean
) {
  return {
    from: location,
    ...(shouldOverwriteState ? location.state : {})
  };
}

export {generateRedirectStateFromLocation};
