import {stringifySearchParamsObject} from "../../../utils/url/urlUtils";
import {PRISM_MAX_IMAGE_QUALITY} from "./prismConstants";

interface PrismOptions {
  height?: number;
  width?: number;
  quality?: number;
}

/**
 * Generate a Prism url.
 * @param {PrismOptions} options Provide options to customize the generated url
 * @returns {function} A function that expects a base url and returns the full Prism url.
 */
function generatePrismUrl({
  height,
  width,
  quality = PRISM_MAX_IMAGE_QUALITY
}: PrismOptions) {
  const params: {w?: string; h?: string; quality: string} = {quality: `${quality}`};

  if (width) {
    params.w = `${width}`;
  }

  if (height) {
    params.h = `${height}`;
  }

  const searchString = stringifySearchParamsObject(params as {[x: string]: string});

  return (url: string) => `${url}?${searchString}`;
}

export {generatePrismUrl};
